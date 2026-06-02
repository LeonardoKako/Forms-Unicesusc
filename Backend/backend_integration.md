# Integração do Backend: Especificação de Payloads e Regras de Negócio

Este guia detalha a estrutura de objetos JSON gerados pelo Frontend para cada fluxo do formulário de reservas de espaço da **Unicesusc**, acompanhado das regras de validação cruzada aplicadas.

---

## 1. Fluxo: Locação Externa (Simplificado)

Este formulário destina-se a parceiros e entidades externas para aluguel de espaços do campus. As regras de negócio são mínimas e simplificadas, não envolvendo serviços internos complexos da instituição.

### Payload JSON de Envio (`POST /api/locations` ou similar)

```json
{
  "controlCode": "#LOC-918523",
  "requesterType": "locacao",
  "requesterName": "eqwewq",
  "requesterEmail": "apoio03.ti@unicesusc.edu.br",
  "requesterPhone": "48988352502",
  "eventDate": "2026-06-24",
  "startTime": "07:36",
  "endTime": "17:38",
  "selectedRoom": "colegio",
  "roomNotes": "decricao locacao",
  "supportTeams": ["marketing", "administrativo", "nap", "manutencao"]
}
```

### Regras de Negócio e Validação (Locação Externa)

*   **Identificação:** Os campos `requesterName`, `requesterEmail` e `requesterPhone` são **obrigatórios**.
*   **Regra de E-mail / Contato:** Qualquer e-mail de contato válido é aceito. Um alerta visual no frontend destaca que todas as solicitações deverão ser validadas pelo e-mail do gestor: **`gestor.campus@unicesusc.edu.br`**.
*   **Período Mínimo de Antecedência:** A reserva deve possuir no mínimo **15 dias de antecedência** com base no dia atual do envio.
*   **Restrição de Finais de Semana:** Finais de semana (sábado/domingo) só podem ser agendados se o período de antecedência do evento for **maior que 15 dias**. Caso o agendamento seja feito em menos tempo, os finais de semana ficam bloqueados no calendário.
*   **Janela de Horário Permitido:** Os horários `startTime` e `endTime` são obrigatórios e devem estar estritamente contidos entre **07:30 e 22:30**. O horário de término deve ser posterior ao início.
*   **Equipes de Apoio:** O array `supportTeams` é obrigatório e deve conter ao menos as equipes solicitadas (por padrão, inicia pré-marcado com `["marketing", "administrativo"]`).

---

## 2. Fluxo: Comunidade Interna (Completo)

Formulário completo utilizado por docentes, coordenadores e setores acadêmicos. Contém regras de orçamento cruzadas e dependências de serviços e logística detalhadas.

### Payload JSON de Envio (`POST /api/events` ou similar)

```json
{
  "controlCode": "#INT-525311",
  "requesterType": "interno",
  "requesterName": "eqwewq",
  "requesterEmail": "apoio03.ti@unicesusc.edu.br",
  "requesterPhone": "48988352502",
  "requesterDepartment": "eqweqwe",
  "isPartnerEvent": true,
  "partnerName": "eqwewq",
  "partnerEmail": "apoio03.ti@unicesusc.edu.br",
  "partnerPhone": "48988352502",
  "partnerInstitution": "eqwewq",
  "eventTitle": "eqwewq",
  "eventType": "palestra",
  "eventDescription": "descricao evento",
  "targetAudience": ["colaboradores", "aberto_publico"],
  "estimatedPublic": 8,
  "eventDate": "2026-06-19",
  "startTime": "08:36",
  "endTime": "12:36",
  "selectedRoom": "auditorio",
  "roomNotes": "descricao espaco",
  "needsBudget": true,
  "budgetApprovalFileUrl": "https://kgdmqgzhfgnndbxtcqdq.supabase.co/storage/v1/object/public/comprovantes/orcamentos/ryv9l9j3b-17804002404",
  "copa": ["faca_bolo", "tacas_padrao", "outro"],
  "otherCopaDescription": "descricao copa",
  "coffeeBreak": "padrao_100",
  "coffeeNotes": "descricao coffe",
  "tiEquipment": ["projetor_grande", "projetor_pequeno", "notebook"],
  "furnitureSupport": ["outro", "mesas_apoio_sala", "cadeiras_cinza"],
  "otherFurnitureDescription": "descricao moveis",
  "supportTeams": ["marketing", "administrativo", "biblioteca", "ti"],
  "presentationMaterials": ["google_drive_link"],
  "presentationDriveLink": "https://drive.google.com/drive/folders/1RrAr4Qrjh7YhqMpstjMDZ4Qv1dOQ_cQY",
  "needsArtwork": true,
  "hasPrintedArtwork": true,
  "artworkDescription": "descricao arte"
}
```

