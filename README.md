# 🔐 Desafio DevSecOps — Gerenciador de Tarefas

## Sobre o Projeto
Este repositório faz parte do desafio prático do módulo de DevSecOps da ADA Tech.
O projeto consiste em um **Gerenciador de Tarefas** com vulnerabilidades propositais e uma pipeline incompleta.

O objetivo foi **implementar a pipeline de segurança** e **corrigir as vulnerabilidades** para que o código chegue em produção de forma segura.

## Estado atual
✅ Pipeline **completa** e funcionando
✅ Todos os steps de segurança **implementados**
✅ Vulnerabilidades **corrigidas**
✅ Deploy **realizado** com sucesso

## 🚀 Pipeline DevSecOps

### Como a pipeline funciona

A pipeline é executada automaticamente a cada `push` na branch `main` e segue os seguintes passos:

#### Step 1: 📥 Checkout do Código
**O que faz:** Baixa o código mais recente do repositório.

**Por que é importante:** Garante que estamos analisando a versão mais atual do código.

---

#### Step 2: ⚙️ Setup Node.js e Build
**O que faz:** Configura o ambiente Node.js e instala as dependências do projeto.

**Por que é importante:** Prepara o ambiente para executar as ferramentas de segurança e valida que o projeto compila corretamente.

---

#### Step 3: 🔑 Secrets Scanning com Gitleaks
**O que faz:** Varre todo o código e histórico de commits em busca de segredos expostos:
- Tokens de API
- Senhas
- Chaves privadas
- Credenciais hardcoded

**Por que é importante:** 
- Evita que informações sensíveis vazem para o repositório
- Protege contra acessos não autorizados
- É a primeira linha de defesa contra vazamento de dados

