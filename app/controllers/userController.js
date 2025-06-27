const User = require('../models/User');

exports.cadastrar = (req, res) => {
    const { email, senha } = req.body;
    User.findByEmail(email, (err, user) => {
        if (user) {
            return res.send('Usuário já cadastrado! <a href="/cadastro">Voltar</a>');
        }
        User.create(email, senha, (err) => {
            if (err) {
                return res.send('Erro ao cadastrar! <a href="/cadastro">Tentar novamente</a>');
            }
            res.send('Cadastro realizado com sucesso! <a href="/login">Ir para login</a>');
        });
    });
};

exports.login = function(req, res) {
    const { email, senha } = req.body;

    User.findByEmailAndSenha(email, senha, function(err, user) {
        if (user) {
            // Salva informações do usuário na sessão
            req.session.userId = user.id;
            req.session.email = user.email;
            res.redirect('/dashboard');
        } else {
            res.send('Usuário ou senha inválidos! <a href="/login">Tentar novamente</a>');
        }
    });
};
