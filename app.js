const express = require('express');

const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const router = require('./src/router');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const xssClean = require('xss-clean');
const helmet = require('helmet');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cors());
app.use(cookieParser());
app.use(xssClean());
app.use(helmet());

app.use(router);

app.listen(4000, () => {
  console.log('Server is listening on port 4000..');
});

// cek