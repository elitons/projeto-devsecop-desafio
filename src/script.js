// ============================================
// 🔒 SEGURANÇA: Credenciais removidas do código
// ============================================

// ============================================
// 📋 Busca tarefas do "banco de dados"
// ============================================
function carregarTarefas() {
    console.log('🔄 Carregando tarefas...');
    
    // ✅ CAMINHO CORRETO PARA GITHUB PAGES
    fetch('./db.json')
        .then(response => {
            console.log('📡 Resposta:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('✅ Dados carregados:', data);
            
            // Atualiza o status
            const statusElement = document.getElementById('db-status');
            if (statusElement) {
                statusElement.textContent = data.status || 'Conectado ao Banco de Dados';
                statusElement.style.color = '#28a745';
            }

            // Carrega as tarefas
            const list = document.getElementById('task-list');
            if (list && data.itens && Array.isArray(data.itens)) {
                list.innerHTML = '';
                
                data.itens.forEach(item => {
                    let li = document.createElement('li');
                    li.textContent = item.task || 'Tarefa sem descrição';
                    
                    // Botão de excluir
                    const deleteBtn = document.createElement('button');
                    deleteBtn.textContent = '🗑️ Excluir';
                    deleteBtn.className = 'delete-btn';
                    deleteBtn.style.marginLeft = '10px';
                    deleteBtn.style.cursor = 'pointer';
                    deleteBtn.style.backgroundColor = '#dc3545';
                    deleteBtn.style.color = 'white';
                    deleteBtn.style.border = 'none';
                    deleteBtn.style.padding = '5px 10px';
                    deleteBtn.style.borderRadius = '4px';
                    
                    deleteBtn.onclick = function() {
                        if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
                            list.removeChild(li);
                        }
                    };
                    
                    li.appendChild(deleteBtn);
                    list.appendChild(li);
                });
                
                console.log(`📋 ${data.itens.length} tarefas carregadas`);
            }
        })
        .catch(err => {
            console.error('❌ Erro:', err);
            
            const statusElement = document.getElementById('db-status');
            if (statusElement) {
                statusElement.textContent = 'Erro ao conectar ao banco de dados';
                statusElement.style.color = '#dc3545';
            }
            
            // Fallback com tarefas exemplo
            const list = document.getElementById('task-list');
            if (list) {
                const fallbackTasks = [
                    'Implementar a pipeline de segurança',
                    'Corrigir as vulnerabilidades do projeto',
                    'Fazer o deploy em produção'
                ];
                
                fallbackTasks.forEach(task => {
                    let li = document.createElement('li');
                    li.textContent = task;
                    list.appendChild(li);
                });
            }
        });
}

// ============================================
// ➕ Adiciona nova tarefa
// ============================================
function addTask() {
    const input = document.getElementById('new-task');
    const list = document.getElementById('task-list');
    const output = document.getElementById('output');
    
    if (!input || !input.value || input.value.trim() === '') {
        alert('Por favor, digite uma tarefa!');
        return;
    }

    // Sanitização
    const sanitizedText = input.value
        .replace(/[<>]/g, '')
        .trim();

    const li = document.createElement('li');
    li.textContent = sanitizedText;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑️ Excluir';
    deleteBtn.className = 'delete-btn';
    deleteBtn.style.marginLeft = '10px';
    deleteBtn.style.cursor = 'pointer';
    deleteBtn.style.backgroundColor = '#dc3545';
    deleteBtn.style.color = 'white';
    deleteBtn.style.border = 'none';
    deleteBtn.style.padding = '5px 10px';
    deleteBtn.style.borderRadius = '4px';
    
    deleteBtn.onclick = function() {
        if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
            list.removeChild(li);
        }
    };

    li.appendChild(deleteBtn);
    list.appendChild(li);

    if (output) {
        output.textContent = '✅ Tarefa adicionada com sucesso!';
        output.style.color = '#28a745';
        setTimeout(() => {
            output.textContent = '';
        }, 3000);
    }

    input.value = '';
}

// ============================================
// 🚀 Limpar todas as tarefas
// ============================================
function clearAllTasks() {
    const list = document.getElementById('task-list');
    if (list && list.children.length > 0) {
        if (confirm('Tem certeza que deseja excluir TODAS as tarefas?')) {
            while (list.firstChild) {
                list.removeChild(list.firstChild);
            }
            const output = document.getElementById('output');
            if (output) {
                output.textContent = '🗑️ Todas as tarefas foram removidas';
                output.style.color = '#dc3545';
                setTimeout(() => {
                    output.textContent = '';
                }, 3000);
            }
        }
    } else {
        alert('Não há tarefas para remover!');
    }
}

// ============================================
// 📊 Contar tarefas
// ============================================
function countTasks() {
    const list = document.getElementById('task-list');
    if (list) {
        const count = list.children.length;
        alert(`Você tem ${count} tarefa${count !== 1 ? 's' : ''} na lista!`);
    }
}

// ============================================
// 🎯 Inicialização
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Aplicação inicializada com segurança!');
    carregarTarefas();
    
    const input = document.getElementById('new-task');
    if (input) {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addTask();
            }
        });
    }
});

// ============================================
// 📝 Exporta funções
// ============================================
window.addTask = addTask;
window.clearAllTasks = clearAllTasks;
window.countTasks = countTasks;