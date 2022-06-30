require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cenralErrors = require('./middlewares/central-err');

const { PORT = 3000, NODE_ENV, DATA_BASE } = process.env;
const app = express();

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(NODE_ENV === 'production' ? DATA_BASE : 'mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true, useUnifiedTopology: true,
}, (err) => {
  if (err) throw err;
});

app.use(requestLogger);

app.use(cors({
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
  origin: [

  ],
}));

app.use('/', require('./routes/index'));

app.use(cenralErrors);

app.use(errorLogger);

app.listen(PORT);
