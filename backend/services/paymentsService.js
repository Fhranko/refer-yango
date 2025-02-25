// services/driverService.js
const { supabase } = require('../config');

const registerPayment = async (paymentData) => {
	const { driver_id, level, amount, status, referrals_id } = paymentData;

	const { data, error } = await supabase.from('drivers').insert([
		{
			driver_id,
			level,
			amount,
			status,
			referrals_id,
		},
	]);

	if (error) {
		console.log('🚀 ~ registerDriver ~ error:', error);
		throw error;
	}

	return data;
};

// const getDrivers = async () => {
// 	const { data, error } = await supabase.from('drivers').select('*');

// 	if (error) {
// 		throw error;
// 	}
// 	return data;
// };

module.exports = {
	registerPayment,
};
