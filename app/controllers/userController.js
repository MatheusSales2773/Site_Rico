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

exports.login = (req, res) => {
    const { email, senha } = req.body;
    User.findByEmailAndSenha(email, senha, (err, user) => {
        if (user) {
            res.send('Login realizado com sucesso! <a href="/">Ir para home</a>');
        } else {
            res.send('Usuário ou senha inválidos! <a href="/login">Tentar novamente</a>');
        }
    });
};