/* ===========================================================
   ☕ CAFÉ CENTRAL - SERVIDOR BACKEND
   NODE + EXPRESS + MYSQL + SESSION
=========================================================== */

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const pool = require("./db.js");

const app = express();

const PORT = 3000;

/* ===========================================================
   CORS
=========================================================== */

const listOrigins = [
    "http://localhost:5500",
    "http://127.0.0.1:5500",

    "http://localhost:5502",
    "http://127.0.0.1:5502",

    "https://rayanlucas640.github.io"
];

app.use(
    cors({
        origin: function (origin, callback) {

            // Permite requisições sem Origin
            // Exemplo: Postman
            if (!origin) {
                return callback(null, true);
            }

            // Permite origens cadastradas
            if (listOrigins.includes(origin)) {
                return callback(null, true);
            }

            console.log("❌ Origem bloqueada pelo CORS:", origin);

            return callback(
                new Error("Bloqueado por CORS")
            );
        },

        credentials: true,

        methods: [
            "GET",
            "POST",
            "PUT",
            "DELETE",
            "OPTIONS"
        ],

        allowedHeaders: [
            "Content-Type",
            "Authorization"
        ]
    })
);


/* ===========================================================
   JSON
=========================================================== */

app.use(express.json());


/* ===========================================================
   SESSÃO
=========================================================== */

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
    console.warn(
        "⚠️ AVISO: SESSION_SECRET não foi encontrado no arquivo .env"
    );
}

const sessionConfig = {
    secret: sessionSecret || "cafe-central-secret-local",
    resave: false,
    saveUninitialized: false,
    name: "cafecentral.sid",
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
        sameSite: "lax",
        secure: false
    }
};


/* ===========================================================
   CONFIGURAÇÃO DA SESSÃO EM PRODUÇÃO
=========================================================== */

if (process.env.NODE_ENV === "production") {

    app.set("trust proxy", 1);

    sessionConfig.cookie.sameSite = "none";
    
    sessionConfig.cookie.secure = true;
}


/* ===========================================================
   ATIVA SESSION
=========================================================== */

app.use(session(sessionConfig));


/* ===========================================================
   ROTA PRINCIPAL
=========================================================== */

app.get("/", (req, res) => {

    res.json({
        sucesso: true,
        mensagem: "☕ Café Central Server está funcionando!",
        servidor: "Node + Express",
        porta: PORT
    });

});


/* ===========================================================
   VERIFICAR SESSÃO / USUÁRIO LOGADO
=========================================================== */

app.get("/me", (req, res) => {

    try {

        // Verifica se existe usuário na sessão
        if (!req.session.usuario) {

            return res.status(401).json({
                logado: false,
                erro: "Usuário não está logado"
            });

        }

        // Usuário está autenticado
        return res.status(200).json({
            logado: true,
            usuario: req.session.usuario
        });

    } catch (error) {

        console.error(
            "❌ Erro ao verificar sessão:",
            error
        );

        return res.status(500).json({
            logado: false,
            erro: "Erro ao verificar sessão"
        });

    }

});


/* ===========================================================
   CONTATO / MENSAGEM
=========================================================== */

app.post("/mensagem", async (req, res) => {

    try {

        const {
            nome,
            email,
            mensagem
        } = req.body;


        /* -----------------------------------------
           VALIDAÇÃO
        ----------------------------------------- */

        if (!nome || !email || !mensagem) {

            return res.status(400).json({
                erro: "Preencha todos os campos"
            });

        }


        /* -----------------------------------------
           INSERT
        ----------------------------------------- */

        await pool.execute(
            `
            INSERT INTO tb_mensagem
            (nome, email, mensagem)
            VALUES (?, ?, ?)
            `,
            [
                nome,
                email,
                mensagem
            ]
        );


        /* -----------------------------------------
           RESPOSTA
        ----------------------------------------- */

        return res.status(201).json({
            mensagem: "Mensagem enviada com sucesso!"
        });


    } catch (error) {

        console.error(
            "❌ Erro ao enviar mensagem:",
            error
        );

        return res.status(500).json({
            erro: "Erro ao enviar mensagem"
        });

    }

});


/* ===========================================================
   CADASTRO
=========================================================== */

