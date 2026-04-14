/*===============================================================
    1) CAPTURAR O FORMULÁRIO
===============================================================*/

// Formulário de contato
const formContato = document.getElementById("formContato");


/*===============================================================
    2) OUVIR ENVIO DO FORMULÁRIO
===============================================================*/

formContato.addEventListener("submit", async function (event) {

    // Impede recarregar a página
    event.preventDefault();


    /*===========================================================
        3) PEGAR OS DADOS DO USUÁRIO
    ===========================================================*/

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const mensagem = document.getElementById("mensagem").value;


    // Organiza os dados
    const novaMensagem = {
        nome,
        email,
        mensagem
    };


    /*===========================================================
        4) ENVIAR PARA O SERVIDOR
    ===========================================================*/

    try {

        const resposta = await fetch("http://localhost:3000/mensagem", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(novaMensagem)
        });


        /*=======================================================
            5) TRATAR RESPOSTA
        =======================================================*/

        const dados = await resposta.text();

        alert("☕ Café Central: " + dados);

        // limpa formulário depois do envio
        formContato.reset();


    } catch (erro) {

        alert("❌ Algo deu errado ao enviar sua mensagem.");
        console.error(erro);
    }

});