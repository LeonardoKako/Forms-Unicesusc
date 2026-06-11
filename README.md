# Forms-Unicesusc 📋

Este projeto é um sistema de formulários para gerenciamento de **Locações** e **Eventos Internos**, integrando fluxos de validação por e-mail e notificações automáticas para equipes de apoio.

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React** (com TypeScript)
- **Vite**
- **Tailwind CSS**
- **Supabase** (para upload e gerenciamento de arquivos)
- **Axios** (para comunicação HTTP)
- **Zustand** (para gerência de estado)

### Backend
- **NestJS** (TypeScript)
- **PostgreSQL**
- **Prisma ORM**
- **JWT** (para validação de segurança via tokens por e-mail)
- **Nodemailer** (para envio automatizado de e-mails)

---

## 🔄 Fluxos da Aplicação

### 1. Evento Interno
1. O usuário submete o formulário de evento interno.
2. O usuário recebe um e-mail com um link de validação JWT para confirmar sua identidade e o envio do pedido.
3. Após a confirmação do usuário, o **Administrador de Eventos** revisa o formulário no painel administrativo e decide validar ou invalidar.
4. Em ambos os casos, o usuário recebe um e-mail de feedback com o resultado.
5. Se for **validado**, as **equipes de apoio** (TI, infraestrutura, comunicação, etc.) são notificadas automaticamente via e-mail.

### 2. Locação
1. O usuário submete o formulário de locação.
2. Apenas um usuário verificador específico (com o e-mail fixo definido nas variáveis de ambiente) recebe o link JWT para validar o envio do formulário.
3. Após essa validação do verificador, o fluxo segue de forma idêntica ao evento interno (Admin de Eventos revisa -> Feedback -> Notificação das equipes de apoio).

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) instalados na máquina.
- Alternativamente, para rodar sem Docker: **Node.js (v20+)** e um banco de dados **PostgreSQL** ativo.

---

### Opção 1: Executando com Docker (Recomendado)

O projeto já possui configurações prontas para Docker no frontend (`Frontend/Dockerfile`), backend (`Backend/Dockerfile`) e um arquivo de exemplo do Docker Compose.

#### Passo 1: Configurar as Variáveis de Ambiente
1. Na raiz do projeto, crie um arquivo `.env` a partir do arquivo de exemplo:
   ```bash
   copy .env.example .env
   ```
2. Abra o arquivo `.env` e configure as credenciais necessárias:
   - **Banco de Dados**: Usuário, senha e nome do banco local do container.
   - **Segurança**: Ajuste a chave secreta de assinatura do JWT (`JWT_SECRET`).
   - **SMTP**: Configure as credenciais do servidor SMTP (como Gmail/Google Workspace) para envio de e-mails de validação e feedback.
   - **Destinatários fixos**: E-mails do administrador e do verificador de locações (por exemplo, `EVENTS_ADMIN_EMAIL` e `LOCATIONS_VERIFIER_EMAIL`).
   - **Supabase**: URL e chave anônima para upload de anexos (`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`).

#### Passo 2: Criar o arquivo Docker Compose
1. Copie o arquivo `docker-compose.example.yml` para `docker-compose.yml`:
   ```bash
   copy docker-compose.example.yml docker-compose.yml
   ```

#### Passo 3: Iniciar os Containers
Execute o comando a seguir na raiz do projeto para construir as imagens e iniciar os serviços:
```bash
docker compose up --build
```
> **Nota:** O container do Backend executa automaticamente as migrações do Prisma (`npx prisma migrate deploy`) no banco de dados na inicialização do serviço.

---

### Opção 2: Executando Localmente (Sem Docker)

Se preferir rodar cada serviço diretamente na sua máquina, siga os passos abaixo:

#### 1. Banco de Dados
Certifique-se de ter um servidor PostgreSQL rodando localmente com a database criada correspondente à string `DATABASE_URL` no `.env` do Backend.

#### 2. Backend
1. Navegue até a pasta do backend:
   ```bash
   cd Backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie e configure o arquivo `.env` dentro da pasta `Backend` (ou garanta que as variáveis globais estejam acessíveis).
4. Gere o cliente do Prisma e execute as migrações do banco de dados:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```
5. Inicie o servidor em modo de desenvolvimento:
   ```bash
   npm run start:dev
   ```
   *O backend estará rodando em `http://localhost:3000`.*

#### 3. Frontend
1. Navegue até a pasta do frontend:
   ```bash
   cd ../Frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie e configure o arquivo `.env` na pasta `Frontend` com as variáveis necessárias (URL da API, chaves do Supabase).
4. Inicie o servidor de desenvolvimento do Vite:
   ```bash
   npm run dev
   ```
   *O frontend estará rodando por padrão em `http://localhost:5173`.*

---

## 🌐 URLs de Acesso

| Serviço | URL (Docker Compose) | URL (Local sem Docker) |
| :--- | :--- | :--- |
| **Frontend** (React/Vite) | [http://localhost](http://localhost) | [http://localhost:5173](http://localhost:5173) |
| **Backend** (NestJS) | [http://localhost:3000](http://localhost:3000) | [http://localhost:3000](http://localhost:3000) |
| **Banco de Dados** (PostgreSQL) | `localhost:5432` | `localhost:5432` (ou porta configurada) |
