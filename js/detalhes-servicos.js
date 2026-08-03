// Captura os elementos da página detalhes do curso
const conteudoCurso = document.querySelector("#conteudoServicos")
const mensagemCarregamento = document.querySelector("#mensagemCarregamento")
 
// Lê o identificador enviado na URL
const parametros = new URLSearchParams(window.location.search());
const idCurso = Number(parametros.get("id"));
 
// Função que carrega o curso
async function CarregarDetalhesCardapio() {
    try{
        const resposta = await fetch("../data/servicos.json");
 
        if(!resposta){
            console.error("Não foi possível carregar o cardápio");
            mensagemCarregamento.textContent =
                "Não foi possível carregar os cardápio"
        };
 
        const cursos = await resposta.json();
 
        const cursoEncontrado = cursos.find(
            curso => curso.id === idCurso
        );
 
        if(!cursoEncontrado){
            mostrarCursosNãoEncontrado();
            return;
        };
 
        mostrarCurso(cursoEncontrado);
 
       
    } catch(erro){
        console.error("Erro ao carregar o cardápio ",erro);
        mensagemCarregamento.textContent =
            "Não foi possível carregar as informações do Cardápio";
    }
}


function mostrarCurso(curso){
    mensagemCarregamento.textContent = "";

    conteudoCurso.innerHTML = 
    `<h3> ${servico.titulo} </h3>
            <img src="${servico.img}" width="150" height="150">
            <p> ${servico.descricao} </p>
            <p> <strong>$: </strong> ${servico.preco}</p>

            
    `;
};

function mostrarCursosNãoEncontrado(){
    mensagemCarregamento.textContent ="";
 
    conteudoCurso.innerHTML = `
        <div class="detalhe-preco">
            <h1> Curso não encontrado!</h1>
            <p> O curso não existe ou não está disponível </p>
        </div>
    `
}
 
// Iniciar carregamento
CarregarDetalhesCurso();