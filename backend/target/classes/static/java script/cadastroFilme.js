const API_URL = "http://localhost:8080/api/filmes";
const GENRES_URL = "http://localhost:8080/api/generos";

// Verifica se há parâmetros na URL (ex: cadastro.html?id=10)
const paramsUrl = new URLSearchParams(window.location.search);
const idEdicao = paramsUrl.get("id"); // Se existir, guarda o ID; se não, fica null

// 'async' permite usar 'await' dentro da função para esperar requisições terminarem
document.addEventListener("DOMContentLoaded", async () => {
    // 1. Carrega o <select> de gêneros primeiro. 
    // O 'await' é crucial aqui: garante que as opções existam antes de tentarmos selecionar uma na edição.
    await carregarGeneros();

    // 2. Se for Edição (tem ID na URL):
    if (idEdicao) {
        prepararModoEdicao(); // Ajusta textos e cores da tela
        await carregarDadosFilme(idEdicao); // Busca os dados do filme e preenche os campos
    }

    // Adiciona o evento de salvar ao formulário
    document.getElementById("formCadastro").addEventListener("submit", salvarFilme);
});

async function carregarGeneros() {
    try {
        const res = await fetch(GENRES_URL);
        const generos = await res.json();
        
        const select = document.getElementById("selectGenero");
        select.innerHTML = '<option value="">Selecione um gênero</option>'; // Opção padrão
        
        // Preenche o dropdown com os gêneros vindos do banco
        generos.forEach(g => {
            select.innerHTML += `<option value="${g.id}">${g.nome}</option>`;
        });
    } catch (error) {
        alert("Erro ao carregar gêneros: " + error);
    }
}

function prepararModoEdicao(){
    document.getElementById("tituloPagina").innerText = "Editar Filme";
    const btn = document.getElementById("btnSalvar");
    btn.innerText = "Atualizar Dados";
    btn.style.backgroundColor = "#d69e2e";
}

async function carregarDadosFilme(id){
    try {
        const res = await fetch(`${API_URL}/${id}`);
        const filme = await res.json();

        document.getElementById("titulo").value = filme.titulo;
        document.getElementById("ano").value = filme.ano;
        document.getElementById("diretor").value = filme.diretor;
        document.getElementById("urlCapa").value = filme.urlCapa;

        if (filme.genero){
            document.getElementById("selectGenero").value = filme.genero.id;
        }
    } catch(error){
        alert("Erro ao buscar dados do filme: " + error);
        Windows.location.href = "filmes.html";
    }
}


    function salvarFilme(event){
        event.preventDefault();

        const filme = {
            titulo: document.getElementById("titulo").value,
            ano: document.getElementById("ano").value,
            diretor: document.getElementById("diretor").value,
            urlCapa: document.getElementById("urlCapa").value,
            genero: {id: document.getElementById("selectGenero").value}
        }
         const metodo = idEdicao ? "PUT" : "POST";

         const url = idEdicao ? `${API_URL}/${idEdicao}` : API_URL;
    }
