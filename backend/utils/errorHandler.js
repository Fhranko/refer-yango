// utils/errorHandler.js
function formatSupabaseError(error) {
	if (!error.code) {
		return new Error('Ocurrió un error inesperado.');
	}

	const errorMap = {
		23505: 'La licencia ya se encuentra registrada', // Duplicate key
		22003: 'Número de teléfono demasiado largo', // Duplicate key
	};

	return new Error(errorMap[error.code] || 'Error desconocido.');
}

module.exports = { formatSupabaseError };
