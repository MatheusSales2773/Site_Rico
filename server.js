const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const userController = require('./app/controllers/userController');
const User = require('./app/models/User');

const app = express();
const PORT = 3000;


// Servir arquivos estáticos
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/partials', express.static(path.join(__dirname, 'app', 'views', 'partials')));

app.use(session({
    secret: 'seuSegredoSuperSecreto',
    resave: false,
    saveUninitialized: false
}));

// Configurar body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// Garantir criação da tabela User
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

// ✅ Rota para tela de avaliações
app.get('/avaliacoes', (req, res) => {
  res.sendFile(path.join(__dirname, 'app', 'views', 'pages', 'avaliacoes.html'));
});

// Rotas de envio de formulário
app.post('/cadastro', userController.cadastrar);
app.post('/login', userController.login);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});