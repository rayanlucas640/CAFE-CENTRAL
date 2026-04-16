/* ===========================================================
   ☕ CAFÉ CENTRAL - SERVIDOR BACKEND (NODE + EXPRESS)
=========================================================== */

/* =========================
   1) IMPORTAÇÕES
========================= */

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const pool = require("./db.js");

const app = express();


/* =========================
   2) ORIGENS PERMITIDAS
========================= */

const listOrigins = [
    "http://localhost:5501",
    "http://127.0.0.1:5501",
    "http://localhost:5502",
    "http://127.0.0.1:5502",
    "https://rayanlucas640.github.io."
];

app.use(cors({
    origin: listOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());


/* =========================
   3) SESSÃO DO USUÁRIO
========================= */

const sessionConfig = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: "cafecentral.sid",
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 // 1 hora
    }
};

if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
    sessionConfig.cookie.sameSite = "none";
    sessionConfig.cookie.secure = true;
} else {
    sessionConfig.cookie.sameSite = "lax";
    sessionConfig.cookie.secure = false;
}

app.use(session(sessionConfig));


/* ===========================================================
   4) ROTAS
=========================================================== */


/* ===== CONTATO ===== */

app.post("/mensagem", (req, res) => {
    console.log("☕ Nova mensagem recebida:", req.body);
    res.send("Mensagem recebida com sucesso pelo Café Central!");
});


/* ===== CADASTRO ===== */

app.post("/cadastro", async (req, res) => {
    try {

        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({ erro: "Preencha todos os campos" });
        }

        const [rows] = await pool.execute(
            "SELECT id FROM tb_usuarios WHERE email=?",
            [email]
        );

        if (rows.length > 0) {
            return res.status(409).json({ erro: "E-mail já cadastrado" });
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        await pool.execute(
            "INSERT INTO tb_usuarios(nome,email,senha) VALUES(?,?,?)",
            [nome, email, senhaHash]
        );

        res.status(201).json({
            mensagem: "☕ Cadastro realizado com sucesso no Café Central!"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro ao cadastrar usuário" });
    }
});


/* ===== LOGIN ===== */

app.post("/login", async (req, res) => {
    try {

        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ erro: "Preencha todos os campos" });
        }

        const [rows] = await pool.execute(
            "SELECT id, nome, email, senha FROM tb_usuarios WHERE email=?",
            [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({ erro: "Usuário não encontrado" });
        }

        const usuario = rows[0];

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            return res.status(401).json({ erro: "Senha inválida" });
        }

        req.session.usuario = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        };

        res.json({
            mensagem: "☕ Login realizado com sucesso!"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro ao fazer login" });
    }
});


/* ===== VER SESSÃO ===== */

app.get("/me", (req, res) => {

    if (!req.session.usuario) {
        return res.status(401).json({ logado: false });
    }

    res.json({
        logado: true,
        usuario: req.session.usuario
    });
});


/* ===== LOGOUT ===== */

app.post("/logout", (req, res) => {

    req.session.destroy(() => {
        res.clearCookie("cafecentral.sid");
        res.json({ mensagem: "Logout realizado com sucesso ☕" });
    });
});


/* =========================
   5) INICIAR SERVIDOR
========================= */

app.listen(3000, () => {
    console.log("☕ Café Central Server rodando em http://localhost:3000");
});