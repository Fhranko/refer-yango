// services/driverService.js
const { supabase } = require('../config');
const XLSX = require('xlsx');
const { formatSupabaseError } = require('../utils/errorHandler'); // Importar función reutilizable

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const registerReferral = async (referralsData) => {
	console.log('🚀 ~ registerReferral ~ referralsData:', referralsData);
	try {
		const { referrerId, referredId } = referralsData;

		// Validaciones de entrada
		if (!referrerId || !referredId) {
			throw new Error('Los IDs de referidor y referido son obligatorios.');
		}

		if (referrerId === referredId) {
			throw new Error('Un conductor no puede referirse a sí mismo.');
		}

		// Verificar si el referido ya tiene un referidor
		const existingReferral = await prisma.referral.findFirst({
			where: { referredId: referredId },
		});

		console.log(existingReferral);

		if (existingReferral) {
			throw new Error('El referido ya fue registrado anteriormente.');
		}

		// Insertar el referido
		const newReferral = await prisma.referral.create({
			data: referralsData,
		});

		return { status: 'success', message: 'Referido registrado', referral: newReferral };
	} catch (error) {
		throw error;
	}
};

const getReferrals = async (filters) => {
	console.log('🚀 ~ getReferrals ~ filters:', filters);
	const { referrerId, referredId, objStatus, referralDateRange, paid } = filters;

	try {
		// Construcción del filtro dinámico
		const where = {};

		if (referrerId !== null && referrerId !== '' && referrerId !== 'null') {
			where.referrerId = Number(referrerId);
		}

		if (referredId !== null && referredId !== '' && referredId !== 'null') {
			where.referredId = Number(referredId);
		}

		if (objStatus !== null && objStatus !== '' && objStatus !== 'null') {
			where.objStatus = objStatus;
		}

		// if (paid !== undefined) where.paid = paid;
		if (referralDateRange !== null && referralDateRange !== '' && referralDateRange !== 'null') {
			where.referralDate = {};
			if (referralDateRange[0]) where.referralDate.gte = new Date(referralDateRange[0]);
			if (referralDateRange[1]) where.referralDate.lte = new Date(referralDateRange[1]);
		}

		// Consulta a Prisma
		const data = await prisma.referral.findMany({
			where,
			include: {
				referrer: true, // Relación con el referidor
				referred: true, // Relación con el referido
			},
			orderBy: { referralDate: 'desc' }, // Ordenar por fecha descendente
		});

		return data;
	} catch (error) {
		console.error('Error al obtener referidos:', error);
		throw new Error('Error al obtener los referidos, inténtelo más tarde.');
	}
};

const generateExcel = async (data) => {
	const formatData = data.map((row, i) => ({
		nro: i + 1,
		id: row.id,
		nivel: row.level,
		monto: row.amount,
		pagado: row.paid,
		registro: row.created_at,
		referidor: row.referred?.name || 'Desconocido',
		referido: row.referer?.name || 'Desconocido',
	}));

	// 1. Crear un libro y hoja de Excel
	const workbook = XLSX.utils.book_new();
	const worksheet = XLSX.utils.json_to_sheet(formatData);
	XLSX.utils.book_append_sheet(workbook, worksheet, 'Referidos');

	// 2. Escribir el archivo en buffer
	const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

	// 3. Retornar el buffer
	return excelBuffer;
};

async function updateReferral(referralId, updateData) {
	try {
		// Filtrar solo los campos permitidos para evitar actualizaciones no deseadas
		const allowedFields = ['paid', 'referer_id', 'referred_id', 'date']; // Agrega más si es necesario
		const filteredData = Object.keys(updateData)
			.filter((key) => allowedFields.includes(key))
			.reduce((obj, key) => {
				obj[key] = updateData[key];
				return obj;
			}, {});

		// Si no hay datos válidos para actualizar, retorna sin cambios
		if (Object.keys(filteredData).length === 0) {
			throw new Error('No se proporcionaron campos válidos para actualizar.');
		}

		// Actualizar en Supabase
		const { data, error } = await supabase
			.from('referrals') // Nombre de la tabla en Supabase
			.update(filteredData)
			.eq('id', referralId)
			.select(); // Para devolver la data actualizada

		if (error) throw error;

		return data.length ? data[0] : null;
	} catch (error) {
		console.error('Error en updateReferral:', error);
		throw error;
	}
}

module.exports = { updateReferral };

module.exports = {
	registerReferral,
	getReferrals,
	generateExcel,
	updateReferral,
};
