const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static("public"));

const db = new sqlite3.Database("./database.db");

db.serialize(() => {
   db.run(`
 	CREATE TABLE IF NOT EXISTS prontuarios (
  	  id INTEGER PRIMARY KEY AUTOINCREMENT,
  	  paciente_id INTEGER,

    anamnese TEXT,
    avaliacao TEXT,
    evolucao TEXT,
    plano TEXT,

    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
     )	
`);

    db.run(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario TEXT,
            senha TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS pacientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            telefone TEXT,
            diagnostico TEXT
        )
    `);
    db.run(`
	CREATE TABLE IF NOT EXISTS agendamentos (
  	  id INTEGER PRIMARY KEY AUTOINCREMENT,
   	 paciente_id INTEGER,
   	 data TEXT,
   	 horario TEXT,
   	 observacao TEXT
	)
    `);

    db.get("SELECT * FROM usuarios WHERE usuario='admin'", (err, row) => {
        if (!row) {
            db.run(
                "INSERT INTO usuarios (usuario, senha) VALUES (?,?)",
                ["admin", "123456"]
            );
     db.run(`
    CREATE TABLE IF NOT EXISTS agendamentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        paciente_id INTEGER,
        data TEXT,
        horario TEXT,
        observacao TEXT
    )
`);
        }
    });

});

app.post("/login", (req, res) => {

    const { usuario, senha } = req.body;

    db.get(
        "SELECT * FROM usuarios WHERE usuario=? AND senha=?",
        [usuario, senha],
        (err, row) => {

            if (row) {
                return res.json({ sucesso: true });
            }

            res.json({ sucesso: false });
        }
    );

});

app.get("/pacientes", (req, res) => {

    db.all("SELECT * FROM pacientes", [], (err, rows) => {
        res.json(rows);
    });

});

app.post("/pacientes", (req, res) => {

    const { nome, telefone, diagnostico } = req.body;

    db.run(
        "INSERT INTO pacientes(nome, telefone, diagnostico) VALUES(?,?,?)",
        [nome, telefone, diagnostico],
        () => {
            res.json({ sucesso: true });
        }
    );

});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.post("/agendamentos", (req, res) => {

    const { paciente_id, data, horario, observacao } = req.body;

    db.run(
        "INSERT INTO agendamentos (paciente_id, data, horario, observacao) VALUES (?,?,?,?)",
        [paciente_id, data, horario, observacao],
        () => {
            res.json({ sucesso: true });
        }
    );

});

app.get("/agendamentos", (req, res) => {

    db.all(`
        SELECT agendamentos.*, pacientes.nome
        FROM agendamentos
        JOIN pacientes ON pacientes.id = agendamentos.paciente_id
        ORDER BY data, horario
    `, [], (err, rows) => {
        res.json(rows);
    });

});

app.post("/agendamentos", (req, res) => {

    const {
        paciente_id,
        data,
        horario,
        observacao
    } = req.body;

    db.run(
        `INSERT INTO agendamentos
        (paciente_id, data, horario, observacao)
        VALUES (?, ?, ?, ?)`,
        [paciente_id, data, horario, observacao],
        (err) => {

            if(err){
                return res.status(500).json(err);
            }

            res.json({ sucesso:true });
        }
    );

});

app.get("/agendamentos", (req, res) => {

    db.all(`
        SELECT
            agendamentos.*,
            pacientes.nome
        FROM agendamentos
        LEFT JOIN pacientes
        ON pacientes.id = agendamentos.paciente_id
    `,
    [],
    (err, rows) => {

        if(err){
            return res.status(500).json(err);
        }

        res.json(rows);
    });

});

app.get("/pacientes/:id", (req, res) => {

    const id = req.params.id;

    db.get(
        "SELECT * FROM pacientes WHERE id = ?",
        [id],
        (err, row) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(row);
        }
    );

});

app.post("/prontuario/:id", (req, res) => {

    const id = req.params.id;
    const { anamnese, avaliacao, evolucao, plano } = req.body;

    if (!id) {
        return res.status(400).json({ erro: "ID do paciente não informado" });
    }

    db.run(`
        INSERT INTO prontuarios
        (paciente_id, anamnese, avaliacao, evolucao, plano)
        VALUES (?, ?, ?, ?, ?)
    `,
    [id, anamnese, avaliacao, evolucao, plano],
    function(err) {

        if (err) {
            return res.status(500).json({
                erro: "Erro ao salvar prontuário",
                detalhes: err.message
            });
        }

        res.json({
            sucesso: true,
            prontuario_id: this.lastID
        });

    });

});

app.get("/prontuario/:id", (req, res) => {

    const id = req.params.id;

    db.all(`
        SELECT *
        FROM prontuarios
        WHERE paciente_id = ?
        ORDER BY id DESC
    `, [id], (err, rows) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(rows);
    });

});

app.get("/prontuario/:id", (req, res) => {

    const id = req.params.id;

    db.get(
        `SELECT * 
         FROM prontuarios 
         WHERE paciente_id = ? 
         ORDER BY id DESC 
         LIMIT 1`,
        [id],
        (err, row) => {

            if (err) {
                return res.status(500).json({
                    erro: "Erro ao buscar prontuário",
                    detalhes: err.message
                });
            }

            if (!row) {
                return res.json({
                    vazio: true,
                    mensagem: "Nenhum prontuário encontrado"
                });
            }

            res.json(row);
        }
    );

});
app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});
