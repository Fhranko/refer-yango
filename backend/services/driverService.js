const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const registerDriver = async (data) => {
	try {
		const existingDriver = await prisma.driver.findUnique({
			where: { license: data.license },
		});

		if (existingDriver) {
			const error = new Error('La licencia ya está registrada.');
			error.status = 400;
			throw error;
		}

		return await prisma.driver.create({ data });
	} catch (error) {
		throw error; // Pasamos el error para que lo maneje el middleware global
	}
};

const getDrivers = async () => {
	try {
		return await prisma.driver.findMany();
	} catch (error) {
		throw error;
	}
};

module.exports = {
	registerDriver,
	getDrivers,
};
