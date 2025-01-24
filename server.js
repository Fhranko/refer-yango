require('dotenv').config(); // Cargar variables de entorno
const express = require('express');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');

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
	const { name, license, account_number, bank } = req.body;

	try {
		const { data, error } = await supabase
			.from('drivers')
			.insert([{ name, license, account_number, bank }]);

		if (error) throw error;

		res.send('Conductor registrado con éxito.');
	} catch (error) {
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
	const { refererId, referredId } = req.body;

	try {
		// Verifica que un conductor no sea referido por sí mismo
		if (refererId === referredId) {
			return res.status(400).json({ message: 'Un conductor no puede referirse a sí mismo.' });
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
					message: 'Referido de nivel 1 registrado. No se encontró referidor de nivel 2.',
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

		res.json({ message: 'Referido registrado con éxito.' });
	} catch (error) {
		res.status(400).json({ message: 'Error al registrar el referido: ' + error.message });
	}
});

// Nueva ruta para obtener referidos de nivel 1
app.get('/refer-level/:id', async (req, res) => {
	const refererId = req.params.id;
	const { startDate, endDate, name } = req.query; // Obtén los parámetros de consulta

	try {
		// Construye la consulta de forma dinámica
		let query = supabase
			.from('referrals')
			.select('*, drivers!referrals_referred_id_fkey(*)')
			.eq('referer_id', refererId);

		// Filtro por rango de fechas
		if (startDate && endDate) {
			query = query.gte('created_at', startDate).lte('created_at', endDate);
		}

		// Filtro por nombre
		if (name) {
			query = query.ilike('drivers.name', `%${name}%`);
		}

		const { data, error } = await query;

		if (error) {
			console.log(error);
			throw error;
		}

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

// Iniciar el servidor
app.listen(PORT, () => {
	console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
