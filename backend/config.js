// // config.js

// module.exports = {
// 	SUPABASE_URL: process.env.SUPABASE_URL,
// 	SUPABASE_KEY: process.env.SUPABASE_KEY,
// 	PORT: process.env.PORT || 3000,
// };

// require('dotenv').config(); // Asegura que las variables de entorno se carguen

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
	console.error('❌ Error: Las variables de entorno de Supabase no están definidas.');
	process.exit(1); // Detener ejecución si falta alguna variable
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = {
	supabase,
	PORT: process.env.PORT || 3000,
};
