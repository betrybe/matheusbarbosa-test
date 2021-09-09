const app = require('./app');

const PORT = 3000;

if (require.main === module) {
    app.listen(PORT, () => console.log(`conectado na porta ${PORT}`));
}

module.exports = app;
