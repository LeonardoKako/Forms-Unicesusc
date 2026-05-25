import { z } from "zod";

export const eventFormSchema = z.object({
  // Dados do Solicitante
  requesterName: z
    .string()
    .min(3, "O nome do responsável deve conter pelo menos 3 caracteres"),
  requesterEmail: z
    .string()
    .email("Insira um endereço de e-mail válido"),
  requesterPhone: z
    .string()
    .min(10, "Insira um telefone/celular válido"),
  requesterDepartment: z
    .string()
    .optional(),
  requesterType: z.enum(["interno", "locacao"]),

  // Locação
  adminApprovalFile: z.any().optional(),

  // Evento Parceiro (Comunidade Interna)
  isPartnerEvent: z.boolean().optional(),
  partnerName: z.string().optional(),
  partnerEmail: z.string().optional(),
  partnerPhone: z.string().optional(),
  partnerInstitution: z.string().optional(),

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

  // Copa (Imagem 1)
  copa: z
    .array(z.string())
    .min(1, 'Selecione as opções de copa ou marque "Não se aplica"'),

  // Coffee Break (Imagem 1)
  coffeeBreak: z
    .array(z.string())
    .min(1, 'Selecione as opções de coffee break ou marque "Não se aplica"'),

  // Orçamento (Detalhamento Financeiro)
  needsBudget: z.boolean({ required_error: 'Informe se o evento necessita de orçamento' }),
  budgetApprovalFile: z.any().optional(),

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

  // Arte / Comunicação Visual
  needsArtwork: z.boolean({ required_error: 'Informe se deseja arte' }),
  artworkDescription: z.string().optional(),

  // Termos de Uso
  acceptTerms: z
    .boolean()
    .refine((val) => val === true, {
      message: 'Você precisa aceitar os termos de uso do espaço para prosseguir',
    }),
}).superRefine((data, ctx) => {
  // 1. Validação de Orçamento e Arquivo
  if (data.needsBudget) {
    // If we use RHF and a file input, a valid selection is typically a FileList.
    // If it's missing or empty, add an issue.
    if (!data.budgetApprovalFile || data.budgetApprovalFile.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'O envio do Aval da Juliana Vital é obrigatório',
        path: ['budgetApprovalFile'],
      });
    }
  }

  // Validação de Locação
  if (data.requesterType === 'locacao') {
    if (!data.adminApprovalFile || data.adminApprovalFile.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'O envio da confirmação do administrativo é obrigatório',
        path: ['adminApprovalFile'],
      });
    }
  }

  // Validação Comunidade Interna
  if (data.requesterType === 'interno') {
    if (!data.requesterDepartment || data.requesterDepartment.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Informe o setor, coordenação ou curso',
        path: ['requesterDepartment'],
      });
    }

    if (data.isPartnerEvent) {
      if (!data.partnerName || data.partnerName.trim().length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Informe o nome do responsável parceiro',
          path: ['partnerName'],
        });
      }
      if (!data.partnerEmail || !/^\S+@\S+\.\S+$/.test(data.partnerEmail)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Insira um e-mail válido para o parceiro',
          path: ['partnerEmail'],
        });
      }
      if (!data.partnerPhone || data.partnerPhone.trim().length < 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Insira um telefone válido para o parceiro',
          path: ['partnerPhone'],
        });
      }
      if (!data.partnerInstitution || data.partnerInstitution.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Informe a empresa/instituição parceira',
          path: ['partnerInstitution'],
        });
      }
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

      // Bloquear finais de semana se for agendado com menos de 15 dias de antecedência
      // Calculamos a diferença de dias exata entre hoje e a data do evento
      const diffTime = inputDate.getTime() - today.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));
      
      if (diffDays <= 15) {
        const dayOfWeek = inputDate.getDay(); // 0 = Domingo, 6 = Sábado
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Finais de semana só podem ser selecionados com mais de 15 dias de antecedência',
            path: ['eventDate'],
          });
        }
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

  // 4. Validação de Orçamento para Coffee Break
  if (data.coffeeBreak && data.coffeeBreak.length > 0 && !data.coffeeBreak.includes('nao_se_aplica')) {
    if (data.needsBudget === false || data.needsBudget === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'O orçamento é obrigatório ao solicitar itens de Coffee Break',
        path: ['needsBudget'],
      });
    }
  }

  // 5. Validação de Arte
  if (data.needsArtwork) {
    if (!data.artworkDescription || data.artworkDescription.trim().length < 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Descreva a arte desejada (mínimo 5 caracteres)',
        path: ['artworkDescription'],
      });
    }
  }
});

export type EventFormData = z.infer<typeof eventFormSchema>;
