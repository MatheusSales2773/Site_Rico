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
const ejs = require('ejs');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app', 'views', 'pages'));

app.use(session({
    secret: 'segredo-rico',
    resave: false,
    saveUninitialized: true
}));

// Configurar body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// Garantir criação da tabela User
User.createTable();
User.createAvaliacaoTable();

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

// Rotas de envio de formulário
// Rota para avaliações
app.get('/avaliacoes', (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.redirect('/login');

    User.findAvaliacaoByUsuario(userId, (err, minhaAvaliacao) => {
        User.findAllAvaliacoes((err, todas) => {
            const outras = todas.filter(a => a.email !== req.session.email);
            res.render('avaliacoes', { minhaAvaliacao, outras });
        });
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erro ao encerrar a sessão:', err);
            return res.status(500).send('Erro ao encerrar a sessão.');
        }
        res.redirect('/login');
    });
});


app.get('/dashboard', (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.redirect('/login');
    }

    // você pode passar dados do usuário, se quiser
    User.findById(userId, (err, user) => {
        if (err || !user) {
            console.error("Erro ao buscar usuário no dashboard:", err);
            return res.status(500).send("Erro ao carregar o dashboard.");
        }

        res.render('dashboard', { user });
    });
});


app.post('/avaliacao', (req, res) => {
    const userId = req.session.userId;
    const { nota, texto } = req.body;

    if (!userId) {
        console.log("Tentativa de avaliação sem estar logado.");
        return res.status(401).send('Você precisa estar logado.');
    }

    console.log("Recebido do usuário ID", userId, "-> Nota:", nota, "Texto:", texto);

    User.findAvaliacaoByUsuario(userId, (err, avaliacaoExistente) => {
        if (err) {
            console.error("Erro ao buscar avaliação:", err);
            return res.status(500).send("Erro interno.");
        }

        if (avaliacaoExistente) {
            User.updateAvaliacao(userId, nota, texto, (err) => {
                if (err) {
                    console.error("Erro ao atualizar avaliação:", err);
                    return res.status(500).send("Erro ao atualizar.");
                }
                res.redirect('/avaliacoes');
            });
        } else {
            User.createAvaliacao(userId, nota, texto, (err) => {
                if (err) {
                    console.error("Erro ao criar avaliação:", err);
                    return res.status(500).send("Erro ao criar.");
                }
                res.redirect('/avaliacoes');
            });
        }
    });
});

app.post('/avaliacao/deletar', (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).send("Você precisa estar logado.");
    }

    User.deleteAvaliacao(userId, (err) => {
        if (err) {
            console.error("Erro ao deletar avaliação:", err);
            return res.status(500).send("Erro ao remover avaliação.");
        }

        res.redirect('/avaliacoes');
    });
});

app.post('/cadastro', userController.cadastrar);
app.post('/login', userController.login);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});