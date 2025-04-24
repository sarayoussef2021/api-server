const express = require('express');
const app = express();

// Middleware pour gérer CORS et autres configurations
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://celadon-dusk-483980.netlify.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// Exemple de route
app.get('/', (req, res) => {
  res.send('Hello, this is your API server!');
});

module.exports = app;
