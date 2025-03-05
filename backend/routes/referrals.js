// routes/drivers.js
const express = require('express');
const { getDrivers } = require('../services/driverService');
const {
	registerReferral,
	getReferrals,
	generateExcel,
	updateReferral,
} = require('../services/referralService');

const router = express.Router();

router.get('/', async (req, res) => {
	const { referrerId, startDate, endDate, paid } = req.query;

	try {
		const data = await getReferrals({ referrerId, startDate, endDate, paid });

		res.send(data);
	} catch (error) {
		res
			.status(500)
			.send({ status: 'error', message: 'Error al obtener los referidos: ' + error.message });
	}
});

// router.get('/register', async (req, res) => {
// 	try {
// 		const drivers = await getDrivers();

// 		res.render('refer', { drivers });
// 	} catch (error) {
// 		res
// 			.status(500)
// 			.send({ status: 'error', message: 'Error al obtener los conductores: ' + error.message });
// 	}
// });

router.post('/', async (req, res, next) => {
	const { referrerId, referredId } = req.body;

	try {
		const data = await registerReferral({ referrerId, referredId });

		res.send(data);
	} catch (error) {
		next(error); // Pasamos el error al middleware global
	}
});

router.get('/excel-report', async (req, res) => {
	const { refererId, startDate, endDate, paid } = req.query;

	try {
		const data = await getReport({ refererId, startDate, endDate, paid });

		if (!data || data.length === 0) {
			return res
				.status(404)
				.send({ status: 'error', message: 'No se encontraron datos para exportar.' });
		}

		const excelBuffer = await generateExcel(data);

		res.setHeader('Content-Disposition', 'attachment; filename=referidos.xlsx');
		res.setHeader(
			'Content-Type',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		);
		res.send(excelBuffer);
	} catch (error) {
		console.error('Error al generar el reporte:', error);
		res
			.status(500)
			.send({ status: 'error', message: 'Error al generar el archivo Excel: ' + error.message });
	}
});

router.patch('/update/:referralId', async (req, res) => {
	const { referralId } = req.params;
	const updateData = req.body; // Recibe los campos a actualizar dinámicamente

	try {
		const updatedReferral = await updateReferral(referralId, updateData);

		if (!updatedReferral) {
			return res.status(404).send({ status: 'error', message: 'Referencia no encontrada' });
		}

		res.send({ status: 'success', message: 'Referencia actualizada', data: updatedReferral });
	} catch (error) {
		console.error('Error al actualizar el referral:', error);
		res
			.status(500)
			.send({ status: 'error', message: 'Error al actualizar el referral: ' + error.message });
	}
});

module.exports = router;
