/* ☕ CAFÉ CENTRAL - AUTENTICAÇÃO
   LOGIN + CADASTRO + SESSÃO */

// Configuração da API
const API_URL = "http://127.0.0.1:3000";

// Elementos do HTML
const formCadastro = document.getElementById("formCadastro");
const formLogin = document.getElementById("formLogin");

// Mostrar mensagem
function mostrarMensagem(elemento, mensagem, tipo = "") {
    if (!elemento) {
        return;
    }

    elemento.textContent = mensagem;
    elemento.classList.remove("sucesso", "erro");

    if (tipo) {
        elemento.classList.add(tipo);
    }
}

// Cadastro
if (formCadastro) {
    formCadastro.addEventListener("submit", async function (event) {
        event.preventDefault();

        const nomeElement = document.getElementById("nome");
        const emailElement = document.getElementById("email");
        const senhaElement = document.getElementById("senha");
        const confirmaSenhaElement = document.getElementById("confirmasenha");
        const mensagem = document.getElementById("mensagemCadastro");

        if (!nomeElement || !emailElement || !senhaElement || !confirmaSenhaElement) {
            console.error("❌ Campos do cadastro não encontrados.");
            mostrarMensagem(mensagem, "❌ Erro no formulário de cadastro.", "erro");
            return;
        }

        const nome = nomeElement.value.trim();
        const email = emailElement.value.trim();
        const senha = senhaElement.value;
        const confirmaSenha = confirmaSenhaElement.value;

        mostrarMensagem(mensagem, "");

        if (!nome || !email || !senha || !confirmaSenha) {
            mostrarMensagem(mensagem, "☕ Preencha todos os campos.", "erro");
            return;
        }

        if (senha !== confirmaSenha) {
            mostrarMensagem(mensagem, "☕ As senhas não coincidem.", "erro");
            return;
        }

        try {
            const resposta = await fetch(`${API_URL}/cadastro`, {
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
            });

            let dados = {};

            try {
                dados = await resposta.json();
            } catch (erroJson) {
                console.warn("⚠️ Resposta não contém JSON válido.");
            }

            if (!resposta.ok) {
                mostrarMensagem(
                    mensagem,
                    dados.erro || "❌ Não foi possível realizar o cadastro.",
                    "erro"
                );
                return;
            }

            mostrarMensagem(
                mensagem,
                dados.mensagem || "☕ Cadastro realizado com sucesso!",
                "sucesso"
            );

            formCadastro.reset();

        } catch (error) {
            console.error("❌ Erro no cadastro:", error);

            mostrarMensagem(
                mensagem,
                "❌ Não foi possível conectar ao Café Central Server.",
                "erro"
            );
        }
    });
}

// Login
if (formLogin) {
    formLogin.addEventListener("submit", async function (event) {
        event.preventDefault();

        const emailElement = document.getElementById("emailLogin");
        const senhaElement = document.getElementById("senhaLogin");
        const mensagem = document.getElementById("mensagemLogin");

        if (!emailElement || !senhaElement) {
            console.error("❌ Campos de login não encontrados.");
            mostrarMensagem(mensagem, "❌ Erro no formulário de login.", "erro");
            return;
        }

        const email = emailElement.value.trim();
        const senha = senhaElement.value;

        mostrarMensagem(mensagem, "");

        if (!email || !senha) {
            mostrarMensagem(mensagem, "☕ Preencha todos os campos.", "erro");
            return;
        }

        try {
            const resposta = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    email,
                    senha
                })
            });

            let dados = {};

            try {
                dados = await resposta.json();
            } catch (erroJson) {
                console.warn("⚠️ Resposta do login não contém JSON válido.");
            }

            if (!resposta.ok) {
                mostrarMensagem(
                    mensagem,
                    dados.erro || "❌ E-mail ou senha inválidos.",
                    "erro"
                );
                return;
            }

            mostrarMensagem(
                mensagem,
                dados.mensagem || "☕ Login realizado com sucesso!",
                "sucesso"
            );

            await new Promise(resolve => setTimeout(resolve, 200));

            try {
                const verificacao = await fetch(`${API_URL}/me`, {
                    method: "GET",
                    credentials: "include"
                });

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

                const sessao = await verificacao.json();

                console.log("☕ Sessão confirmada:", sessao);

            } catch (erroSessao) {
                console.error("❌ Erro ao verificar sessão:", erroSessao);

                mostrarMensagem(
                    mensagem,
                    "❌ Não foi possível confirmar a sessão.",
                    "erro"
                );

                return;
            }

            window.location.href = "../pages/servicos.html";

        } catch (error) {
            console.error("❌ Erro no login:", error);

            mostrarMensagem(
                mensagem,
                "❌ Erro ao conectar com o Café Central Server.",
                "erro"
            );
        }
    });
}

// Verificar se está logado
async function verificarSessao() {
    try {
        const resposta = await fetch(`${API_URL}/me`, {
            method: "GET",
            credentials: "include"
        });

        if (!resposta.ok) {
            return {
                logado: false
            };
        }

        const dados = await resposta.json();

        return dados;

    } catch (error) {
        console.error("❌ Erro ao verificar sessão:", error);

        return {
            logado: false
        };
    }
}

// Fazer logout
async function fazerLogout() {
    try {
        const resposta = await fetch(`${API_URL}/logout`, {
            method: "POST",
            credentials: "include"
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            console.error("❌ Erro ao fazer logout:", dados);
            return;
        }

        console.log("☕", dados.mensagem);

        window.location.href = "../pages/login.html";

    } catch (error) {
        console.error("❌ Erro ao conectar com o servidor:", error);
    }
}

// Disponibilizar funções globalmente
window.verificarSessao = verificarSessao;
window.fazerLogout = fazerLogout;

// Debug
console.log("☕ Café Central Auth carregado.");
console.log("🔗 API:", API_URL);