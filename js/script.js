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

    try {

        // BUSCA O ARQUIVO JSON
        const resposta = await fetch("../data/servicos.json");

        // VERIFICA SE O JSON FOI ENCONTRADO
        if (!resposta.ok) {
            throw new Error("Erro ao carregar o arquivo JSON");
        }

        // TRANSFORMA JSON EM OBJETO JS
        servicos = await resposta.json();

        // RENDERIZA NA TELA
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


/*============================================================
    4) FUNÇÃO PARA CRIAR OS CARDS NA TELA
============================================================*/

function renderizarServicos(lista) {


    // Verifica se a página possui a lista de produtos
    if (!ListaServicos) {
        return;
    }


    // LIMPA A TELA
    ListaServicos.innerHTML = "";


    // CRIA OS CARDS
    lista.forEach(servico => {


        const card = document.createElement("div");

        card.classList.add("card");


        card.innerHTML = `

            <h3>${servico.titulo}</h3>


            <img 
                src="${servico.img}" 
                width="150" 
                height="150"
                alt="${servico.titulo}"
            >


            <p>
                ${servico.descricao}
            </p>


            <p>
                <strong>Preço:</strong> 
                R$ ${servico.preco.toFixed(2)}
            </p>


            <a href="../pages/detalhes-cardapio.html?id=${servico.id}">
                <button>
                    Ver detalhes
                </button>
            </a>

        `;


        ListaServicos.appendChild(card);

    });

}


/*============================================================
    5) BUSCA DE SERVIÇOS (CAFÉS)
============================================================*/


if (buscaServicos) {


    buscaServicos.addEventListener("input", function () {


        const texto = buscaServicos.value.toLowerCase();



        const filtrados = servicos.filter((servico) => {


            return servico.titulo
                .toLowerCase()
                .includes(texto);


        });



        renderizarServicos(filtrados);


    });

}


/*============================================================
    6) INICIA TUDO
============================================================*/


carregarServicos();