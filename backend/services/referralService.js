// services/driverService.js
const { supabase } = require('../config');
const XLSX = require('xlsx');

const registerReferral = async (referralsData) => {
	const { referer_id, referred_id } = referralsData;

	// Validación de entrada
	if (!referer_id || !referred_id) {
		return {
			status: 'error',
			message: 'Los IDs de referidor y referido son obligatorios.',
		};
	}

	if (referer_id === referred_id) {
		return {
			status: 'error',
			message: 'Un conductor no puede referirse a sí mismo.',
		};
	}

	try {
		// Validar si la relación referer_id -> referred_id ya existe
		const { data: existingReferral, error: existingError } = await supabase
			.from('referrals')
			.select('referer_id')
			.eq('referred_id', referred_id)
			.eq('referer_id', referer_id)
			.limit(1)
			.single();

		if (existingError && existingError.code !== 'PGRST116') {
			throw existingError;
		}

		if (existingReferral) {
			return {
				status: 'error',
				message: 'El referido y el referidor ya están asociados previamente.',
			};
		}

		// Validar si el referido ya tiene otro referidor de nivel 1
		const { data: previousReferral, error: previousError } = await supabase
			.from('referrals')
			.select('referer_id')
			.eq('referred_id', referred_id)
			.eq('level', 1)
			.limit(1)
			.single();

		if (previousError && previousError.code !== 'PGRST116') {
			throw previousError;
		}

		if (previousReferral) {
			return {
				status: 'error',
				message: 'El referido ya fue registrado anteriormente.',
			};
		}

		// Insertar el referido de nivel 1
		const { data: newReferral, error: insertError } = await supabase
			.from('referrals')
			.insert([{ referer_id: referer_id, referred_id: referred_id, level: 1, amount: 20 }])
			.select(); // Devuelve la fila insertada

		if (insertError) {
			throw insertError;
		}

		// Buscar el referidor del referidor (nivel 2)
		const { data: parentReferral, error: parentError } = await supabase
			.from('referrals')
			.select('referer_id')
			.eq('referred_id', referer_id)
			.eq('level', 1)
			.limit(1)
			.single();

		if (parentError && parentError.code !== 'PGRST116') {
			throw parentError;
		}

		if (!parentReferral) {
			return {
				status: 'success',
				message: 'Referido registrado con éxito en nivel 1.',
				referral: newReferral,
			};
		}

		// Insertar el referido de nivel 2
		const { data: level2Referral, error: level2Error } = await supabase
			.from('referrals')
			.insert([
				{ referer_id: parentReferral.referer_id, referred_id: referred_id, level: 2, amount: 10 },
			])
			.select();

		if (level2Error) {
			throw level2Error;
		}

		return {
			status: 'success',
			message: 'Referido registrado con éxito en nivel 1 y 2.',
			referrals: {
				level1: newReferral,
				level2: level2Referral,
			},
		};
	} catch (error) {
		console.error('Error en la referencia:', error);

		return {
			status: 'error',
			message: 'Error al registrar el referido.',
			details: error.message || 'Error desconocido.',
		};
	}
};

const getReport = async (filters) => {
	const { refererId, startDate, endDate, paid } = filters;

	// Parsear las fechas
	const start = startDate ? new Date(startDate) : null;
	const end = endDate ? new Date(endDate) : null;

	try {
		// Inicializamos la consulta
		let query = supabase.from('referrals').select(
			`
      *,
      referer:drivers!referrals_referer_id_fkey(*),
      referred:drivers!referrals_referred_id_fkey(*)
    `
		);
		if (refererId) {
			query = query.eq('referer_id', refererId);
		}

		// Agregar condición de fecha si se proporcionan
		if (start) {
			query = query.gte('referral_date', start.toISOString()); // Filtrar por fecha de inicio (mayor o igual)
		}
		if (end) {
			query = query.lte('referral_date', end.toISOString()); // Filtrar por fecha de fin (menor o igual)
		}
		if (paid) {
			query = query.eq('paid', paid); // Filtrar por fecha de fin (menor o igual)
		}

		// Ejecutar la consulta
		let { data, error } = await query;

		data = data.map((item) => ({
			...item,
			created_at: new Date(item.created_at).toLocaleDateString('es-ES', {
				day: '2-digit',
				month: '2-digit',
				year: '2-digit',
			}),
		}));

		// Manejo de error
		if (error) {
			console.log(error);
			throw error;
		}

		// Devolver los datos
		return data;
	} catch (error) {
		console.log('🚀 ~ getReport ~ error:', error);
		res.status(400).json({ message: 'Error al obtener los referidos: ' + error.message });
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
	getReport,
	generateExcel,
	updateReferral,
};
