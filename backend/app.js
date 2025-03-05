// app.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const driversRouter = require('./routes/drivers');
const referralsRouter = require('./routes/referrals');
const { PORT } = require('./config');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

app.use('/drivers', driversRouter);
app.use('/referrals', referralsRouter);

app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
