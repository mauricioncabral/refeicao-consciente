const API_URL = "https://76h61crjx5.execute-api.us-east-2.amazonaws.com/default/LoginRefeicao"
// Função para realizar o login
async function entrar() {
    const usuarioInput = document.getElementById('usuario').value.trim();
    const senhaInput = document.getElementById('senha').value;
    const msgError = document.getElementById('msgError');
    const msgSuccess = document.getElementById('msgSuccess');

    if (msgError) msgError.innerHTML = '';
    if (msgSuccess) msgSuccess.innerHTML = '';

    if (!usuarioInput || !senhaInput) {
        if (msgError) msgError.innerHTML = 'Preencha todos os campos.';
        return;
    }

    try {
        const resposta = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userCad: usuarioInput,
                senhaCad: senhaInput
            })
        });

        const resultado = await resposta.json();

        if (resposta.ok && resultado.sucesso) {
            if (msgSuccess) msgSuccess.innerHTML = 'Login realizado com sucesso! Redirecionando...';
            
            localStorage.setItem('token', resultado.token);
            localStorage.setItem('cargo', resultado.cargo);
            localStorage.setItem('usuario_nome', usuarioInput);

            setTimeout(() => {
                window.location.href = 'painel.html';
            }, 1500);
        } else {
            if (msgError) msgError.innerHTML = resultado.mensagem || 'Usuário ou senha incorretos.';
        }

    } catch (erro) {
        console.error("Erro na requisição:", erro);
        if (msgError) msgError.innerHTML = 'Erro ao conectar com o servidor.';
    }
}

// Função para realizar o cadastro de novos usuários
async function cadastrar() {
    const usuarioInput = document.getElementById('usuario').value.trim();
    const senhaInput = document.getElementById('senha').value;
    const msgError = document.getElementById('msgError');
    const msgSuccess = document.getElementById('msgSuccess');

    if (msgError) msgError.innerHTML = '';
    if (msgSuccess) msgSuccess.innerHTML = '';

    if (!usuarioInput || !senhaInput) {
        if (msgError) msgError.innerHTML = 'Preencha todos os campos.';
        return;
    }

    try {
        const resposta = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userCad: usuarioInput,
                senhaCad: senhaInput
            })
        });

        const resultado = await resposta.json();

        if (resposta.ok && resultado.sucesso) {
            if (msgSuccess) msgSuccess.innerHTML = 'Cadastro realizado com sucesso! Redirecionando...';
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        } else {
            if (msgError) msgError.innerHTML = resultado.mensagem || 'Erro ao realizar cadastro.';
        }

    } catch (erro) {
        console.error("Erro na requisição:", erro);
        if (msgError) msgError.innerHTML = 'Erro ao conectar com o servidor.';
    }
}

// Função para redefinir a senha
async function redefinirSenha() {
    const usuarioEl = document.querySelector('#rec-usuario');
    const emailEl = document.querySelector('#rec-email');
    const novaSenhaEl = document.querySelector('#nova-senha');
    const confirmaSenhaEl = document.querySelector('#confirma-senha');

    const msgError = document.querySelector('#msgError');
    const msgSuccess = document.querySelector('#msgSuccess');

    if (msgError) msgError.style.display = 'none';
    if (msgSuccess) msgSuccess.style.display = 'none';

    if (!usuarioEl || !emailEl || !novaSenhaEl || !confirmaSenhaEl) {
        if (msgError) {
            msgError.style.display = 'block';
            msgError.innerText = 'Erro: Campos do formulário não encontrados na página.';
        }
        return;
    }

    const usuario = usuarioEl.value.trim();
    const email = emailEl.value.trim();
    const novaSenha = novaSenhaEl.value;
    const confirmaSenha = confirmaSenhaEl.value;

    if (!usuario || !email || !novaSenha || !confirmaSenha) {
        if (msgError) {
            msgError.style.display = 'block';
            msgError.innerText = 'Preencha todos os campos.';
        }
        return;
    }

    if (novaSenha !== confirmaSenha) {
        if (msgError) {
            msgError.style.display = 'block';
            msgError.innerText = 'As senhas não coincidem!';
        }
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
            if (msgSuccess) {
                msgSuccess.style.display = 'block';
                msgSuccess.innerText = dados.mensagem;
            }
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            if (msgError) {
                msgError.style.display = 'block';
                msgError.innerText = dados.mensagem;
            }
        }
    } catch (erro) {
        if (msgError) {
            msgError.style.display = 'block';
            msgError.innerText = 'Erro ao conectar com o servidor.';
        }
    }
}
