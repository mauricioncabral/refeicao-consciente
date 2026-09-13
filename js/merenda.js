if (!localStorage.getItem('usuario_nome')) {
          alert('Acesso negado! Faça login primeiro.');
          window.location.href = 'login.html';
      }
let qtd = 0;
const qtdText = document.getElementById('quantidade');

document.getElementById('aumentar-btn').onclick = () => { qtd++; qtdText.innerText = qtd; };
document.getElementById('diminuir-btn').onclick = () => { if (qtd > 0) qtd--; qtdText.innerText = qtd; };

document.getElementById('enviar').onclick = async () => {
    const sala = document.getElementById('select-sala').value;
    const turno = document.querySelector('input[name="turno"]:checked')?.value;

    const res = await fetch('api/api.php?acao=salvar_merenda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sala, turno, quantidade: qtd })
    });
    const resultado = await res.json();
    alert(resultado.mensagem);
};

async function sair() {
    await fetch('api/api.php?acao=logout');
    window.location.href = 'login.php';
}
document.addEventListener('DOMContentLoaded', () => {
    // Verifica se a página está aberta dentro de um iframe (Painel do Admin)
    if (window.self !== window.top) {
        const topBar = document.querySelector('.top-bar');
        if (topBar) {
            topBar.style.display = 'none'; // Esconde a barra interna para o admin
        }
    }
});
