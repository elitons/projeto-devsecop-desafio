// ============================================
// 📋 Busca tarefas do "banco de dados"
// ============================================
function carregarTarefas() {
    console.log('🔄 Carregando tarefas...');
    
    // 🔧 CORREÇÃO: Tenta diferentes caminhos para o db.json
    const caminhos = [
        './db.json',
        'db.json',
        '../db.json'
    ];
    
    function tentarCarregar(index) {
        if (index >= caminhos.length) {
            console.error('❌ Todos os caminhos falharam');
            mostrarErro();
            return;
        }
        
        const caminho = caminhos[index];
        console.log(`📡 Tentando carregar: ${caminho}`);
        
        fetch(caminho)
            .then(response => {
                console.log(`📡 Resposta de ${caminho}:`, response.status);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('✅ Dados carregados com sucesso:', data);
                processarDados(data);
            })
            .catch(err => {
                console.warn(`⚠️ Falha ao carregar ${caminho}:`, err.message);
                tentarCarregar(index + 1);
            });
    }
    
    function processarDados(data) {
        // Atualiza o status
        const statusElement = document.getElementById('db-status');
        if (statusElement) {
            if (data.status) {
                statusElement.textContent = data.status;
                statusElement.style.color = '#28a745';
            } else {
                statusElement.textContent = 'Conectado ao Banco de Dados';
                statusElement.style.color = '#28a745';
            }
        }

        // Carrega as tarefas
        const list = document.getElementById('task-list');
        if (list && data.itens && Array.isArray(data.itens)) {
            // Limpa a lista antes de adicionar
            list.innerHTML = '';
            
            data.itens.forEach(item => {
                let li = document.createElement('li');
                li.textContent = item.task || 'Tarefa sem descrição';
                
                // Adiciona botão de excluir para cada tarefa
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
                
                deleteBtn.onclick = function(e) {
                    e.stopPropagation();
                    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
                        list.removeChild(li);
                    }
                };
                
                li.appendChild(deleteBtn);
                list.appendChild(li);
            });
            
            console.log(`📋 ${data.itens.length} tarefas carregadas`);
        }
    }
    
    function mostrarErro() {
        // 🔒 SEGURANÇA: Mensagem genérica para o usuário
        const statusElement = document.getElementById('db-status');
        if (statusElement) {
            statusElement.textContent = 'Erro ao conectar ao banco de dados';
            statusElement.style.color = '#dc3545';
        }
        
        // Mostra um fallback com tarefas exemplo
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
    }
    
    // Inicia a tentativa de carregamento
    tentarCarregar(0);
}

// ============================================
// ➕ Adiciona nova tarefa na tela
// ============================================
function addTask() {
    const input = document.getElementById('new-task');
    const list = document.getElementById('task-list');
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
        .replace(/\//g, '&#x2F;')
        .trim();

    // 🔒 SEGURANÇA: Usa createElement em vez de innerHTML
    const li = document.createElement('li');
    li.textContent = sanitizedText;

    // Adiciona botão de excluir
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

    // Mostra mensagem de confirmação
    if (output) {
        output.textContent = '✅ Tarefa adicionada com sucesso!';
        output.style.color = '#28a745';
        setTimeout(() => {
            output.textContent = '';
        }, 3000);
    }

    console.log(`✅ Tarefa adicionada: "${sanitizedText}"`);

    // Limpa o input
    input.value = '';
}

// ============================================
// 🚀 Função: Limpar todas as tarefas
// ============================================
function clearAllTasks() {
    const list = document.getElementById('task-list');
    if (list && list.children.length > 0) {
        if (confirm('Tem certeza que deseja excluir TODAS as tarefas?')) {
            while (list.firstChild) {
                list.removeChild(list.firstChild);
            }
            console.log('🗑️ Todas as tarefas foram removidas');
            
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
// 📊 Função: Contar tarefas
// ============================================
function countTasks() {
    const list = document.getElementById('task-list');
    if (list) {
        const count = list.children.length;
        const mensagem = count === 0 
            ? 'Você não tem nenhuma tarefa na lista!' 
            : `Você tem ${count} tarefa${count !== 1 ? 's' : ''} na lista!`;
        alert(mensagem);
    }
}

// ============================================
// 🎯 Inicialização
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Aplicação inicializando...');
    
    // Carrega as tarefas
    carregarTarefas();
    
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