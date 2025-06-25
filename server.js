const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Servir arquivos estáticos
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/partials', express.static(path.join(__dirname, 'app', 'views', 'partials')));

// Rota para cadastro
app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'app', 'views', 'pages', 'cadastro.html'));
});

// Rota para login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'app', 'views', 'pages', 'login.html'));
});

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});