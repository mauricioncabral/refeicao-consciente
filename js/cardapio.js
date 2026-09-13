let cardapioDados = {};
let diaSelecionado = '';

// Variável para a URL da sua API (ajuste quando for hospedar)
const API_URL = 'api/api.php'; 

async function carregarCardapio() {
    const res = await fetch(`${API_URL}?acao=obter_cardapio`);
    const json = await res.json();
    
    if (json.sucesso) {
        cardapioDados = json.cardapio;
        if (diaSelecionado) {
            exibirDia(diaSelecionado);
        }
    }
}

function selecionarDia(dia) {
    diaSelecionado = dia;
    exibirDia(dia);
}

function exibirDia(dia) {
    const info = cardapioDados[dia] || { prato: 'Não cadastrado', acompanhamento: 'Não cadastrado' };

    document.getElementById('titulo-dia').innerText = `Refeição de ${dia.charAt(0).toUpperCase() + dia.slice(1)}-feira`;
    document.getElementById('view-prato').innerText = info.prato;
    document.getElementById('view-acompanhamento').innerText = info.acompanhamento;

    // NOVO: Verificação de Administrador via LocalStorage
    const cargoLogado = localStorage.getItem('usuario_cargo');

    if (cargoLogado === 'adm') {
        document.getElementById('linha-edicao').style.display = 'block';
        document.getElementById('painel-edicao').style.display = 'block';
        document.getElementById('edit-prato').value = info.prato !== 'Não cadastrado' ? info.prato : '';
        document.getElementById('edit-acompanhamento').value = info.acompanhamento !== 'Não cadastrado' ? info.acompanhamento : '';
    }
}

async function salvarCardapio() {
    if (!diaSelecionado) {
        alert("Selecione um dia da semana para editar.");
        return;
    }

    const prato = document.getElementById('edit-prato').value;
    const acompanhamento = document.getElementById('edit-acompanhamento').value;

    const res = await fetch(`${API_URL}?acao=atualizar_cardapio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            dia_semana: diaSelecionado,
            prato: prato,
            acompanhamento: acompanhamento
        })
    });

    const resultado = await res.json();
    alert(resultado.mensagem);

    if (resultado.sucesso) {
        carregarCardapio(); 
    }
}

// NOVO: Função sair adaptada para limpar os dados do navegador e ir para o .html
function sair() {
    localStorage.removeItem('usuario_nome');
    localStorage.removeItem('usuario_cargo');
    window.location.href = 'login.html';
}

// Carrega os dados assim que a página abre e mostra o nome
document.addEventListener('DOMContentLoaded', () => {
    carregarCardapio();
    
    // Exibe o nome do usuário logado na tela
    const nomeLogado = localStorage.getItem('usuario_nome') || 'Usuário';
    const elementoNome = document.getElementById('nome-usuario-logado');
    if(elementoNome) {
        elementoNome.innerText = nomeLogado;
    }
});
document.addEventListener('DOMContentLoaded', () => {
    // Verifica se a página está aberta dentro de um iframe (Painel do Admin)
    if (window.self !== window.top) {
        const topBar = document.querySelector('.top-bar');
        if (topBar) {
            topBar.style.display = 'none'; // Esconde a barra interna para o admin
        }
    }
});