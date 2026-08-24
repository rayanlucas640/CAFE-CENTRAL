/* ===========================================================
   ☕ CAFÉ CENTRAL - AUTENTICAÇÃO
   LOGIN + CADASTRO + SESSÃO
=========================================================== */


/* ===========================================================
   CONFIGURAÇÃO DA API
=========================================================== */

// Backend local
const API_URL = "http://127.0.0.1:3000";


/* ===========================================================
   ELEMENTOS DO HTML
=========================================================== */

const formCadastro = document.getElementById("formCadastro");
const formLogin = document.getElementById("formLogin");


/* ===========================================================
   FUNÇÃO AUXILIAR - MOSTRAR MENSAGEM
=========================================================== */

function mostrarMensagem(elemento, mensagem, tipo = "") {

    if (!elemento) {
        return;
    }

    elemento.textContent = mensagem;

    elemento.classList.remove(
        "sucesso",
        "erro"
    );

    if (tipo) {
        elemento.classList.add(tipo);
    }
}


/* ===========================================================
   CADASTRO
=========================================================== */

if (formCadastro) {

    formCadastro.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            /* -----------------------------------------
               PEGAR CAMPOS
            ----------------------------------------- */

            const nomeElement = document.getElementById("nome");
            const emailElement = document.getElementById("email");
            const senhaElement = document.getElementById("senha");
            const confirmaSenhaElement =
                document.getElementById("confirmasenha");

            const mensagem =
                document.getElementById("mensagemCadastro");


            /* -----------------------------------------
               VERIFICAR ELEMENTOS
            ----------------------------------------- */

            if (
                !nomeElement ||
                !emailElement ||
                !senhaElement ||
                !confirmaSenhaElement
            ) {

                console.error(
                    "❌ Campos do cadastro não encontrados."
                );

                mostrarMensagem(
                    mensagem,
                    "❌ Erro no formulário de cadastro.",
                    "erro"
                );

                return;
            }


            /* -----------------------------------------
               VALORES
            ----------------------------------------- */

            const nome =
                nomeElement.value.trim();

            const email =
                emailElement.value.trim();

            const senha =
                senhaElement.value;

            const confirmaSenha =
                confirmaSenhaElement.value;


            mostrarMensagem(
                mensagem,
                ""
            );


            /* -----------------------------------------
               VALIDAÇÃO
            ----------------------------------------- */

            if (
                !nome ||
                !email ||
                !senha ||
                !confirmaSenha
            ) {

                mostrarMensagem(
                    mensagem,
                    "☕ Preencha todos os campos.",
                    "erro"
                );

                return;
            }


            /* -----------------------------------------
               VALIDAR SENHAS
            ----------------------------------------- */

            if (senha !== confirmaSenha) {

                mostrarMensagem(
                    mensagem,
                    "☕ As senhas não coincidem.",
                    "erro"
                );

                return;
            }


            /* -----------------------------------------
               ENVIAR PARA O BACKEND
            ----------------------------------------- */

            try {

                const resposta = await fetch(
                    `${API_URL}/cadastro`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        credentials: "include",

                        body: JSON.stringify({
                            nome,
                            email,
                            senha
                        })
                    }
                );


                /* -------------------------------------
                   LER RESPOSTA
                ------------------------------------- */

                let dados = {};

                try {

                    dados = await resposta.json();

                } catch (erroJson) {

                    console.warn(
                        "⚠️ Resposta não contém JSON válido."
                    );

                }


                /* -------------------------------------
                   ERRO
                ------------------------------------- */

                if (!resposta.ok) {

                    mostrarMensagem(
                        mensagem,
                        dados.erro ||
                        "❌ Não foi possível realizar o cadastro.",
                        "erro"
                    );

                    return;
                }


                /* -------------------------------------
                   SUCESSO
                ------------------------------------- */

                mostrarMensagem(
                    mensagem,
                    dados.mensagem ||
                    "☕ Cadastro realizado com sucesso!",
                    "sucesso"
                );


                /* -------------------------------------
                   LIMPAR FORMULÁRIO
                ------------------------------------- */

                formCadastro.reset();


            } catch (error) {

                console.error(
                    "❌ Erro no cadastro:",
                    error
                );

                mostrarMensagem(
                    mensagem,
                    "❌ Não foi possível conectar ao Café Central Server.",
                    "erro"
                );

            }

        }
    );

}


/* ===========================================================
   LOGIN
=========================================================== */

