const ListaServicos = document.querySelector("#ListaServicos");
const buscaServicos = document.querySelector("#BuscarServicos");

let servicos = [];

async function carregarServicos() {
    try {
        const resposta = await fetch("../data/servicos.json");

        if (!resposta.ok) {
            throw new Error("Erro ao carregar o arquivo JSON");
        }

        servicos = await resposta.json();
        renderizarServicos(servicos);
    } catch (erro) {
        console.error("Erro:", erro);

        if (ListaServicos) {
            ListaServicos.innerHTML = `
                <p>Erro ao carregar o cardápio.</p>
            `;
        }
    }
}

function renderizarServicos(lista) {
    if (!ListaServicos) {
        return;
    }

    ListaServicos.innerHTML = "";

    lista.forEach(servico => {
        const card = document.createElement("div");

        card.classList.add("card");

        card.innerHTML = `
            <h3>${servico.titulo}</h3>
            <img src="${servico.img}" width="150" height="150" alt="${servico.titulo}">
            <p>${servico.descricao}</p>
            <p><strong>Preço:</strong> R$ ${servico.preco.toFixed(2).replace(".", ",")}</p>
            <a href="detalhes-servicos.html?id=${servico.id}" class="botao-detalhes">Ver detalhes</a>
        `;

        ListaServicos.appendChild(card);
    });
}

if (buscaServicos) {
    buscaServicos.addEventListener("input", function () {
        const texto = buscaServicos.value.toLowerCase();

        const filtrados = servicos.filter(servico =>
            servico.titulo.toLowerCase().includes(texto)
        );

        renderizarServicos(filtrados);
    });
}

carregarServicos();
