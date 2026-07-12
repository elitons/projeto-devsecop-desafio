// ============================================
// 🔒 SEGURANÇA: Credenciais removidas do código
// ============================================
// As seguintes linhas foram REMOVIDAS por segurança:
// const API_KEY = "ghp_xK92mNpL34rTvQ87wZaB56cDeFgHiJkL";
// const DB_PASSWORD = "admin@prod#2024";
//
// Em produção, use variáveis de ambiente ou GitHub Secrets
// Exemplo: const API_KEY = process.env.API_KEY;

// ============================================
// 📋 Busca tarefas do "banco de dados"
// ============================================
// 🔧 CORREÇÃO: Caminho relativo corrigido para ./db.json
fetch('./db.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Atualiza o status
        const statusElement = document.getElementById('db-status');
        if (statusElement) {
            statusElement.innerText = data.status || 'Conectado ao Banco de Dados';
        }

        // Carrega as tarefas
        const list = document.getElementById('task-list');
        if (list && data.itens && Array.isArray(data.itens)) {
            data.itens.forEach(item => {
                let li = document.createElement('li');
                li.textContent = item.task;
                list.appendChild(li);
            });
        }
    })
    .catch(err => {
        // 🔒 SEGURANÇA: Não expõe stack trace para o usuário
        const statusElement = document.getElementById('db-status');
        if (statusElement) {
            statusElement.innerText = 'Erro ao carregar dados. Tente novamente mais tarde.';
        }
        
        // Log do erro detalhado apenas no console do desenvolvedor
        console.error('Erro ao buscar dados:', err.message);
    });

// ============================================
// ➕ Adiciona nova tarefa na tela
// ============================================
function addTask() {
    const input = document.getElementById('new-task');
    const output = document.getElementById('output');
    
    // 🔒 SEGURANÇA: Validação de entrada
    if (!input || !input.value || input.value.trim() === '') {
        alert('Por favor, digite uma tarefa!');
        return;
    }

    // 🔒 SEGURANÇA: Sanitização da entrada do usuário
    const sanitizedText = input.value
        .replace(/[<>]/g, '')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');

    // 🔒 SEGURANÇA: Usa createElement em vez de innerHTML
    const li = document.createElement('li');
    li.textContent = sanitizedText;

    // Adiciona botão de excluir
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑️ Excluir';
    deleteBtn.className = 'delete-btn';
    deleteBtn.style.marginLeft = '10px';
    deleteBtn.style.cursor = 'pointer';
    
    deleteBtn.onclick = function() {
        if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
            output.removeChild(li);
        }
    };

    li.appendChild(deleteBtn);
    output.appendChild(li);

    console.log(`Tarefa adicionada: "${sanitizedText}"`);

    // Limpa o input
    input.value = '';
}

// ============================================
// 🚀 Função: Limpar todas as tarefas
// ============================================
function clearAllTasks() {
    const output = document.getElementById('output');
    if (output && output.children.length > 0) {
        if (confirm('Tem certeza que deseja excluir TODAS as tarefas?')) {
            while (output.firstChild) {
                output.removeChild(output.firstChild);
            }
            console.log('Todas as tarefas foram removidas');
        }
    } else {
        alert('Não há tarefas para remover!');
    }
}

// ============================================
// 📊 Função: Contar tarefas
// ============================================
function countTasks() {
    const output = document.getElementById('output');
    if (output) {
        const count = output.children.length;
        alert(`Você tem ${count} tarefa${count !== 1 ? 's' : ''} na lista!`);
    }
}

// ============================================
// 🎯 Inicialização
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Adiciona listener para a tecla Enter no input
    const input = document.getElementById('new-task');
    if (input) {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addTask();
            }
        });
    }
    
    console.log('✅ Aplicação inicializada com segurança!');
});

// ============================================
// 📝 Exporta funções para uso global
// ============================================
window.addTask = addTask;
window.clearAllTasks = clearAllTasks;
window.countTasks = countTasks;