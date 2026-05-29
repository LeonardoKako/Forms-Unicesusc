# Integração do Backend: Especificação de Payloads e Regras de Negócio

Este guia detalha a estrutura de objetos JSON gerados pelo Frontend para cada fluxo do formulário de reservas de espaço da **Unicesusc**, acompanhado das regras de validação cruzada aplicadas.

---

## 1. Fluxo: Locação Externa (Simplificado)

Este formulário destina-se a parceiros e entidades externas para aluguel de espaços do campus. As regras de negócio são mínimas e simplificadas, não envolvendo serviços internos da instituição.

### Payload JSON de Envio (`POST /api/locations` ou similar)

```json
{
  "controlCode": "#LOC-506999",
  "requesterType": "locacao",
  "requesterName": "ACME Corporation Ltda",
  "requesterEmail": "financeiro@acme.com",
  "requesterPhone": "48988352502",
  "eventDate": "2026-06-17",
  "startTime": "09:30",
  "endTime": "10:30",
  "selectedRoom": "campus",
  "roomNotes": "Precisamos de energia trifásica e acesso próximo para descarga de materiais.",
  "supportTeams": ["marketing", "administrativo", "comercial", "reitoria"]
}
```

### Regras de Negócio e Validação (Locação Externa)

*   **Identificação:** Os campos `requesterName`, `requesterEmail` e `requesterPhone` são **obrigatórios**.
*   **Regra de E-mail:** Diferente do fluxo interno, o e-mail não exige o domínio da instituição e aceita qualquer e-mail corporativo válido.
*   **Período Mínimo de Antecedência:** A reserva deve possuir no mínimo **15 dias de antecedência** com base no dia atual do envio.
*   **Restrição de Finais de Semana:** Finais de semana (sábado/domingo) só podem ser agendados se o período de antecedência do evento for **maior que 15 dias**. Caso o agendamento seja feito em menos tempo, os finais de semana ficam bloqueados no calendário.
*   **Janela de Horário Permitido:** Os horários `startTime` e `endTime` são obrigatórios e devem estar estritamente contidos entre **07:30 e 22:30**. O horário de término deve ser posterior ao início.
*   **Apoio Institucional:** O array `supportTeams` é obrigatório e deve conter ao menos os setores responsáveis.

---

## 2. Fluxo: Comunidade Interna (Completo)

Formulário completo utilizado por docentes, coordenadores e setores acadêmicos. Contém regras de orçamento cruzadas e dependências de serviços e logística.

### Payload JSON de Envio (`POST /api/events` ou similar)

```json
{
  "controlCode": "#INT-306437",
  "requesterType": "interno",
  "requesterName": "Prof. Dr. Leonardo Silva",
  "requesterEmail": "leonardo.silva@unicesusc.edu.br",
  "requesterPhone": "48988352502",
  "requesterDepartment": "Coordenação de Engenharia",
  "isPartnerEvent": true,
  "partnerName": "Maria Souza",
  "partnerEmail": "maria@empresa.com.br",
  "partnerPhone": "48988352502",
  "partnerInstitution": "Tech Solutions Ltda",
  "eventTitle": "Semana Acadêmica de Computação",
  "eventType": "palestra",
  "eventDescription": "Ciclo de palestras acadêmicas sobre IA e computação em nuvem.",
  "targetAudience": ["alunos"],
  "estimatedPublic": 120,
  "eventDate": "2026-06-20",
  "startTime": "09:30",
  "endTime": "10:30",
  "selectedRoom": "campus",
  "roomNotes": "Previsão de credenciamento no hall de entrada.",
  "needsBudget": true,
  "budgetApprovalFileUrl": "https://kgdmqgzhfgnndbxtcqdq.supabase.co/storage/v1/object/public/comprovantes/orcamentos/xyz-123.pdf",
  "copa": ["jarra_2_unidades", "espatula_bolo", "guardanapo"],
  "coffeeBreak": ["salgadinhos", "biscoito_maizena"],
  "tiEquipment": ["nao_se_aplica"],
  "furnitureSupport": ["toalhas", "mobiliario_frente_palco", "barra_divisao"],
  "otherFurnitureDescription": "",
  "supportTeams": ["marketing", "administrativo", "ti", "comercial", "manutencao"],
  "presentationMaterials": ["pen_drive"],
  "presentationDriveLink": "",
  "needsArtwork": true,
  "hasPrintedArtwork": true,
  "artworkDescription": "Banner impresso 2x1m para fachada do evento."
}
```

### Regras de Negócio e Validação (Comunidade Interna)

*   **Validação de E-mail Institucional:**
    *   Deve terminar estritamente com **`@unicesusc.edu.br`**.
    *   **Não pode** conter 3 ou mais números sequenciais seguidos antes do `@` (Ex: `apoio03.ti@...` é permitido, mas `apoio123@...` é bloqueado).
