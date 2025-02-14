require('dotenv').config(); // Cargar variables de entorno
const express = require('express');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');

const XLSX = require('xlsx');

// Configuración de Supabase
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const app = express();
const PORT = 3000;

// Configuración de vistas y middlewares
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

// Ruta para mostrar el formulario
app.get('/register', (req, res) => {
	res.render('form');
});

// Ruta para manejar el registro de conductores
app.post('/register', async (req, res) => {
	const { name, license, cellphone, city } = req.body;
	console.log(req.body);

	try {
		const { data, error } = await supabase
			.from('drivers')
			.insert([{ name, license, cellphone, city }]);

		if (error) throw error;

		res.send('Conductor registrado con éxito.');
	} catch (error) {
		console.log(error);
		res.status(400).send('Error al registrar el conductor: ' + error.message);
	}
});

// Asociar

// Ruta para mostrar el formulario de referidos
app.get('/refer', async (req, res) => {
	try {
		// Obtén todos los drivers desde Supabase
		const { data: drivers, error } = await supabase.from('drivers').select('id, name');

		if (error) throw error;

		// Renderiza la vista y pasa los conductores
		res.render('refer', { drivers });
	} catch (error) {
		res.status(500).send('Error al obtener los conductores: ' + error.message);
	}
});

// Ruta para guardar el referido
app.post('/refer', async (req, res) => {
	//validar que el referido y el referidor no estén previamente asociados

	const { refererId, referredId } = req.body;

	try {
		// Verifica que un conductor no sea referido por sí mismo
		if (refererId === referredId) {
			return res.status(400).json({
				error: true,
				message: 'Un conductor no puede referirse a sí mismo.',
			});
		}

		// const existingReferral = await Referral.findOne({ where: { refererId, referredId } });

		const { data: existingReferral, err } = await supabase
			.from('referrals')
			.select('referer_id')
			.eq('referred_id', referredId)
			.eq('referer_id', refererId)
			.limit(1)
			.single();

		if (existingReferral) {
			return res.status(400).json({
				error: true,
				message: 'El referido y el referidor ya están asociados previamente.',
			});
		}

		const { data: previousReferal, error: errorPreviousReferal } = await supabase
			.from('referrals')
			.select('referer_id')
			.eq('referred_id', referredId)
			.eq('level', 1)
			.limit(1)
			.single();

		if (previousReferal) {
			return res.status(400).json({
				error: true,
				message: 'El referido ya fue registrado anteriormente.',
			});
		}

		// Guarda el referido en la tabla
		const { data, error } = await supabase
			.from('referrals')
			.insert([{ referer_id: refererId, referred_id: referredId, level: 1, amount: 20 }]);

		if (error) {
			console.log(error);
			throw error;
		}

		const { data: parentReferral, error: parentError } = await supabase
			.from('referrals')
			.select('referer_id')
			.eq('referred_id', refererId)
			.eq('level', 1) // Confirmamos que sea nivel 1
			.limit(1)
			.single(); // Solo necesitamos un resultado

		if (parentError) {
			if (parentError.code === 'PGRST116') {
				// No hay referidor de nivel superior, no hacemos nada.
				return res.json({
					error: false,
					message: 'Referido registrado',
				});
			}
			console.error(parentError);
			throw parentError;
		}

		const { data: level2Referral, error: level2Error } = await supabase.from('referrals').insert([
			{
				referer_id: parentReferral.referer_id, // El referidor original
				referred_id: referredId, // El nuevo referido
				level: 2, // Nivel 2
				amount: 10, // Monto de nivel 2
			},
		]);

		if (level2Error) {
			console.error(level2Error);
			throw level2Error;
		}

		res.json({ message: 'Referido L1 y L2 registrados con exito.', error: false });
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: 'Error al registrar el referido: ' + error.message });
	}
});

// Nueva ruta para obtener referidos de nivel 1
app.get('/refer-level', async (req, res) => {
	const { refererId, startDate, endDate, paid } = req.query;
	console.log(req.query);

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
		res.json(data);
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: 'Error al obtener los referidos: ' + error.message });
	}
});

app.post('/update-paid-status', async (req, res) => {
	const { referralId, paid } = req.body;

	if (!referralId || paid === undefined) {
		return res.status(400).json({ success: false, message: 'Faltan datos' });
	}

	try {
		// Actualizar la base de datos
		const { data, error } = await supabase.from('referrals').update({ paid }).eq('id', referralId);

		if (error) {
			console.error('Error actualizando estado de pago:', error);
			return res.status(500).json({ success: false, message: 'Error al actualizar el estado' });
		}

		res.json({ success: true, message: 'Estado actualizado correctamente' });
	} catch (err) {
		console.error('Error:', err);
		res.status(500).json({ success: false, message: 'Error al procesar la solicitud' });
	}
});

app.get('/download-excel', async (req, res) => {
	// 1. Datos para el archivo Excel

	const { refererId, startDate, endDate, paid } = req.query;

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
		const { data, error } = await query;
		console.log(data);

		const formatData = data.map((row, i) => {
			return {
				nro: i + 1,
				id: row.id,
				Nivel: row.level,
				monto: row.amount,
				pagado: row.paid,
				registro: row.created_at,
				referidor: row.referred.name,
				referido: row.referer.name,
			};
		});

		// Manejo de error
		if (error) {
			console.log(error);
			throw error;
		}

		// 2. Crea un libro de trabajo (workbook) y una hoja (sheet)
		const workbook = XLSX.utils.book_new();
		const worksheet = XLSX.utils.json_to_sheet(formatData);
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');

		// 3. Escribe el archivo Excel en formato de buffer
		const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

		// 4. Envía el archivo como descarga
		res.setHeader(
			'Content-Disposition',
			'attachment; filename="referidos.xlsx"' // Nombre del archivo
		);
		res.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		res.send(excelBuffer);
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: 'Error al obtener los referidos: ' + error.message });
	}
});

const formatDate = (dateStr) => {
	const date = new Date(dateStr);
	const formattedDate = format(date, 'dd-MM-yy', { locale: es });

	return formattedDate;
};

// Iniciar el servidor
app.listen(PORT, () => {
	console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
