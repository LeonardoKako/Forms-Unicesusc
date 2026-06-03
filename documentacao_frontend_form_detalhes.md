# Documentação do Frontend: Rota `/forms/:id` (Visualização do Apoio)

Esta documentação descreve a implementação da nova rota do frontend `/forms/:id`, destinada a exibir os detalhes completos de um evento aprovado para as equipes de apoio convocadas.

---

## 📋 Visão Geral da Rota

- **Rota no Frontend:** `/forms/:id`
  - Exemplo de acesso: `http://localhost:5173/forms/d4df36ca-04a6-4ab9-a41e-1f6b8b0e77d9`
- **Público-alvo:** Equipes de apoio convocadas (logística, T.I., marketing, copa, etc.) que clicaram no link recebido por e-mail.
- **Propósito:** Mostrar detalhadamente toda a estrutura, logística e necessidades aprovadas para o evento em questão.

---

## 🎨 Design e UI (Semelhança com a `ReviewPage`)

> [!TIP]
> A tela de detalhes do formulário deve ser **muito semelhante** à tela de revisão (`ReviewPage`/`ReviewForm`), pois segue exatamente o mesmo objetivo: exibir de maneira limpa, moderna e segmentada todos os dados do evento.

### Diretrizes de Layout:

- **Mesmo Estilo Visual:** Utilize os mesmos componentes de exibição de campos, blocos de dados, listas e cards da `ReviewPage`.
- **Sem Ações Administrativas:** **Não** exiba os botões de ação ("Aprovar" / "Rejeitar") nem o textarea de justificativa. Trata-se de uma tela exclusivamente informativa e de leitura.
- **Sem Validação de JWT**: Esta rota não utiliza tokens JWT no endereço, apenas o ID puro do evento retornado no banco de dados.

---

## ⚙️ Integração com a API (Backend)

### 1. Chamada de Busca

Ao montar o componente da tela, capture o `id` da rota (ex: usando `useParams()` do `react-router-dom`) e realize a requisição `GET`:

- **Método:** `GET`
- **Rota:** `{{backendUrl}}/events/:id`
- **Exemplo de Requisição:** `GET http://localhost:3000/events/d4df36ca-04a6-4ab9-a41e-1f6b8b0e77d9`

### 2. Resposta de Sucesso (200 OK)

O backend retornará o objeto de evento completo. Use estes dados para alimentar o formulário:

```json
{
  "id": "d4df36ca-04a6-4ab9-a41e-1f6b8b0e77d9",
  "controlCode": "#INT-123456",
  "createdAt": "2026-06-03T15:00:00.000Z",
  "requesterName": "Prof. Roberto Mendes",
  "requesterEmail": "formulario.eventos@unicesusc.edu.br",
  "requesterPhone": "48988352502",
  "requesterDepartment": "Engenharia de Software",
  "eventTitle": "Semana de Inovação e Software",
  "eventType": "palestra",
  "eventDescription": "Evento acadêmico com palestras sobre IA e tecnologia.",
  "targetAudience": ["alunos", "docentes"],
  "estimatedPublic": 150,
  "eventDate": "2026-07-15T00:00:00.000Z",
  "startTime": "09:00",
  "endTime": "18:00",
  "selectedRoom": "auditorio",
  "roomNotes": "Necessário projetor calibrado.",
  "needsBudget": true,
  "copa": ["tacas_padrao", "outro"],
  "otherCopaDescription": "Espátulas extras para bolo",
  "coffeeBreak": "padrao_100",
  "coffeeNotes": "Servir às 10:30",
  "tiEquipment": ["projetor_grande", "notebook"],
  "furnitureSupport": ["mesas_apoio_sala", "cadeiras_cinza"],
  "otherFurnitureDescription": "2 aparadores de vidro",
  "presentationMaterials": ["google_drive_link"],
  "presentationDriveLink": "https://drive.google.com/...",
  "needsArtwork": true,
  "hasPrintedArtwork": true,
  "artworkDescription": "Banner impresso de 2x1m",
  "supportTeams": [
    { "id": "ti", "name": "Tecnologia da Informação" },
    { "id": "marketing", "name": "Marketing" }
  ]
}
```

### 3. Tratamento de Erro (404 Not Found)

Caso o evento tenha sido deletado (por expiração de prazo) ou o ID fornecido esteja incorreto:

- O backend retornará o status HTTP `404` com a seguinte mensagem no JSON:

```json
{
  "success": false,
  "message": "Evento com ID \"...\" não encontrado."
}
```

- **Ação Recomendada:** Exibir uma mensagem em tela amigável (ex: "Evento não encontrado ou cancelado") e oferecer um link para retornar à página principal.
