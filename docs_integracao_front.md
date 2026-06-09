# Documentação de Integração do Frontend — Eventos Internos vs. Locações Externas

Esta documentação descreve as mudanças realizadas no Backend e as diretrizes detalhadas para a adaptação do Frontend, permitindo que outro agente/desenvolvedor realize a criação das telas e rotas de Locação Externa de forma rápida e alinhada com as novas APIs.

---

## 1. O que foi feito no Backend

O backend foi completamente refatorado para separar os fluxos de **Eventos Internos** e **Locações Externas** para manter o código limpo, modular e de fácil manutenção:

1. **Configurações por Variáveis de Ambiente (`.env`)**:
   - `EVENTS_ADMIN_EMAIL`: E-mail que recebe os pedidos de aprovação dos eventos internos (Etapa 2).
   - `LOCATIONS_VERIFIER_EMAIL`: E-mail que realiza a primeira validação das locações externas (Etapa 1). *Apenas este e-mail pode validar e iniciar a requisição de locação.*
   - `LOCATIONS_ADMIN_EMAIL`: E-mail do administrador que recebe a solicitação após a verificação do e-mail fixado (Etapa 2).

2. **Novos Serviços de E-mail**:
   - `EventsEmailService` ([events-email.service.ts](file:///c:/Users/Leo/Documents/Forms%20Unicesusc/Backend/src/email/events-email.service.ts)): Lida exclusivamente com templates e envios de e-mails para eventos da comunidade interna.
   - `LocationsEmailService` ([locations-email.service.ts](file:///c:/Users/Leo/Documents/Forms%20Unicesusc/Backend/src/email/locations-email.service.ts)): Lida exclusivamente com templates e envios de e-mails para o fluxo de locações externas.

3. **Separação de Serviços de Negócio**:
   - `EventTicketsService` ([event-tickets.service.ts](file:///c:/Users/Leo/Documents/Forms%20Unicesusc/Backend/src/event-tickets/event-tickets.service.ts)): Mantém apenas a lógica de eventos internos.
   - `LocationsService` ([locations.service.ts](file:///c:/Users/Leo/Documents/Forms%20Unicesusc/Backend/src/event-tickets/locations.service.ts)): Serviço criado do zero focado exclusivamente em locações externas, validação de tokens JWT específicos e fluxos de aprovação específicos.

4. **Banco de Dados (Prisma)**:
   - Adicionados os campos `authorVerification` (boolean), `adminVerification` (boolean) e `adminRejectionReason` (string) na tabela/model `Location` para rastrear o status de aprovação de locações externas em duas etapas de forma independente das tabelas de eventos.

---

## 2. Especificação para o Frontend

Para espelhar a separação do Backend no Frontend, devem ser criadas duas novas páginas para locação externa, similares às de eventos internos:

### 2.1 Páginas Existentes (Eventos Internos)
As páginas existentes devem ser renomeadas e configuradas para atender exclusivamente ao fluxo de **Eventos Internos**:
1. **`VerifyPageEvent`** (Caminho físico recomendado: `Frontend/src/pages/VerifyPageEvent/VerifyPageEvent.tsx`):
   - **Rota**: `/verificar-evento?token=TOKEN`
   - **Endpoint consumido**: `GET /events/verify-author?token=TOKEN`
   - **Objetivo**: Confirmar o e-mail do autor da solicitação interna.
   
2. **`ReviewPageEvent`** (Caminho físico recomendado: `Frontend/src/pages/ReviewPageEvent/ReviewPageEvent.tsx`):
   - **Rota**: `/revisar-evento?token=TOKEN`
   - **Endpoints consumidos**:
     - Carregamento inicial: `GET /events/admin-review?token=TOKEN`
     - Submissão da decisão: `POST /events/admin-review` com body `{ token, approved, reason }`
   - **Objetivo**: Permitir que o administrador aprove ou rejeite o evento interno (com justificativa em caso de rejeição).

---

### 2.2 Novas Páginas a Criar (Locações Externas)
Devem ser criadas duas novas páginas seguindo o mesmo estilo visual premium, mas direcionadas para o fluxo de **Locações Externas**:

1. **`VerifyPageLocation`** (Caminho sugerido: `Frontend/src/pages/VerifyPageLocation/VerifyPageLocation.tsx`):
   - **Rota sugerida**: `/verificar-locacao?token=TOKEN`
   - **Endpoint a consumir**: `GET /locations/verify-author?token=TOKEN`
   - **Objetivo**: Confirmar o e-mail verificador fixo que autoriza a locação externa.
   
2. **`ReviewPageLocation`** (Caminho sugerido: `Frontend/src/pages/ReviewPageLocation/ReviewPageLocation.tsx`):
   - **Rota sugerida**: `/revisar-locacao?token=TOKEN`
   - **Endpoints a consumir**:
     - Carregamento inicial: `GET /locations/admin-review?token=TOKEN`
     - Submissão da decisão: `POST /locations/admin-review` com body `{ token, approved, reason }`
   - **Objetivo**: Permitir que o administrador de locações aprove ou rejeite a locação externa.
   - **Dica de Componentização**: Importar e reutilizar os subcomponentes de `ReviewPageEvent/components` (como `RequesterDetailsCard`, `LocationAgendaCard`, `InfrastructureSupportCard`), já que eles possuem regras internas para exibir ou ocultar campos dinamicamente dependendo de o tipo de requisição ser `locacao` ou `isInterno`.
   - **Atenção**: Para as locações externas, remover os componentes `EventDetailsCard` e `FoodFinanceCard` na renderização, pois esses dados não fazem parte e não são coletados no fluxo de locação.

---

## 3. Configuração de Rotas no `App.tsx`

As rotas no arquivo de rotas do React (`App.tsx`) devem ser atualizadas para o seguinte mapeamento:

```tsx
import VerifyPageEvent from "./pages/VerifyPageEvent/VerifyPageEvent";
import ReviewPageEvent from "./pages/ReviewPageEvent/ReviewPageEvent";
import VerifyPageLocation from "./pages/VerifyPageLocation/VerifyPageLocation";
import ReviewPageLocation from "./pages/ReviewPageLocation/ReviewPageLocation";

// Dentro de <Routes>
{/* Rotas de Eventos Internos */}
<Route path='/verificar-evento' element={<VerifyPageEvent />} />
<Route path='/revisar-evento' element={<ReviewPageEvent />} />

{/* Rotas de Locações Externas */}
<Route path='/verificar-locacao' element={<VerifyPageLocation />} />
<Route path='/revisar-locacao' element={<ReviewPageLocation />} />
```

---

## 4. Estrutura dos Contratos da API de Locação

### Validação do Verificador (Etapa 1)
- **Método**: `GET`
- **URL**: `{BACKEND_URL}/locations/verify-author`
- **Query Params**: `token` (String - JWT enviado por e-mail)
- **Retorno Esperado**: `200 OK` em caso de sucesso.

### Carregamento de Detalhes da Locação pelo Admin (Etapa 2)
- **Método**: `GET`
- **URL**: `{BACKEND_URL}/locations/admin-review`
- **Query Params**: `token` (String - JWT enviado ao administrador)
- **Retorno Esperado**: JSON contendo os dados da locação (`Location`).

### Decisão do Administrador (Aprovação / Rejeição)
- **Método**: `POST`
- **URL**: `{BACKEND_URL}/locations/admin-review`
- **Body**:
  ```json
  {
    "token": "JWT_TOKEN",
    "approved": true, // ou false
    "reason": "Justificativa obrigatória se approved for false (min 5 chars)"
  }
  ```
- **Retorno Esperado**: `200 OK` com mensagem de sucesso.
