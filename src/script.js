// ============================================
// Busca tarefas do "banco de dados"
// ============================================
fetch('./db.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('db-status').innerText = data.status;

        const list = document.getElementById('task-list');
        data.itens.forEach(item => {
            let li = document.createElement('li');
            li.textContent = item.task; // Usando textContent em vez de innerText
            list.appendChild(li);
        });
    })
    .catch(err => {
        // SEGURANÇA: Não expõe stack trace para o usuário
        document.getElementById('db-status').innerText =
            'Erro ao carregar dados. Tente novamente mais tarde.';
        
        // Log do erro detalhado apenas no console do desenvolvedor
        console.error('Erro ao buscar dados:', err.message);
    });

// ============================================
# Adiciona nova tarefa na tela
// ============================================
function addTask() {
    const input = document.getElementById('new-task');
    const output = document.getElementById('output');
    
    // SEGURANÇA: Validação de entrada
    if (!input || !input.value || input.value.trim() === '') {
        alert('Por favor, digite uma tarefa!');
        return;
    }

    // SEGURANÇA: Sanitização da entrada do usuário
    // Remove caracteres perigosos para prevenir XSS
    const sanitizedText = input.value
        .replace(/[<>]/g, '')           // Remove < e >
        .replace(/&/g, '&amp;')         // Escapa &
        .replace(/"/g, '&quot;')        // Escapa "
        .replace(/'/g, '&#x27;')        // Escapa '
        .replace(/\//g, '&#x2F;');      // Escapa /

    // SEGURANÇA: Usa createElement em vez de innerHTML
    const li = document.createElement('li');
    li.textContent = sanitizedText;

    // Adiciona botão de excluir
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑️ Excluir';
    deleteBtn.className = 'delete-btn';
    deleteBtn.style.marginLeft = '10px';
    deleteBtn.style.cursor = 'pointer';
    
    // SEGURANÇA: Usa função nomeada em vez de eval
    deleteBtn.onclick = function() {
        if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
            output.removeChild(li);
        }
    };

    li.appendChild(deleteBtn);
    output.appendChild(li);

    // SEGURANÇA: Log seguro sem eval
    console.log(`Tarefa adicionada: "${sanitizedText}"`);

    // Limpa o input
    input.value = '';
}

// ============================================
// Função adicional: Limpar todas as tarefas
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
// Função para contar tarefas
// ============================================
function countTasks() {
    const output = document.getElementById('output');
    if (output) {
        const count = output.children.length;
        alert(`Você tem ${count} tarefa${count !== 1 ? 's' : ''} na lista!`);
    }
}

// ============================================
// Inicialização: Adiciona listeners se necessário
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
    
    console.log('Aplicação inicializada com segurança!');
});

// ============================================
// Exporta funções para uso global (se necessário)
// ============================================
// Tornando funções disponíveis globalmente para o HTML
window.addTask = addTask;
window.clearAllTasks = clearAllTasks;
window.countTasks = countTasks;