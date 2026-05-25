import { z } from "zod";

export const eventFormSchema = z.object({
  // Dados do Solicitante
  requesterName: z
    .string()
    .min(3, "O nome do solicitante deve conter pelo menos 3 caracteres"),
  requesterEmail: z
    .string()
    .email("Insira um endereço de e-mail válido institucional"),
  requesterDepartment: z
    .string()
    .min(2, "Informe o setor, coordenação ou instituição externa"),
  requesterType: z.enum(["interno", "externo"]),

  // Detalhes Gerais do Evento
  eventTitle: z
    .string()
    .min(5, "O título do evento deve conter pelo menos 5 caracteres"),
  eventType: z
    .string()
    .min(1, "Selecione o tipo do evento nas opções"),
  eventDescription: z
    .string()
    .min(1, "O resumo e finalidade do evento é obrigatório"),

  // Público Alvo & Pessoas Esperadas (Imagem 1)
  targetAudience: z
    .array(z.string())
    .min(1, 'Selecione pelo menos um público-alvo ou marque "Não se aplica"'),
  estimatedPublic: z
    .preprocess(
      (val) => (val === '' ? undefined : Number(val)),
      z.number({ invalid_type_error: 'Informe um número de participantes esperado' })
        .int('O público estimado deve ser um número inteiro')
        .min(1, 'O público estimado deve ser de pelo menos 1 pessoa')
    ),

  // Copa / Coffee Break (Imagem 1)
  coffeeBreak: z
    .array(z.string())
    .min(1, 'Selecione as opções de copa/coffee break ou marque "Não se aplica"'),

  // Orçamento (Detalhamento Financeiro)
  needsBudget: z.boolean({ required_error: 'Informe se o evento necessita de orçamento' }),
  budgetDescription: z.string().optional(),
  budgetEmail: z.string().optional(),

  // Data e Local
  eventDate: z.string().min(1, 'A data do evento é obrigatória'),
  startTime: z.string().min(1, 'O horário de início é obrigatório'),
  endTime: z.string().min(1, 'O horário de término é obrigatório'),
  selectedRoom: z
    .string({ required_error: 'Selecione a sala ou espaço desejado' })
    .min(1, 'Selecione a sala ou espaço desejado'),

  // Equipamentos de TI (Imagem 2)
  tiEquipment: z
    .array(z.string())
    .min(1, 'Selecione os equipamentos de T.I. ou marque "Não se aplica"'),

  // Móveis e Apoio (Imagem 2)
  furnitureSupport: z
    .array(z.string())
    .min(1, 'Selecione os móveis de apoio ou marque "Não se aplica"'),

  // Equipes de Apoio (Imagem 3)
  supportTeams: z
    .array(z.string())
    .min(1, 'Selecione as equipes de apoio'),

  // Material de Apresentação
  presentationMaterials: z
    .array(z.string())
    .min(1, 'Selecione o material de apresentação ou marque "Não se aplica"'),
  presentationFiles: z.any().optional(),

  // Termos de Uso
  acceptTerms: z
    .boolean()
    .refine((val) => val === true, {
      message: 'Você precisa aceitar os termos de uso do espaço para prosseguir',
    }),
}).superRefine((data, ctx) => {
  // 1. Validação de Orçamento e Descrição
  if (data.needsBudget) {
    if (!data.budgetDescription || data.budgetDescription.trim().length < 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Descreva a necessidade do orçamento (mínimo 5 caracteres)',
        path: ['budgetDescription'],
      });
    }
  }

  // 2. Validação da Data com base no Orçamento e data atual
  if (data.eventDate && data.needsBudget !== undefined) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const inputDate = new Date(data.eventDate + 'T00:00:00');
    
    // Bloquear datas no passado (antes de hoje)
    if (inputDate < today) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'A data do evento não pode ser no passado',
        path: ['eventDate'],
      });
    } else {
      // Prazo com base no orçamento (15 dias ou 7 dias)
      const minDays = data.needsBudget ? 15 : 7;
      
      const targetMinDate = new Date(today);
      targetMinDate.setDate(today.getDate() + minDays);
      
      if (inputDate < targetMinDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: data.needsBudget 
            ? `Com orçamento: prazo mínimo de 15 dias de antecedência (mínimo: ${targetMinDate.toLocaleDateString('pt-BR')})`
            : `Sem orçamento: prazo mínimo de 7 dias de antecedência (mínimo: ${targetMinDate.toLocaleDateString('pt-BR')})`,
          path: ['eventDate'],
        });
      }
    }
  }

  // 3. Validação de Horários (Término posterior ao Início)
  if (data.startTime && data.endTime) {
    const [startHour, startMin] = data.startTime.split(':').map(Number);
    const [endHour, endMin] = data.endTime.split(':').map(Number);
    
    const startTotalMinutes = startHour * 60 + startMin;
    const endTotalMinutes = endHour * 60 + endMin;
    
    if (endTotalMinutes <= startTotalMinutes) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'O horário de término deve ser posterior ao horário de início',
        path: ['endTime'],
      });
    }
  }
});

export type EventFormData = z.infer<typeof eventFormSchema>;
