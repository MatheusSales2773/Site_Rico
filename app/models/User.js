const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./site_rico.db');

exports.createTable = () => {
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        senha TEXT
    )`);
};

exports.create = (email, senha, callback) => {
    db.run('INSERT INTO usuarios (email, senha) VALUES (?, ?)', [email, senha], callback);
};

exports.findByEmailAndSenha = (email, senha, callback) => {
    db.get('SELECT * FROM usuarios WHERE email = ? AND senha = ?', [email, senha], callback);
};

exports.findByEmail = (email, callback) => {
    db.get('SELECT * FROM usuarios WHERE email = ?', [email], callback);
};