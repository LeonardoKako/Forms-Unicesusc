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
- **Prisma ORM** (v7)
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
* [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) instalados na máquina.
* **Alternativamente (sem Docker):** [Node.js (v20+)](https://nodejs.org/) e um banco de dados **PostgreSQL** ativo no seu sistema.

---

### 🐳 Opção 1: Executando com Docker (Recomendado)

O projeto já está configurado com Dockerfiles otimizados e arquivos `.dockerignore` para evitar uploads de pacotes pesados desnecessários durante a construção das imagens.

#### Passo 1: Configurar o arquivo `.env`
Na raiz do projeto, garanta que você possui um arquivo `.env`. Configure as credenciais necessárias:
* **Segurança**: Ajuste a chave secreta de assinatura do JWT (`JWT_SECRET`).
* **SMTP**: Configure as credenciais do servidor SMTP (como Gmail/Google Workspace) para envio de e-mails de validação e feedback.
* **Destinatários**: Endereços do administrador e do verificador de locações.
* **Supabase**: URL e chave anônima para upload de anexos (`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`).
* **API URL**: Para rodar no docker com a porta ajustada contra conflitos, use `VITE_API_URL=http://localhost:3001`.

#### Passo 2: Iniciar os Containers
Execute o comando a seguir na raiz do projeto para construir as imagens e iniciar os serviços em segundo plano:
```bash
docker compose up --build -d
```

#### Passo 3: Acompanhar os status
* Abra o seu **Docker Desktop** para ver visualmente os contêineres ativos.
* Se preferir ver pelo terminal, utilize:
  ```bash
  docker ps
  ```

---

### 💻 Opção 2: Executando Localmente (Sem Docker)

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
3. Crie e configure o arquivo `.env` dentro da pasta `Backend` (garantindo que `DATABASE_URL` aponte para o seu PostgreSQL local).
4. Gere o cliente do Prisma e execute as migrações do banco de dados:
   ```bash
   npx prisma generate
   ```
   ```bash
   npx prisma migrate dev
   ```
5. Inicie o servidor em modo de desenvolvimento:
   ```bash
   npm run start:dev
   ```
   *O backend estará rodando em `http://localhost:3000` (ou `3001` conforme configurado).*

#### 3. Frontend
1. Navegue até a pasta do frontend:
   ```bash
   cd ../Frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure o arquivo `Frontend/.env` com as chaves necessárias.
4. Inicie o servidor de desenvolvimento do Vite:
   ```bash
   npm run dev
   ```
   *O frontend estará rodando por padrão em `http://localhost:5173`.*

---

## 🌐 URLs de Acesso Rápido

| Serviço | URL (Docker Compose) | URL (Local sem Docker) |
| :--- | :--- | :--- |
| **Frontend** (React/Vite) | [http://localhost](http://localhost) (Porta 80) | [http://localhost:5173](http://localhost:5173) |
| **Backend** (NestJS) | [http://localhost:3001](http://localhost:3001) | [http://localhost:3000](http://localhost:3000) |
| **Banco de Dados** (PostgreSQL) | `localhost:5432` | `localhost:5432` |

---

## 🗄️ Visualizando o Banco de Dados (Prisma Studio)

Caso precise inspecionar as tabelas do banco de dados localmente (como listar os eventos enviados ou gerenciar os tokens de validação), você pode usar o **Prisma Studio**:

1. Navegue até a pasta `Backend` no terminal do seu computador:
   ```bash
   cd Backend
   ```
2. Execute o comando:
   ```bash
   npx prisma studio
   ```
3. O visualizador abrirá automaticamente no seu navegador em **`http://localhost:5555`** (ou na porta indicada no console).

> ℹ️ **Nota:** Certifique-se de que a variável `DATABASE_URL` no arquivo `Backend/.env` esteja configurada com a mesma senha e porta definidas para o banco de dados que está ativo no Docker.

---

## ⚠️ Solução de Problemas Comuns

### 1. Conflito de porta 3000 (Ex: Grafana / Outros serviços locais)
Caso você tenha serviços como o Grafana rodando localmente na porta 3000, o backend no Docker poderá falhar ao tentar expor essa porta. 
* **Solução:** O mapeamento do backend no Docker Compose deste projeto foi configurado para a porta **3001** (`3001:3000`) para evitar conflitos. Garanta que a sua variável `VITE_API_URL` no `.env` da raiz estejam configuradas como `http://localhost:3001`.

### 2. Mudança de esquema do Prisma v7
Na versão 7 do Prisma ORM, a propriedade `url` não é mais definida diretamente dentro do arquivo `schema.prisma`. 
* **Importante:** Sempre garanta que o arquivo `prisma.config.js` está na raiz do backend e que o `Dockerfile` está copiando esse arquivo para as etapas de build do Docker.
