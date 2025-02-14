// services/driverService.js
const { supabase } = require('../config');

const registerDriver = async (driverData) => {
	const { data, error } = await supabase.from('drivers').insert([driverData]);
	if (error) {
		console.log('🚀 ~ registerDriver ~ error:', error);
		throw error;
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