**Ferramenta:** [Gitleaks](https://github.com/gitleaks/gitleaks)

---

#### Step 4: 🔍 SAST com Semgrep
**O que faz:** Analisa o código estaticamente em busca de padrões inseguros:
- XSS (Cross-Site Scripting)
- Injeção de código
- Uso de funções perigosas
- Práticas inseguras de programação

**Por que é importante:**
- Detecta vulnerabilidades antes do código ser executado
- Previne ataques comuns (OWASP Top 10)
- Educa os desenvolvedores sobre práticas seguras

**Ferramenta:** [Semgrep](https://semgrep.dev/)

---

#### Step 5: 📦 SCA com Grype
**O que faz:** Escaneia as dependências do projeto em busca de CVEs (vulnerabilidades conhecidas):
- Verifica versões de pacotes npm
- Identifica vulnerabilidades em bibliotecas de terceiros
- Bloqueia dependências com severidade média ou alta

**Por que é importante:**
- Garante que bibliotecas de terceiros sejam seguras
- Previne ataques via cadeia de suprimentos
- Mantém as dependências atualizadas

**Ferramenta:** [Grype](https://github.com/anchore/grype)

---

#### Step 6: 🌐 Deploy com GitHub Pages
**O que faz:** Publica a aplicação no GitHub Pages apenas se **todos** os steps de segurança passarem.

**Por que é importante:**
- Implementa o conceito **"Break the Build"**
- Código inseguro **nunca** chega em produção
- Segurança é **obrigatória**, não opcional

---

## 🐛 Vulnerabilidades Encontradas e Corrigidas

### 1. 🔴 Credenciais Hardcoded (Crítico)

**Arquivo:** `src/script.js`

**Problema:**
```javascript
const API_KEY = "ghp_xK92mNpL34rTvQ87wZaB56cDeFgHiJkL";
const DB_PASSWORD = "admin@prod#2024";

## 2. 🔴 CRÍTICO - Senha de Banco de Dados Hardcoded

**Arquivo:** `src/script.js`

### Problema

```javascript
const DB_PASSWORD = "admin@prod#2024";
```

### Correção

```javascript
// Senha removida - usar variáveis de ambiente
// const DB_PASSWORD = process.env.DB_PASSWORD;
```

> **Risco:** Senha de banco de dados exposta, permitindo acesso não autorizado aos dados, roubo de informações e comprometimento do sistema.

---

## 3. 🔴 ALTO - XSS (Cross-Site Scripting) via `innerHTML`

**Arquivo:** `src/script.js`

### Problema

```javascript
function addTask() {
    const input = document.getElementById('new-task');
    const output = document.getElementById('output');
    output.innerHTML = '<li>' + input.value + '</li>';
    input.value = '';
}
```

### Correção

```javascript
function addTask() {
    const input = document.getElementById('new-task');
    const list = document.getElementById('task-list');

    // Sanitização do input
    const sanitizedText = input.value
        .replace(/[<>]/g, '')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;')
        .trim();

    // Uso seguro de createElement
    const li = document.createElement('li');
    li.textContent = sanitizedText;
    list.appendChild(li);
    input.value = '';
}
```

> **Risco:** Injeção de scripts maliciosos no navegador do usuário, permitindo roubo de cookies, sessões e dados sensíveis.

---

## 4. 🔴 ALTO - Uso da função `eval()`

**Arquivo:** `src/script.js`

### Problema

```javascript
eval('console.log("Tarefa adicionada: ' + input.value + '")');
```

### Correção

```javascript
console.log(`Tarefa adicionada: "${sanitizedText}"`);
```

> **Risco:** Execução de código arbitrário, permitindo ataques de injeção, comprometimento do sistema e execução de comandos maliciosos.

---

## 5. 🟠 MÉDIO - Dependência Axios com 22 Vulnerabilidades

**Arquivo:** `package.json`

### Problema

```json
"axios": "^0.21.4"
```

### Correção

```json
"axios": "^1.18.1"
```

### Vulnerabilidades corrigidas

- SSRF (Server-Side Request Forgery)
- XSRF (Cross-Site Request Forgery)
- Prototype Pollution
- DoS (Denial of Service)
- Credential Leakage
- Header Injection
- Regular Expression DoS
- Mais 15 vulnerabilidades

> **Risco:** Múltiplas vulnerabilidades permitindo ataques diversos, desde negação de serviço até roubo de credenciais.

---

## 6. 🟠 MÉDIO - Dependência Lodash com Prototype Pollution

**Arquivo:** `package.json`

### Problema

```json
"lodash": "^4.18.1"
```

### Correção

```json
"lodash": "^4.17.21"
```

> **Risco:** Prototype Pollution permitindo manipulação de objetos globais, sobrescrita de métodos e execução de código arbitrário.

---

## 7. 🟠 MÉDIO - Dependência Express com Vulnerabilidades

**Arquivo:** `package.json`

### Problema

```json
"express": "^4.22.2"
```

### Correção

```json
"express": "^4.21.2"
```

> **Risco:** Diversas vulnerabilidades no framework web, incluindo problemas de segurança em rotas, middlewares e manipulação de requisições.

---

## 8. 🟡 BAIXO - Exposição de Stack Trace

**Arquivo:** `src/script.js`

### Problema

```javascript
.catch(err => {
    document.getElementById('db-status').innerText =
        'Erro interno: ' + err.stack;
});
```

### Correção

```javascript
.catch(err => {
    document.getElementById('db-status').innerText =
        'Erro ao carregar dados. Tente novamente mais tarde.';
    console.error('Erro ao buscar dados:', err.message);
});
```

> **Risco:** Vazamento de informações internas do sistema para o usuário final, incluindo caminhos de arquivos, versões de bibliotecas e estrutura do código.

---

## 9. 🟡 BAIXO - Falta de Sanitização de Input

**Arquivo:** `src/script.js`

### Problema

```javascript
function addTask() {
    const input = document.getElementById('new-task');
    // Nenhuma sanitização
    output.innerHTML = '<li>' + input.value + '</li>';
}
```

### Correção

```javascript
function addTask() {
    const input = document.getElementById('new-task');

    // Sanitização completa
    const sanitizedText = input.value
        .replace(/[<>]/g, '')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;')
        .trim();

    const li = document.createElement('li');
    li.textContent = sanitizedText;
    list.appendChild(li);
}
```

> **Risco:** XSS, injeção de código, comportamento imprevisível e possíveis ataques de script entre sites.

---

## 10. 🟡 BAIXO - Falta de Validação de Input

**Arquivo:** `src/script.js`

### Problema

```javascript
function addTask() {
    const input = document.getElementById('new-task');

    // Permite adicionar tarefas vazias
    output.innerHTML = '<li>' + input.value + '</li>';
}
```

### Correção

```javascript
function addTask() {
    const input = document.getElementById('new-task');

    // Validação de entrada
    if (!input || !input.value || input.value.trim() === '') {
        alert('Por favor, digite uma tarefa!');
        return;
    }

    // Continua com a sanitização e adição
    const sanitizedText = input.value
        .replace(/[<>]/g, '')
        .trim();

    const li = document.createElement('li');
    li.textContent = sanitizedText;
    list.appendChild(li);
    input.value = '';
}
```

> **Risco:** Dados inválidos no sistema, experiência ruim do usuário, possível quebra de funcionalidades e inconsistências nos dados.

---

# 📊 Resumo das Vulnerabilidades

| # | Vulnerabilidade | Severidade | Arquivo | Status |
|---|-----------------|------------|---------|--------|
| 1 | Token GitHub Hardcoded | 🔴 CRÍTICO | `script.js` | ✅ Corrigido |
| 2 | Senha Hardcoded | 🔴 CRÍTICO | `script.js` | ✅ Corrigido |
| 3 | XSS via `innerHTML` | 🔴 ALTO | `script.js` | ✅ Corrigido |
| 4 | Uso de `eval()` | 🔴 ALTO | `script.js` | ✅ Corrigido |
| 5 | Axios (22 CVEs) | 🟠 MÉDIO | `package.json` | ✅ Corrigido |
| 6 | Lodash Prototype Pollution | 🟠 MÉDIO | `package.json` | ✅ Corrigido |
| 7 | Express Vulnerável | 🟠 MÉDIO | `package.json` | ✅ Corrigido |
| 8 | Exposição de Stack Trace | 🟡 BAIXO | `script.js` | ✅ Corrigido |
| 9 | Falta de Sanitização | 🟡 BAIXO | `script.js` | ✅ Corrigido |
| 10 | Falta de Validação | 🟡 BAIXO | `script.js` | ✅ Corrigido |