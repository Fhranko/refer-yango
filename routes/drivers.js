// routes/drivers.js
const express = require('express');
const { registerDriver } = require('../services/driverService');

const router = express.Router();

router.get('/register', (req, res) => {
	res.render('form');
});

router.post('/register', async (req, res) => {
	const { name, license, cellphone, city } = req.body;

	try {
		await registerDriver({ name, license, cellphone, city });
		res.send({ status: 'success', message: 'Conductor registrado con éxito.' });
	} catch (error) {
		res
			.status(400)
			.send({ status: 'error', message: 'Error al registrar el conductor: ' + error.message });
	}
});

module.exports = router;
