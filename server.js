const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const userController = require('./app/controllers/userController');
const User = require('./app/models/User');
const app = express();
const PORT = 3000;


app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/partials', express.static(path.join(__dirname, 'app', 'views', 'partials')));

app.use(session({
    secret: 'seuSegredoSuperSecreto',
    resave: false,
    saveUninitialized: false
}));

// Configurar body-parser pra ler dados
app.use(bodyParser.urlencoded({ extended: true }));

User.createTable();

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

app.post('/cadastro', userController.cadastrar);
app.post('/login', userController.login);

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

function requireLogin(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
}

// rota para o dashboard
app.get('/dashboard', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'app', 'views', 'pages', 'dashboard.html'));
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});