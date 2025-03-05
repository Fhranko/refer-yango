const express = require('express');
const { registerDriver, getDrivers } = require('../services/driverService');

const router = express.Router();

router.get('/', async (req, res, next) => {
	try {
		const drivers = await getDrivers();
		res.json(drivers);
	} catch (error) {
		next(error); // Pasamos el error al middleware global
	}
});

router.post('/register', async (req, res, next) => {
	const { name, license, cellphone, city } = req.body;

	try {
		await registerDriver({
			name,
			license,
			cellphone: cellphone || null,
			city: city.code,
		});

		res.json({ status: 'success', message: 'Conductor registrado con éxito.' });
	} catch (error) {
		next(error); // Pasamos el error al middleware global
	}
});

module.exports = router;