if (formLogin) {

    formLogin.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            /* -----------------------------------------
               ELEMENTOS
            ----------------------------------------- */

            const emailElement =
                document.getElementById("emailLogin");

            const senhaElement =
                document.getElementById("senhaLogin");

            const mensagem =
                document.getElementById("mensagemLogin");


            /* -----------------------------------------
               VERIFICAR ELEMENTOS
            ----------------------------------------- */

            if (
                !emailElement ||
                !senhaElement
            ) {

                console.error(
                    "❌ Campos de login não encontrados."
                );

                mostrarMensagem(
                    mensagem,
                    "❌ Erro no formulário de login.",
                    "erro"
                );

                return;
            }


            /* -----------------------------------------
               PEGAR VALORES
            ----------------------------------------- */

            const email =
                emailElement.value.trim();

            const senha =
                senhaElement.value;


            mostrarMensagem(
                mensagem,
                ""
            );


            /* -----------------------------------------
               VALIDAÇÃO
            ----------------------------------------- */

            if (!email || !senha) {

                mostrarMensagem(
                    mensagem,
                    "☕ Preencha todos os campos.",
                    "erro"
                );

                return;
            }


            /* -----------------------------------------
               ENVIAR LOGIN
            ----------------------------------------- */

            try {

                const resposta = await fetch(
                    `${API_URL}/login`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        // IMPORTANTE:
                        // permite receber/enviar o cookie
                        // da sessão do Express
                        credentials: "include",

                        body: JSON.stringify({
                            email,
                            senha
                        })
                    }
                );


                /* -------------------------------------
                   LER RESPOSTA
                ------------------------------------- */

                let dados = {};

                try {

                    dados = await resposta.json();

                } catch (erroJson) {

                    console.warn(
                        "⚠️ Resposta do login não contém JSON válido."
                    );

                }


                /* -------------------------------------
                   LOGIN FALHOU
                ------------------------------------- */

                if (!resposta.ok) {

                    mostrarMensagem(
                        mensagem,
                        dados.erro ||
                        "❌ E-mail ou senha inválidos.",
                        "erro"
                    );

                    return;
                }


                /* -------------------------------------
                   LOGIN REALIZADO
                ------------------------------------- */

                mostrarMensagem(
                    mensagem,
                    dados.mensagem ||
                    "☕ Login realizado com sucesso!",
                    "sucesso"
                );


                /* -------------------------------------
                   PEQUENA PAUSA PARA O COOKIE DA SESSÃO
                ------------------------------------- */

                await new Promise(
                    resolve => setTimeout(resolve, 200)
                );


                /* -------------------------------------
                   CONFIRMAR SESSÃO
                ------------------------------------- */

                try {

                    const verificacao =
                        await fetch(
                            `${API_URL}/me`,
                            {
                                method: "GET",
                                credentials: "include"
                            }
                        );


                    if (!verificacao.ok) {

                        console.error(
                            "❌ Login respondeu OK, mas a sessão não foi encontrada."
                        );

                        mostrarMensagem(
                            mensagem,
                            "❌ Login realizado, mas a sessão não foi criada.",
                            "erro"
                        );

                        return;
                    }


                    const sessao =
                        await verificacao.json();


                    console.log(
                        "☕ Sessão confirmada:",
                        sessao
                    );


                } catch (erroSessao) {

                    console.error(
                        "❌ Erro ao verificar sessão:",
                        erroSessao
                    );

                    mostrarMensagem(
                        mensagem,
                        "❌ Não foi possível confirmar a sessão.",
                        "erro"
                    );

                    return;
                }


                /* -------------------------------------
                   REDIRECIONAR PARA SERVIÇOS
                ------------------------------------- */

                window.location.href =
                    "../pages/servicos.html";


            } catch (error) {

                console.error(
                    "❌ Erro no login:",
                    error
                );

                mostrarMensagem(
                    mensagem,
                    "❌ Erro ao conectar com o Café Central Server.",
                    "erro"
                );

            }

        }
    );

}


/* ===========================================================
   FUNÇÃO PARA VERIFICAR SE ESTÁ LOGADO
=========================================================== */

async function verificarSessao() {

    try {

        const resposta = await fetch(
            `${API_URL}/me`,
            {
                method: "GET",
                credentials: "include"
            }
        );


        if (!resposta.ok) {

            return {
                logado: false
            };

        }


        const dados =
            await resposta.json();


        return dados;


    } catch (error) {

        console.error(
            "❌ Erro ao verificar sessão:",
            error
        );

        return {
            logado: false
        };

    }

}


/* ===========================================================
   FUNÇÃO PARA FAZER LOGOUT
=========================================================== */

async function fazerLogout() {

    try {

        const resposta = await fetch(
            `${API_URL}/logout`,
            {
                method: "POST",
                credentials: "include"
            }
        );


        const dados =
            await resposta.json();


        if (!resposta.ok) {

            console.error(
                "❌ Erro ao fazer logout:",
                dados
            );

            return;
        }


        console.log(
            "☕",
            dados.mensagem
        );


        // Voltar para login
        window.location.href =
            "../pages/login.html";


    } catch (error) {

        console.error(
            "❌ Erro ao conectar com o servidor:",
            error
        );

    }

}


/* ===========================================================
   DISPONIBILIZAR FUNÇÕES GLOBALMENTE
=========================================================== */

window.verificarSessao = verificarSessao;
window.fazerLogout = fazerLogout;


/* ===========================================================
   DEBUG
=========================================================== */

console.log(
    "☕ Café Central Auth carregado."
);

console.log(
    "🔗 API:",
    API_URL
);
