// routes/drivers.js
const express = require('express');
const { getDrivers } = require('../services/driverService');
const {
	registerReferral,
	getReport,
	generateExcel,
	updateReferral,
} = require('../services/referralService');

const router = express.Router();

router.get('/register', async (req, res) => {
	try {
		const drivers = await getDrivers();

		res.render('refer', { drivers });
	} catch (error) {
		res
			.status(500)
			.send({ status: 'error', message: 'Error al obtener los conductores: ' + error.message });
	}
});

router.post('/register', async (req, res) => {
	const { referer_id, referred_id } = req.body;

	try {
		const data = await registerReferral({ referer_id, referred_id });

		res.send(data);
	} catch (error) {
		console.log('🚀 ~ router.post ~ error:', error);
		res
			.status(400)
			.send({ status: 'error', message: 'Error al registrar el conductor: ' + error.message });
	}
});

router.get('/report', async (req, res) => {
	const { refererId, startDate, endDate, paid } = req.query;

	try {
		const data = await getReport({ refererId, startDate, endDate, paid });

		res.send(data);
	} catch (error) {
		res
			.status(500)
			.send({ status: 'error', message: 'Error al obtener los referidos: ' + error.message });
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
