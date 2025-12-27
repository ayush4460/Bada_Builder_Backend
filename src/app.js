const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors());

// Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging Middleware
app.use(requestLogger);

// Routes
app.use(routes);

// Error Handling Middleware
app.use(errorHandler);

module.exports = app;
