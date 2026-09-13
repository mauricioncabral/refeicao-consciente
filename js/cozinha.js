const API_URL = 'api/api.php';

async function carregarMerenda() {
    try {
        const res = await fetch(`${API_URL}?acao=obter_merenda`);
        const json = await res.json();

        if (json.sucesso) {
            atualizarPainel(json.dados);
        }
    } catch (erro) {
        console.error('Erro de conexão:', erro);
    }
}

function atualizarPainel(registros) {
    const tbody = document.getElementById('dadosMerenda');
    tbody.innerHTML = '';

    let totalGeral = 0, totalManha = 0, totalTarde = 0, totalNoite = 0;

    if (registros.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3">Nenhum registro de merenda para hoje.</td></tr>';
    } else {
        registros.forEach(item => {
            const qtd = parseInt(item.quantidade, 10);
            totalGeral += qtd;
            if (item.turno === 'Manhã') totalManha += qtd;
            else if (item.turno === 'Tarde') totalTarde += qtd;
            else if (item.turno === 'Noite') totalNoite += qtd;

            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${item.sala}</td><td>${item.turno}</td><td><strong>${qtd}</strong></td>`;
            tbody.appendChild(tr);
        });
    }

    document.getElementById('total-geral').innerText = totalGeral;
    document.getElementById('total-manha').innerText = totalManha;
    document.getElementById('total-tarde').innerText = totalTarde;
    document.getElementById('total-noite').innerText = totalNoite;
}

function sair() {
    localStorage.removeItem('usuario_nome');
    localStorage.removeItem('usuario_cargo');
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    carregarMerenda();
    const nomeLogado = localStorage.getItem('usuario_nome') || 'Usuário';
    const elementoNome = document.getElementById('nome-usuario-logado');
    if(elementoNome) elementoNome.innerText = nomeLogado;
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