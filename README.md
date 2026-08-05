# HelpDesk - Sistema de Gerenciamento de Chamados

Este é um projeto Full Stack de um sistema de HelpDesk para gerenciamento de chamados técnicos, desenvolvido com Node.js no backend e ReactJS no frontend.

---

## ✨ Preview

![Preview do HelpDesk](./preview.png)

---

## Visão Geral

O sistema permite que clientes abram chamados técnicos e que administradores gerenciem esses chamados, atualizando status, prioridades e atribuindo técnicos.

-   **Backend (API):** Construído com Node.js, Express e Postgresql.
-   **Frontend (Web):** Construído com ReactJS, Vite, e estilizado com Tailwind CSS.

---

## 🏛️ Backend (API)

A API é responsável por toda a lógica de negócio, autenticação e manipulação de dados no banco de dados.

### 🚀 Setup e Execução Local

1.  **Navegue até o diretório da API:**
    ```bash
    cd api
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz do diretório `api/` e adicione as seguintes variáveis, substituindo pelos seus valores. Você pode usar o arquivo `.env-example` como base.

    ```ini
    # Porta da aplicação
    PORT=3333

    # URL de conexão do PostgreSQL
    DATABASE_URL=postgresql://user:password@host:5432/helpdesk

    # Segredo para o JWT (Json Web Token)
    JWT_SECRET=seu_segredo_super_secreto

    ```

4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    O servidor estará rodando em `http://localhost:3333`.

### 📜 Scripts Disponíveis

-   `npm run dev`: Inicia o servidor em modo de desenvolvimento.
-   `npm start`: Inicia o servidor em modo de produção.
-   `npm test`: Executa os testes.

### ✨ Link do Deploy

A API está disponível publicamente no seguinte endereço:

-   **URL da API:** [https://helpdesk-zrh4.onrender.com](https://helpdesk-zrh4.onrender.com)

---

## 💻 Frontend (Web)

A interface web permite que os usuários interajam com o sistema de forma visual e intuitiva.

### 🚀 Setup e Execução Local

1.  **Navegue até o diretório do frontend:**
    ```bash
    cd web
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    A aplicação estará disponível em `http://localhost:5173`.

### 📜 Scripts Disponíveis

-   `npm run dev`: Inicia o servidor de desenvolvimento do Vite.
-   `npm run build`: Compila a aplicação para produção.
-   `npm run preview`: Pré-visualiza a build de produção localmente.

### ✨ Link do Deploy

A aplicação web está disponível publicamente no seguinte endereço:

-   **URL do Frontend:** [https://help-desk-rho-one.vercel.app](https://help-desk-rho-one.vercel.app)

---

## 👤 Usuários de Exemplo

Você pode usar as seguintes credenciais para testar a aplicação:

### Administrador
-   **Email:** `polly@admin.com`
-   **Senha:** `senha123`

### Cliente
-   **Email:** `suza@client.com`
-   **Senha:** `senha123`