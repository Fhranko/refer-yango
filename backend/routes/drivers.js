// routes/drivers.js
const express = require('express');
const { registerDriver, getDrivers } = require('../services/driverService');

const router = express.Router();

router.get('/register', (req, res) => {
	res.render('form');
});

router.post('/register', async (req, res) => {
	const { name, license, cellphone, city } = req.body;

	console.log(req.body);

	try {
		await registerDriver({ name, license, cellphone, city: city.code });
		res.send({ status: 'success', message: 'Conductor registrado con éxito.' });
	} catch (error) {
		res.status(400).send({ status: 'error', message: 'Error: ' + error.message });
	}
});

router.get('/', async (req, res) => {
	try {
		const drivers = await getDrivers();

		res.send(drivers);
	} catch (error) {
		res
			.status(500)
			.send({ status: 'error', message: 'Error al obtener los conductores: ' + error.message });
	}
});

module.exports = router;
