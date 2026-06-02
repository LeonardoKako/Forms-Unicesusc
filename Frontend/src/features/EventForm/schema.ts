import { z } from "zod";

// ==========================================
// 1. SCHEMA PARA COMUNIDADE INTERNA (COMPLETO)
// ==========================================
export const eventFormSchema = z
  .object({
    requesterName: z
      .string()
      .min(3, "O nome do responsável deve conter pelo menos 3 caracteres"),
    requesterEmail: z.string().email("Insira um endereço de e-mail válido"),
    requesterPhone: z.string().min(10, "Insira um telefone/celular válido"),
    requesterDepartment: z.string().optional(),
    requesterType: z.literal("interno"),

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
    eventType: z.string().min(1, "Selecione o tipo do evento nas opções"),
    eventDescription: z
      .string()
      .min(1, "O resumo e finalidade do evento é obrigatório"),

    // Público Alvo & Pessoas Esperadas
    targetAudience: z
      .array(z.string())
      .min(1, 'Selecione pelo menos um público-alvo ou marque "Não se aplica"'),
    estimatedPublic: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z
        .number({
          invalid_type_error: "Informe um número de participantes esperado",
        })
        .int("O público estimado deve ser um número inteiro")
        .min(1, "O público estimado deve ser de pelo menos 1 pessoa"),
    ),

    // Copa
    copa: z
      .array(z.string())
      .min(1, 'Selecione as opções de copa ou marque "Não se aplica"'),
    otherCopaDescription: z.string().optional(),

    // Coffee Break
    coffeeBreak: z
      .string({ required_error: "Selecione a opção de coffee break" })
      .min(1, "Selecione a opção de coffee break"),
    coffeeNotes: z.string().optional(),

    // Orçamento (Detalhamento Financeiro)
    needsBudget: z.boolean({
      required_error: "Informe se o evento necessita de orçamento",
    }),
    budgetApprovalFileUrl: z.any().optional(),

    // Data e Local
    eventDate: z.string().min(1, "A data do evento é obrigatória"),
    startTime: z.string().min(1, "O horário de início é obrigatório"),
    endTime: z.string().min(1, "O horário de término é obrigatório"),
    selectedRoom: z
      .string({ required_error: "Selecione a sala ou espaço desejado" })
      .min(1, "Selecione a sala ou espaço desejado"),
    roomNotes: z.string().optional(),

    // Equipamentos de TI
    tiEquipment: z
      .array(z.string())
      .min(1, 'Selecione os equipamentos de T.I. ou marque "Não se aplica"'),

    // Móveis e Apoio
    furnitureSupport: z
      .array(z.string())
      .min(1, 'Selecione os móveis de apoio ou marque "Não se aplica"'),
    otherFurnitureDescription: z.string().optional(),

    // Equipes de Apoio
    supportTeams: z.array(z.string()).min(1, "Selecione as equipes de apoio"),

    // Material de Apresentação
    presentationMaterials: z
      .array(z.string())
      .min(1, 'Selecione o material de apresentação ou marque "Não se aplica"'),
    presentationDriveLink: z.string().optional(),

    // Arte / Comunicação Visual
    needsArtwork: z.boolean({ required_error: "Informe se deseja arte" }),
    hasPrintedArtwork: z.boolean().optional(),
    artworkDescription: z.string().optional(),

    // Termos de Uso
    acceptTerms: z.boolean().refine((val) => val === true, {
      message:
        "Você precisa aceitar os termos de uso do espaço para prosseguir",
    }),
  })
  .superRefine((data, ctx) => {
    // Validação de Móveis e Apoio - Campo outro preenchido obrigatório
    if (data.furnitureSupport && data.furnitureSupport.includes("outro")) {
      if (!data.otherFurnitureDescription || data.otherFurnitureDescription.trim().length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Informe os detalhes e quantidades do outro móvel/apoio",
          path: ["otherFurnitureDescription"],
        });
      }
    }

    // Validação de Copa - Campo outro preenchido obrigatório
    if (data.copa && data.copa.includes("outro")) {
      if (!data.otherCopaDescription || data.otherCopaDescription.trim().length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Informe os detalhes e quantidades dos outros itens de copa",
          path: ["otherCopaDescription"],
        });
      }
    }
    
    // Validação de Orçamento e Arquivo
    if (data.needsBudget) {
      if (!data.budgetApprovalFileUrl || data.budgetApprovalFileUrl.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "O envio da confirmação da Reitoria é obrigatório",
          path: ["budgetApprovalFileUrl"],
        });
      }
    }

    // Validação Comunidade Interna (E-mail e Setor)
    if (data.requesterEmail) {
      const parts = data.requesterEmail.split('@');
      const localPart = parts[0] || '';
      const domainPart = parts[1] || '';

      if (domainPart !== 'unicesusc.edu.br') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'O e-mail institucional deve terminar obrigatoriamente com @unicesusc.edu.br',
          path: ['requesterEmail'],
        });
      }

      if (/\d{3}/.test(localPart)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'O e-mail institucional não pode conter 3 ou mais números seguidos antes do @',
          path: ['requesterEmail'],
        });
      }
    }

    if (!data.requesterDepartment || data.requesterDepartment.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Informe o setor, coordenação ou curso",
        path: ["requesterDepartment"],
      });
    }

    if (data.isPartnerEvent) {
      if (!data.partnerName || data.partnerName.trim().length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Informe o nome do responsável parceiro",
          path: ["partnerName"],
        });
      }
      if (!data.partnerEmail || !/^\S+@\S+\.\S+$/.test(data.partnerEmail)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Insira um e-mail válido para o parceiro",
          path: ["partnerEmail"],
        });
      }
      if (!data.partnerPhone || data.partnerPhone.trim().length < 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Insira um telefone válido para o parceiro",
          path: ["partnerPhone"],
        });
      }
      if (!data.partnerInstitution || data.partnerInstitution.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Informe a empresa/instituição parceira",
          path: ["partnerInstitution"],
        });
      }
    }

    // Validação da Data (15 dias de antecedência)
    if (data.eventDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const inputDate = new Date(data.eventDate + "T00:00:00");

      if (inputDate < today) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "A data do evento não pode ser no passado",
          path: ["eventDate"],
        });
      } else {
        const minDays = 15;
        const targetMinDate = new Date(today);
        targetMinDate.setDate(today.getDate() + minDays);

        if (inputDate < targetMinDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Prazo mínimo de 15 dias de antecedência (mínimo a partir de: ${targetMinDate.toLocaleDateString("pt-BR")})`,
            path: ["eventDate"],
          });
        }

        const diffTime = inputDate.getTime() - today.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));

        if (diffDays <= 15) {
          const dayOfWeek = inputDate.getDay();
          if (dayOfWeek === 0 || dayOfWeek === 6) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Finais de semana só podem ser selecionados com mais de 15 dias de antecedência",
              path: ["eventDate"],
            });
          }
        }
      }
    }

    // Validação de Horários
    const timeToMinutes = (timeStr: string) => {
      const [h, m] = timeStr.split(":").map(Number);
      return h * 60 + m;
    };

    const minTimeMinutes = 7 * 60 + 30; // 07:30
    const maxTimeMinutes = 22 * 60 + 30; // 22:30

    if (data.startTime) {
      const startMin = timeToMinutes(data.startTime);
      if (startMin < minTimeMinutes || startMin > maxTimeMinutes) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "O horário de início deve estar entre 07:30 e 22:30",
          path: ["startTime"],
        });
      }
    }

    if (data.endTime) {
      const endMin = timeToMinutes(data.endTime);
      if (endMin < minTimeMinutes || endMin > maxTimeMinutes) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "O horário de término deve estar entre 07:30 e 22:30",
          path: ["endTime"],
        });
      }
    }

    if (data.startTime && data.endTime) {
      const startMin = timeToMinutes(data.startTime);
      const endMin = timeToMinutes(data.endTime);

      if (endMin <= startMin) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "O horário de término deve ser posterior ao horário de início",
          path: ["endTime"],
        });
      }
    }

    // Validação de Orçamento para Coffee Break (quando selecionado um plano que não seja "nao_se_aplica")
    if (data.coffeeBreak && data.coffeeBreak !== "nao_se_aplica") {
      if (data.needsBudget === false || data.needsBudget === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "O orçamento é obrigatório ao solicitar itens de Coffee Break",
          path: ["needsBudget"],
        });
      }
    }

    // Validação de Arte
    if (data.needsArtwork) {
      if (!data.artworkDescription || data.artworkDescription.trim().length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Descreva a arte desejada (mínimo 5 caracteres)",
          path: ["artworkDescription"],
        });
      }

      // Orçamento só é obrigatório se for peça impressa (como banner)
      if (data.hasPrintedArtwork && (data.needsBudget === false || data.needsBudget === undefined)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "O orçamento é obrigatório ao solicitar artes impressas (ex: banner)",
          path: ["needsBudget"],
        });
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Artes impressas exigem que o orçamento seja marcado como 'Sim'",
          path: ["hasPrintedArtwork"],
        });
      }
    }

    // Validação Drive Link
    if (data.presentationMaterials && data.presentationMaterials.includes("google_drive_link")) {
      if (!data.presentationDriveLink || !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/.test(data.presentationDriveLink)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Insira um link de URL válido do Google Drive",
          path: ["presentationDriveLink"],
        });
      }
    }
  });

export type EventFormData = z.infer<typeof eventFormSchema>;

// ==========================================
// 2. SCHEMA PARA LOCAÇÃO EXTERNA (SIMPLIFICADO)
// ==========================================
export const locationFormSchema = z
  .object({
    requesterName: z
      .string()
      .min(3, "O nome do responsável / empresa deve conter pelo menos 3 caracteres"),
    requesterEmail: z.string().email("Insira um endereço de e-mail válido"),
    requesterPhone: z.string().min(10, "Insira um telefone de contato válido"),
    requesterType: z.literal("locacao"),

    // Data e Local
    eventDate: z.string().min(1, "A data do evento é obrigatória"),
    startTime: z.string().min(1, "O horário de início é obrigatório"),
    endTime: z.string().min(1, "O horário de término é obrigatório"),
    selectedRoom: z
      .string({ required_error: "Selecione a sala ou espaço desejado" })
      .min(1, "Selecione a sala ou espaço desejado"),
    roomNotes: z.string().optional(),

    // Equipes de Apoio
    supportTeams: z.array(z.string()).min(1, "Selecione as equipes de apoio"),

    // Termos de Uso
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "Você precisa aceitar os termos de uso do espaço para prosseguir",
    }),
  })
  .superRefine((data, ctx) => {
    // Validação da Data (15 dias de antecedência)
    if (data.eventDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const inputDate = new Date(data.eventDate + "T00:00:00");

      if (inputDate < today) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "A data do evento não pode ser no passado",
          path: ["eventDate"],
        });
      } else {
        const minDays = 15;
        const targetMinDate = new Date(today);
        targetMinDate.setDate(today.getDate() + minDays);

        if (inputDate < targetMinDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Prazo mínimo de 15 dias de antecedência (mínimo a partir de: ${targetMinDate.toLocaleDateString("pt-BR")})`,
            path: ["eventDate"],
          });
        }

        const diffTime = inputDate.getTime() - today.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));

        if (diffDays <= 15) {
          const dayOfWeek = inputDate.getDay();
          if (dayOfWeek === 0 || dayOfWeek === 6) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Finais de semana só podem ser selecionados com mais de 15 dias de antecedência",
              path: ["eventDate"],
            });
          }
        }
      }
    }

    // Validação de Horários
    const timeToMinutes = (timeStr: string) => {
      const [h, m] = timeStr.split(":").map(Number);
      return h * 60 + m;
    };

    const minTimeMinutes = 7 * 60 + 30; // 07:30
    const maxTimeMinutes = 22 * 60 + 30; // 22:30

    if (data.startTime) {
      const startMin = timeToMinutes(data.startTime);
      if (startMin < minTimeMinutes || startMin > maxTimeMinutes) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "O horário de início deve estar entre 07:30 e 22:30",
          path: ["startTime"],
        });
      }
    }

    if (data.endTime) {
      const endMin = timeToMinutes(data.endTime);
      if (endMin < minTimeMinutes || endMin > maxTimeMinutes) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "O horário de término deve estar entre 07:30 e 22:30",
          path: ["endTime"],
        });
      }
    }

    if (data.startTime && data.endTime) {
      const startMin = timeToMinutes(data.startTime);
      const endMin = timeToMinutes(data.endTime);

      if (endMin <= startMin) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "O horário de término deve ser posterior ao horário de início",
          path: ["endTime"],
        });
      }
    }
  });

export type LocationFormData = z.infer<typeof locationFormSchema>;