### Regras de Negócio e Validação (Comunidade Interna)

*   **Validação de E-mail Institucional:**
    *   Deve terminar estritamente com **`@unicesusc.edu.br`**.
    *   **Não pode** conter 3 ou mais números sequenciais seguidos antes do `@` (Ex: `apoio03.ti@...` é permitido, pois há uma letra e ponto separando, mas `apoio123@...` é bloqueado).
*   **Setor/Departamento:** `requesterDepartment` é obrigatório para identificação do fluxo de cobranças (mínimo 2 caracteres).
*   **Evento Parceiro:** Caso `isPartnerEvent` seja `true`, os dados do parceiro externo (`partnerName`, `partnerEmail`, `partnerPhone`, `partnerInstitution`) tornam-se **obrigatórios**.
*   **Barreiras de Orçamento Financeiro (Validação Cruzada Obrigatória):**
    *   **Coffee Break:** O campo `coffeeBreak` é uma `string` obrigatória representando o plano selecionado. Se o usuário escolher qualquer plano diferente de `"nao_se_aplica"`, o campo `needsBudget` é forçado automaticamente para `true` e a caixa de seleção de orçamento fica marcada e desabilitada.
    *   **Arte Impressa:** Se `needsArtwork` (Arte) for `true` **E** `hasPrintedArtwork` (Peça Impressa - banner, etc.) for `true`, o orçamento `needsBudget` é forçado para `true`. Se for apenas arte digital, o orçamento continua opcional.
    *   **Comprovante:** Se `needsBudget` for `true`, o envio do documento de aprovação financeira (`budgetApprovalFileUrl` carregado no Supabase Storage bucket `comprovantes` pasta `orcamentos/`) é **estritamente obrigatório**.
*   **Logística e TI Reativos:**
    *   Se o usuário marcar qualquer Equipamento de T.I. (`tiEquipment` que não seja `nao_se_aplica`), o formulário injeta dinamicamente o time de `"ti"` no array `supportTeams`. Se o time de `"ti"` for desmarcado manualmente com equipamentos ativos, os equipamentos são limpos para `"nao_se_aplica"`.
*   **Campos de Descrição "Outros" Dinâmicos:**
    *   **Móveis e Apoio:** Se a opção `"outro"` for selecionada no array `furnitureSupport`, a descrição escrita `otherFurnitureDescription` passa a ser obrigatória (mínimo de 3 caracteres).
    *   **Copa:** Se a opção `"outro"` for selecionada no array `copa`, a descrição escrita `otherCopaDescription` passa a ser obrigatória (mínimo de 3 caracteres).
*   **Material de Apresentação:**
    *   Se `presentationMaterials` contiver `"google_drive_link"`, a URL de compartilhamento do Drive `presentationDriveLink` é obrigatória e validada sintaticamente.

---

## 3. Tipagem e Regras dos Campos (Dicionário de Dados)

