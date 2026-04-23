const API_URL = "https://cafe-central-6q7e.onrender.com";

/*===============================================================
    1) CAPTURAR O FORMULÁRIO
===============================================================*/

const formContato = document.getElementById("formContato");

/*===============================================================
    2) OUVIR ENVIO DO FORMULÁRIO
===============================================================*/

if (formContato) {

    formContato.addEventListener("submit", async function (event) {

        event.preventDefault();

        /*===========================================================
            3) PEGAR OS DADOS DO USUÁRIO
        ===========================================================*/

        const nome = document.getElementById("nome").value;
        const email = document.getElementById("email").value;
        const mensagem = document.getElementById("mensagem").value;

        const novaMensagem = {
            nome,
            email,
            mensagem
        };

        /*===========================================================
            4) ENVIAR PARA O SERVIDOR
        ===========================================================*/

        try {

            const resposta = await fetch(`${API_URL}/mensagem`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(novaMensagem)
            });

            const dados = await resposta.text();

            alert("☕ Café Central: " + dados);

            formContato.reset();

        } catch (erro) {

            alert("❌ Algo deu errado ao enviar sua mensagem.");
            console.error(erro);
        }

    });

}