*   **Setor/Departamento:** `requesterDepartment` é obrigatório para identificação do fluxo de cobranças e responsabilidades.
*   **Evento Parceiro:** Caso `isPartnerEvent` seja `true`, os dados do parceiro externo (`partnerName`, `partnerEmail`, `partnerPhone`, `partnerInstitution`) tornam-se **obrigatórios**.
*   **Barreiras de Orçamento Financeiro (Validação Cruzada):**
    *   Se for selecionado qualquer item de **Coffee Break** (que não seja `nao_se_aplica`), o campo `needsBudget` é forçado automaticamente para `true`.
    *   Se `needsArtwork` (Arte) for `true` **E** `hasPrintedArtwork` (Arte Impressa/Banner) for selecionado como `true`, o orçamento `needsBudget` também é forçado para `true`.
    *   Se `needsBudget` for `true`, o envio do documento de confirmação da Reitoria (`budgetApprovalFileUrl` carregado no Supabase Storage) torna-se **estritamente obrigatório**.
*   **Logística e TI Reativos:**
    *   Se o usuário marcar qualquer Equipamento de T.I. (`tiEquipment` que não seja `nao_se_aplica`), o formulário injeta dinamicamente o time de `"ti"` no array `supportTeams`.
*   **Outros Móveis/Apoio:**
    *   Se a opção `outro` for selecionada no checkbox de **Móveis e Apoio**, a descrição escrita `otherFurnitureDescription` passa a ser obrigatória (mínimo de 3 caracteres).
*   **Material de Apresentação:**
    *   Se `presentationMaterials` contiver `"google_drive_link"`, a URL de compartilhamento do Drive `presentationDriveLink` é obrigatória e deve ser um link válido.

---

## 3. Tipagem e Regras dos Campos (Dicionário de Dados)

| Campo | Tipo | Opcional/Obrigatorio | Fluxo | Observação |
| :--- | :--- | :--- | :--- | :--- |
| `controlCode` | `string` | Obrigatório | Ambos | Identificador autogerado (`#INT-XXXXXX` ou `#LOC-XXXXXX`). |
| `requesterType` | `literal` | Obrigatório | Ambos | `"interno"` ou `"locacao"`. |
| `requesterName` | `string` | Obrigatório | Ambos | Nome do solicitante principal ou empresa. |
| `requesterEmail` | `string` | Obrigatório | Ambos | Regras de validação do domínio aplicadas apenas no fluxo interno. |
| `requesterPhone` | `string` | Obrigatório | Ambos | Telefone DDD e número (mínimo 10 dígitos). |
| `requesterDepartment` | `string` | Obrigatório no Interno | Interno | Setor/Curso solicitante. |
| `isPartnerEvent` | `boolean` | Opcional | Interno | Habilita dados do parceiro se marcado. |
| `eventTitle` | `string` | Obrigatório no Interno | Interno | Título do evento (mínimo 5 caracteres). |
| `eventType` | `string` | Obrigatório no Interno | Interno | Tipo selecionado em lista. |
| `eventDescription` | `string` | Obrigatório no Interno | Interno | Resumo geral do evento. |
| `estimatedPublic` | `number` | Obrigatório no Interno | Interno | Público esperado (inteiro positivo). |
| `eventDate` | `string` | Obrigatório | Ambos | Formato `YYYY-MM-DD`. Mínimo 15 dias de antecedência. |
| `startTime` | `string` | Obrigatório | Ambos | Formato `HH:MM`. Limite: 07:30 às 22:30. |
| `endTime` | `string` | Obrigatório | Ambos | Formato `HH:MM`. Deve ser maior que `startTime`. |
| `selectedRoom` | `string` | Obrigatório | Ambos | ID do espaço cadastrado (ex: `"auditorio"`, `"campus"`). |
| `roomNotes` | `string` | Opcional | Ambos | Observações e solicitações de salas de apoio extras. |
| `needsBudget` | `boolean` | Obrigatório no Interno | Interno | Regras automáticas se houver coffee break ou banner impresso. |
| `budgetApprovalFileUrl` | `string` | Condicional (Interno) | Interno | URL gerada pelo Supabase Storage pós-upload de PDF/Imagens. |
| `copa` | `array[string]` | Obrigatório no Interno | Interno | Itens de copa ou `["nao_se_aplica"]`. |
| `coffeeBreak` | `array[string]` | Obrigatório no Interno | Interno | Itens de alimentação ou `["nao_se_aplica"]`. |
| `tiEquipment` | `array[string]` | Obrigatório no Interno | Interno | Itens de T.I. ou `["nao_se_aplica"]`. |
| `furnitureSupport` | `array[string]` | Obrigatório no Interno | Interno | Itens de infraestrutura ou `["nao_se_aplica"]`. |
| `otherFurnitureDescription` | `string` | Condicional (Interno) | Interno | Obrigatório se `outro` for marcado in `furnitureSupport`. |
| `supportTeams` | `array[string]` | Obrigatório | Ambos | Setores notificados de suporte. |
| `presentationMaterials` | `array[string]` | Obrigatório no Interno | Interno | Itens de apresentação ou `["nao_se_aplica"]`. |
| `presentationDriveLink` | `string` | Condicional (Interno) | Interno | URL do drive obrigatória se `"google_drive_link"` estiver marcado. |
| `needsArtwork` | `boolean` | Obrigatório no Interno | Interno | Indica se deseja arte gráfica do marketing. |
| `hasPrintedArtwork` | `boolean` | Opcional | Interno | Indica se a arte gráfica demandará orçamento de impressão física. |
| `artworkDescription` | `string` | Condicional (Interno) | Interno | Obrigatório se `needsArtwork` for `true`. |
