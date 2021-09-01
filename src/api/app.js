const express = require('express');
const path = require('path');
const router = require('./routes/routes');

const app = express();

// Não remover esse end-point, ele é necessário para o avaliador
app.get('/', (request, response) => {
  response.send();
});
// Não remover esse end-point, ele é necessário para o avaliador

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

app.use('/images', express.static(path.join(__dirname, '..', 'uploads')));

module.exports = app;
