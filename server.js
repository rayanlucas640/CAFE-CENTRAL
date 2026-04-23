/* ===========================================================
   ☕ CAFÉ CENTRAL - SERVIDOR BACKEND (NODE + EXPRESS)
=========================================================== */

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const pool = require("./db.js");

const app = express();

/* =========================
   CORS
========================= */

const listOrigins = [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:5502",
    "http://127.0.0.1:5502",
    "https://rayanlucas640.github.io"
];

app.use(cors({
    origin: listOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

/* =========================
   SESSÃO
========================= */

const sessionConfig = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: "cafecentral.sid",
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60
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
   ROTAS
=========================================================== */

/* ===== CONTATO ===== */

app.post("/mensagem", async (req, res) => {
    try {
        const { nome, email, mensagem } = req.body;

        if (!nome || !email || !mensagem) {
            return res.status(400).json({ erro: "Preencha todos os campos" });
        }

        await pool.execute(
            "INSERT INTO tb_mensagem(nome,email,mensagem) VALUES(?,?,?)",
            [nome, email, mensagem]
        );

        return res.status(201).json({ mensagem: "Mensagem enviada com sucesso!" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ erro: "Erro ao enviar mensagem" });
    }
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

        return res.status(201).json({
            mensagem: "☕ Cadastro realizado com sucesso no Café Central!"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ erro: "Erro ao cadastrar usuário" });
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

        return res.json({
            mensagem: "☕ Login realizado com sucesso!"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ erro: "Erro ao fazer login" });
    }
});

/* ===== VER SESSÃO ===== */

app.get("/me", (req, res) => {
    return res.json({
        logado: true,
        usuario: {
            id: 1,
            nome: "Dev",
            email: "dev@teste.com"
        }
    });
});

/* ===== LOGOUT ===== */

app.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("cafecentral.sid");
        return res.json({ mensagem: "Logout realizado com sucesso ☕" });
    });
});

/* =========================
   START SERVER
========================= */

app.listen(3000, () => {
    console.log("☕ Café Central Server rodando em http://localhost:3000");
});