| Campo | Tipo | Validação no Backend | Fluxo | Descrição / Regra |
| :--- | :--- | :--- | :--- | :--- |
| `controlCode` | `string` | Obrigatório | Ambos | Identificador autogerado (`#INT-XXXXXX` ou `#LOC-XXXXXX`). |
| `requesterType` | `string` | Obrigatório | Ambos | Literal `"interno"` ou `"locacao"`. |
| `requesterName` | `string` | Obrigatório | Ambos | Nome do solicitante (mínimo 3 caracteres). |
| `requesterEmail` | `string` | Obrigatório | Ambos | Formato de e-mail. No interno, deve terminar em `@unicesusc.edu.br` e não ter $\ge 3$ números seguidos pré-@. |
| `requesterPhone` | `string` | Obrigatório | Ambos | Telefone (mínimo 10 dígitos). |
| `requesterDepartment` | `string` | Obrigatório no Interno | Interno | Setor/Coordenação (mínimo 2 caracteres). |
| `isPartnerEvent` | `boolean` | Opcional | Interno | Flag indicando se há parceiro externo. |
| `partnerName` | `string` | Condicional | Interno | Obrigatório se `isPartnerEvent` for `true`. |
| `partnerEmail` | `string` | Condicional | Interno | Obrigatório se `isPartnerEvent` for `true` (e-mail válido). |
| `partnerPhone` | `string` | Condicional | Interno | Obrigatório se `isPartnerEvent` for `true` (mínimo 10 dígitos). |
| `partnerInstitution` | `string` | Condicional | Interno | Empresa/Instituição parceira. Obrigatório se `isPartnerEvent` for `true`. |
| `eventTitle` | `string` | Obrigatório no Interno | Interno | Título do evento (mínimo 5 caracteres). |
| `eventType` | `string` | Obrigatório no Interno | Interno | Tipo do evento cadastrado na lista. |
| `eventDescription` | `string` | Obrigatório no Interno | Interno | Resumo geral do evento. |
| `targetAudience` | `array[string]` | Mínimo 1 item | Interno | Lista contendo público-alvo ou `["nao_se_aplica"]`. |
| `estimatedPublic` | `number` | Obrigatório no Interno | Interno | Inteiro estritamente $\ge 1$. |
| `eventDate` | `string` | Obrigatório | Ambos | Formato `YYYY-MM-DD`. Mínimo 15 dias de antecedência. Bloqueia FDS se $\le 15$ dias de antecedência. |
| `startTime` | `string` | Obrigatório | Ambos | Formato `HH:MM`. Limite das 07:30 às 22:30. |
| `endTime` | `string` | Obrigatório | Ambos | Formato `HH:MM`. Limite das 07:30 às 22:30. Deve ser posterior a `startTime`. |
| `selectedRoom` | `string` | Obrigatório | Ambos | ID do espaço cadastrado (ex: `"auditorio"`, `"campus"`). |
| `roomNotes` | `string` | Opcional | Ambos | Observações, pedidos de salas e observações extras. |
| `needsBudget` | `boolean` | Obrigatório no Interno | Interno | Forçado para `true` se `coffeeBreak` for diferente de `"nao_se_aplica"` ou se `hasPrintedArtwork` for `true`. |
| `budgetApprovalFileUrl` | `string` | Condicional | Interno | Obrigatório se `needsBudget` for `true`. Link URL gerado pelo Supabase Storage. |
| `copa` | `array[string]` | Mínimo 1 item | Interno | Lista de utensílios selecionados ou `["nao_se_aplica"]`. |
| `otherCopaDescription` | `string` | Condicional | Interno | Obrigatório (mínimo 3 caracteres) se `"outro"` estiver no array `copa`. |
| `coffeeBreak` | `string` | Obrigatório no Interno | Interno | Identificador do plano de café selecionado (ex: `"padrao_100"`) ou `"nao_se_aplica"`. |
| `coffeeNotes` | `string` | Opcional | Interno | String contendo observações e observações gerais sobre o Coffee Break. |
| `tiEquipment` | `array[string]` | Mínimo 1 item | Interno | Lista de aparelhos solicitados ou `["nao_se_aplica"]`. |
| `furnitureSupport` | `array[string]` | Mínimo 1 item | Interno | Lista de itens de infraestrutura solicitados ou `["nao_se_aplica"]`. |
| `otherFurnitureDescription` | `string` | Condicional | Interno | Obrigatório (mínimo 3 caracteres) se `"outro"` estiver no array `furnitureSupport`. |
| `supportTeams` | `array[string]` | Mínimo 1 item | Ambos | Equipes notificadas (injetado `"ti"` se houver `tiEquipment`). |
| `presentationMaterials` | `array[string]` | Mínimo 1 item | Interno | Lista de itens de projeção ou `["nao_se_aplica"]`. |
| `presentationDriveLink` | `string` | Condicional | Interno | Link do Drive obrigatório e validado se `"google_drive_link"` estiver no array. |
| `needsArtwork` | `boolean` | Obrigatório no Interno | Interno | Se necessita de suporte gráfico da equipe de Marketing. |
| `hasPrintedArtwork` | `boolean` | Opcional | Interno | Indica se a peça é física/impressa (exige orçamento obrigatório). |
| `artworkDescription` | `string` | Condicional | Interno | Descrição detalhada da arte. Obrigatório se `needsArtwork` for `true`. |
