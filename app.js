const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('./src/router');

const app = express();

// MIDLEWERE
app.use(morgan('dev'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());


app.use(router)

app.listen(4000, () => {
    console.log('Server is listening on port 4000..')
})