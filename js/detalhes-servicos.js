const conteudoServicos = document.querySelector("#conteudoServicos");
const mensagemCarregamento = document.querySelector("#mensagemCarregamento");

const parametros = new URLSearchParams(window.location.search);
const idServico = Number(parametros.get("id"));

async function carregarDetalhesServico() {
    try {
        const resposta = await fetch("../data/servicos.json");

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar os serviços.");
        }

        const servicos = await resposta.json();

        const servico = servicos.find(servico => servico.id === idServico);

        if (!servico) {
            mostrarServicoNaoEncontrado();
            return;
        }

        mostrarServico(servico);
    } catch (erro) {
        console.error("Erro ao carregar serviço:", erro);
        mensagemCarregamento.textContent = "Não foi possível carregar as informações do serviço.";
    }
}

function mostrarServico(servico) {
    mensagemCarregamento.textContent = "";

    conteudoServicos.innerHTML = `
        <h1>${servico.titulo}</h1>
        <img src="${servico.img}" width="300" height="300" alt="${servico.titulo}">
        <p>${servico.descricao}</p>
        <p><strong>Preço:</strong> R$ ${servico.preco.toFixed(2).replace(".", ",")}</p>
    `;
}

function mostrarServicoNaoEncontrado() {
    mensagemCarregamento.textContent = "";

    conteudoServicos.innerHTML = `
        <h1>Serviço não encontrado!</h1>
        <p>O produto ou serviço solicitado não existe ou não está disponível.</p>
        <a href="servicos.html">Voltar para Serviços</a>
    `;
}

carregarDetalhesServico();
