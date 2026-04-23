const formContato = document.getElementById("formContato");

if (formContato) {

    formContato.addEventListener("submit", async function (event) {

        event.preventDefault();

        const nome = document.getElementById("nome").value;
        const email = document.getElementById("email").value;
        const mensagem = document.getElementById("mensagem").value;

        const novaMensagem = {
            nome,
            email,
            mensagem
        };

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