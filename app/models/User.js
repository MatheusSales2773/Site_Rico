const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./site_rico.db');

exports.createTable = () => {
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        senha TEXT
    )`);
};

exports.createAvaliacaoTable = () => {
    db.run(`CREATE TABLE IF NOT EXISTS avaliacoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_usuario INTEGER,
        nota INTEGER,
        texto TEXT,
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
    )`);
};

exports.createAvaliacao = (id_usuario, nota, texto, callback) => {
    db.run('INSERT INTO avaliacoes (id_usuario, nota, texto) VALUES (?, ?, ?)', [id_usuario, nota, texto], callback);
};

exports.updateAvaliacao = (id_usuario, nota, texto, callback) => {
    db.run('UPDATE avaliacoes SET nota = ?, texto = ? WHERE id_usuario = ?', [nota, texto, id_usuario], callback);
};

exports.deleteAvaliacao = (id_usuario, callback) => {
    db.run('DELETE FROM avaliacoes WHERE id_usuario = ?', [id_usuario], callback);
};

exports.findAvaliacaoByUsuario = (id_usuario, callback) => {
    db.get('SELECT * FROM avaliacoes WHERE id_usuario = ?', [id_usuario], callback);
};

exports.findAllAvaliacoes = (callback) => {
    db.all(`
        SELECT a.nota, a.texto, u.email 
        FROM avaliacoes a
        JOIN usuarios u ON u.id = a.id_usuario
    `, callback);
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

exports.findById = (id, callback) => {
    db.get('SELECT * FROM usuarios WHERE id = ?', [id], callback);
};