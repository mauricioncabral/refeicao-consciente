const API_URL = "https://76h61crjx5.execute-api.us-east-2.amazonaws.com/default/LoginRefeicao"
async function redefinirSenha() {
    const usuarioEl = document.querySelector('#rec-usuario');
    const emailEl = document.querySelector('#rec-email');
    const novaSenhaEl = document.querySelector('#nova-senha');
    const confirmaSenhaEl = document.querySelector('#confirma-senha');

    const msgError = document.querySelector('#msgError');
    const msgSuccess = document.querySelector('#msgSuccess');

    msgError.style.display = 'none';
    msgSuccess.style.display = 'none';

    if (!usuarioEl || !emailEl || !novaSenhaEl || !confirmaSenhaEl) {
        msgError.style.display = 'block';
        msgError.innerText = 'Erro: Campos do formulário não encontrados na página.';
        return;
    }

    const usuario = usuarioEl.value.trim();
    const email = emailEl.value.trim();
    const novaSenha = novaSenhaEl.value;
    const confirmaSenha = confirmaSenhaEl.value;

    if (!usuario || !email || !novaSenha || !confirmaSenha) {
        msgError.style.display = 'block';
        msgError.innerText = 'Preencha todos os campos.';
        return;
    }

    if (novaSenha !== confirmaSenha) {
        msgError.style.display = 'block';
        msgError.innerText = 'As senhas não coincidem!';
        return;
    }

    try {
        const res = await fetch(`${API_URL}?acao=redefinir_senha`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, email, novaSenha })
        });

        const dados = await res.json();

        if (dados.sucesso) {
            msgSuccess.style.display = 'block';
            msgSuccess.innerText = dados.mensagem;
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            msgError.style.display = 'block';
            msgError.innerText = dados.mensagem;
        }
    } catch (erro) {
        msgError.style.display = 'block';
        msgError.innerText = 'Erro ao conectar com o servidor.';
    }
}
