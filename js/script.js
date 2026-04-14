/*============================================================
    1) PEGAR OS ELEMENTOS DO HTML
============================================================*/

// ONDE OS CARDS VÃO APARECER (SERVIÇOS / CAFÉS)
const ListaServicos = document.querySelector("#ListaServicos");

// CAMPO DE BUSCA
const buscaServicos = document.querySelector("#BuscarServicos");


/*============================================================
    2) LISTA DE DADOS (CAFÉS / SERVIÇOS)
============================================================*/

let servicos = [];


/*============================================================
    3) FUNÇÃO PARA CARREGAR O JSON
============================================================*/

async function carregarServicos() {

    // BUSCA O ARQUIVO JSON
    const resposta = await fetch("../data/servicos.json");
    console.log(resposta);

    // TRANSFORMA JSON EM OBJETO JS
    servicos = await resposta.json();

    // RENDERIZA NA TELA
    renderizarServicos(servicos);
}


/*============================================================
    4) FUNÇÃO PARA CRIAR OS CARDS NA TELA
============================================================*/

function renderizarServicos(lista) {

    // LIMPA A TELA
    ListaServicos.innerHTML = "";

    // CRIA OS CARDS
    lista.forEach(servico => {

        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <h3>${servico.titulo}</h3>

            <img src="${servico.img}" width="150" height="150" alt="${servico.titulo}">

            <p>${servico.descricao}</p>

            <p><strong>Preço:</strong> R$ ${servico.preco}</p>

            <a href="${servico.url}">
                <button>Ver detalhes</button>
            </a>
        `;

        ListaServicos.appendChild(card);
    });
}


/*============================================================
    5) BUSCA DE SERVIÇOS (CAFÉS)
============================================================*/

buscaServicos.addEventListener("input", function () {

    const texto = buscaServicos.value.toLowerCase();

    const filtrados = servicos.filter((servico) =>
        servico.titulo.toLowerCase().includes(texto)
    );

    renderizarServicos(filtrados);
});


/*============================================================
    6) INICIA TUDO
============================================================*/

carregarServicos();