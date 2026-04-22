const formCadastro = document.getElementById("formCadastro");
const formLogin = document.getElementById("formLogin");

// URL da API (local)
const API_URL = "http://localhost:3000";
// depois pode trocar para Render:
// const API_URL = "https://seu-backend.onrender.com";


/*===============================================================
    1) CADASTRO
===============================================================*/

if (formCadastro) {

    formCadastro.addEventListener("submit", async function (event) {
        event.preventDefault();

        // Captura dos campos
        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value;
        const confirmaSenha = document.getElementById("confirmasenha").value;

        const mensagem = document.getElementById("mensagemCadastro");
        mensagem.textContent = "";

        // Validações
        if (!nome || !email || !senha || !confirmaSenha) {
            mensagem.textContent = "☕ Preencha todos os campos";
            return;
        }

        if (senha !== confirmaSenha) {
            mensagem.textContent = "☕ As senhas não coincidem";
            return;
        }

        try {

            const resposta = await fetch(`${API_URL}/cadastro`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ nome, email, senha })
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                mensagem.textContent = dados.erro;
                return;
            }

            mensagem.textContent = dados.mensagem;

            formCadastro.reset();

        } catch (error) {
            mensagem.textContent = "❌ Erro ao conectar com o Café Central Server";
            console.error(error);
        }
    });
}


/*===============================================================
    2) LOGIN
===============================================================*/

if (formLogin) {

    formLogin.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("emailLogin").value.trim();
        const senha = document.getElementById("senhaLogin").value;

        const mensagem = document.getElementById("mensagemLogin");
        mensagem.textContent = "";

        if (!email || !senha) {
            mensagem.textContent = "☕ Preencha todos os campos";
            return;
        }

        try {

            const resposta = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include", // mantém sessão ativa
                body: JSON.stringify({ email, senha })
            });

            const dados = await resposta.json();

            mensagem.textContent = dados.mensagem || dados.erro;

            // se login deu certo → vai para serviços (cafés)
            if (resposta.ok) {
                window.location.href = "../pages/servicos.html";
            }

        } catch (error) {
            mensagem.textContent = "❌ Erro ao conectar com o Café Central Server";
            console.error(error);
        }
    });
}