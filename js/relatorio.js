if (!localStorage.getItem('usuario_nome')) {
      alert('Acesso negado! Faça login primeiro.');
      window.location.href = 'login.html';
}

// 1. Atualizado para apontar diretamente para a AWS Lambda
const API_URL = "https://76h61crjx5.execute-api.us-east-2.amazonaws.com/default/LoginRefeicao";

async function buscarRelatorioMensal() {
    const mes = document.getElementById('select-mes').value;
    const ano = document.getElementById('select-ano').value;
    const tbody = document.getElementById('tabela-relatorio');
    
    tbody.innerHTML = '<tr><td colspan="3">Carregando dados...</td></tr>';

    try {
        // 2. Modificado para enviar via POST com JSON contendo a ação, mês e ano
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                acao: 'obter_relatorio',
                mes: mes,
                ano: ano
            })
        });

        if (!res.ok) throw new Error('Resposta do servidor não foi OK');
        
        const json = await res.json();
        if (json.sucesso) {
            // Nota: Se a sua Lambda retornar a lista na propriedade 'relatorio', ajustamos para 'json.relatorio'
            preencherTabelaRelatorio(json.relatorio || json.dados);
        } else {
            tbody.innerHTML = `<tr><td colspan="3">${json.mensagem || 'Nenhum dado encontrado.'}</td></tr>`;
        }
    } catch (erro) {
        console.error("Erro ao buscar relatório:", erro);
        tbody.innerHTML = '<tr><td colspan="3">Erro ao conectar ao servidor.</td></tr>';
    }
}

function preencherTabelaRelatorio(registros) {
    const tbody = document.getElementById('tabela-relatorio');
    const totalMesEl = document.getElementById('total-mes');
    tbody.innerHTML = '';
    let somaTotal = 0;

    if (!registros || registros.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3">Nenhum registro encontrado para este mês.</td></tr>';
        totalMesEl.innerText = '0';
        return;
    }

    registros.forEach(item => {
        const qtd = parseInt(item.total_dia || 0, 10);
        somaTotal += qtd;
        
        let dataFormatada = item.data_registro || '';
        if (dataFormatada.includes('-')) {
            const partesData = dataFormatada.split('-');
            dataFormatada = `${partesData[2]}/${partesData[1]}/${partesData[0]}`;
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${dataFormatada}</td><td>${item.turno || '-'}</td><td><strong>${qtd}</strong></td>`;
        tbody.appendChild(tr);
    });

    totalMesEl.innerText = somaTotal;
}

function sair() {
    localStorage.removeItem('usuario_nome');
    localStorage.removeItem('usuario_cargo');
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', buscarRelatorioMensal);
document.addEventListener('DOMContentLoaded', () => {
    // Verifica se a página está aberta dentro de um iframe (Painel do Admin)
    if (window.self !== window.top) {
        const topBar = document.querySelector('.top-bar');
        if (topBar) {
            topBar.style.display = 'none'; // Esconde a barra interna para o admin
        }
    }
});