app.post("/cadastro", async (req, res) => {

    try {

        const {
            nome,
            email,
            senha
        } = req.body;


        /* -----------------------------------------
           VALIDAÇÃO DOS CAMPOS
        ----------------------------------------- */

        if (!nome || !email || !senha) {

            return res.status(400).json({
                erro: "Preencha todos os campos"
            });

        }


        /* -----------------------------------------
           VERIFICAR EMAIL EXISTENTE
        ----------------------------------------- */

        const [rows] = await pool.execute(
            `
            SELECT id
            FROM tb_usuarios
            WHERE email = ?
            `,
            [email]
        );


        if (rows.length > 0) {

            return res.status(409).json({
                erro: "E-mail já cadastrado"
            });

        }


        /* -----------------------------------------
           CRIPTOGRAFAR SENHA
        ----------------------------------------- */

        const senhaHash = await bcrypt.hash(
            senha,
            10
        );


        /* -----------------------------------------
           CRIAR USUÁRIO
        ----------------------------------------- */

        await pool.execute(
            `
            INSERT INTO tb_usuarios
            (nome, email, senha)
            VALUES (?, ?, ?)
            `,
            [
                nome,
                email,
                senhaHash
            ]
        );


        /* -----------------------------------------
           RESPOSTA
        ----------------------------------------- */

        return res.status(201).json({
            mensagem: "☕ Cadastro realizado com sucesso!"
        });


    } catch (error) {

        console.error(
            "❌ Erro ao cadastrar usuário:",
            error
        );

        return res.status(500).json({
            erro: "Erro ao cadastrar usuário"
        });

    }

});


/* ===========================================================
   LOGIN
=========================================================== */

app.post("/login", async (req, res) => {

    try {

        const {
            email,
            senha
        } = req.body;


        /* -----------------------------------------
           VALIDAÇÃO
        ----------------------------------------- */

        if (!email || !senha) {

            return res.status(400).json({
                erro: "Preencha todos os campos"
            });

        }


        /* -----------------------------------------
           BUSCAR USUÁRIO
        ----------------------------------------- */

        const [rows] = await pool.execute(
            `
            SELECT
                id,
                nome,
                email,
                senha
            FROM tb_usuarios
            WHERE email = ?
            `,
            [email]
        );


        /* -----------------------------------------
           USUÁRIO NÃO ENCONTRADO
        ----------------------------------------- */

        if (rows.length === 0) {

            return res.status(401).json({
                erro: "Usuário não encontrado"
            });

        }


        const usuario = rows[0];


        /* -----------------------------------------
           COMPARAR SENHA
        ----------------------------------------- */

        const senhaCorreta = await bcrypt.compare(
            senha,
            usuario.senha
        );


        if (!senhaCorreta) {

            return res.status(401).json({
                erro: "Senha inválida"
            });

        }


        /* -----------------------------------------
           SALVAR USUÁRIO NA SESSÃO
        ----------------------------------------- */

        req.session.usuario = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        };


        /* -----------------------------------------
           GARANTIR QUE A SESSÃO FOI SALVA
        ----------------------------------------- */

        req.session.save((erro) => {

            if (erro) {

                console.error(
                    "❌ Erro ao salvar sessão:",
                    erro
                );

                return res.status(500).json({
                    erro: "Erro ao criar sessão"
                });

            }


            /* -------------------------------------
               LOGIN REALIZADO
            ------------------------------------- */

            return res.status(200).json({

                mensagem:
                    "☕ Login realizado com sucesso!",

                usuario: {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email
                }

            });

        });


    } catch (error) {

        console.error(
            "❌ Erro ao fazer login:",
            error
        );

        return res.status(500).json({
            erro: "Erro ao fazer login"
        });

    }

});


/* ===========================================================
   LOGOUT
=========================================================== */

app.post("/logout", (req, res) => {

    req.session.destroy((error) => {

        if (error) {

            console.error(
                "❌ Erro ao fazer logout:",
                error
            );

            return res.status(500).json({
                erro: "Erro ao sair da conta"
            });

        }


        // Remove o cookie da sessão
        res.clearCookie("cafecentral.sid");


        return res.status(200).json({
            mensagem: "Logout realizado com sucesso!"
        });

    });

});


/* ===========================================================
   TRATAMENTO DE ERRO DO CORS
=========================================================== */

app.use((error, req, res, next) => {

    if (error.message === "Bloqueado por CORS") {

        return res.status(403).json({
            erro: "Origem não permitida pelo CORS"
        });

    }

    console.error(
        "❌ Erro interno:",
        error
    );

    return res.status(500).json({
        erro: "Erro interno do servidor"
    });

});


/* ===========================================================
   ROTA NÃO ENCONTRADA
=========================================================== */

app.use((req, res) => {

    return res.status(404).json({
        erro: "Rota não encontrada",
        rota: req.originalUrl,
        metodo: req.method
    });

});


/* ===========================================================
   INICIAR SERVIDOR
=========================================================== */

app.listen(PORT, "0.0.0.0", () => {

    console.log("");
    console.log("==========================================");
    console.log("☕ CAFÉ CENTRAL SERVER");
    console.log("==========================================");
    console.log(`🚀 Servidor: http://127.0.0.1:${PORT}`);
    console.log(`🚀 Servidor: http://localhost:${PORT}`);
    console.log("📡 API pronta para receber requisições");
    console.log("==========================================");
    console.log("");

});
