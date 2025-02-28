// services/driverService.js
const { supabase } = require('../config');
const { formatSupabaseError } = require('../utils/errorHandler'); // Importar función reutilizable

const registerDriver = async (driverData) => {
	const { data: driverFinded, error: driverError } = await supabase
		.from('drivers')
		.select('*')
		.eq('license', driverData.license)
		.limit(1)
		.single();

	if (driverFinded) {
		throw new Error('El conductor ya está registrado.');
	}

	const { data, error } = await supabase.from('drivers').insert([driverData]);

	if (error) {
		console.log('🚀 ~ registerDriver ~ error:', error);
		throw formatSupabaseError(error); // Usamos la función centralizada
	}

	return data;
};

const getDrivers = async () => {
	const { data, error } = await supabase.from('drivers').select('*');

	if (error) {
		throw error;
	}
	return data;
};

module.exports = {
	registerDriver,
	getDrivers,
};
