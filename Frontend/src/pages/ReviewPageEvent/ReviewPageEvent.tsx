import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Loader2,
  XCircle,
  FileCheck2,
  ArrowLeft,
  Printer,
  Download,
} from "lucide-react";
import { toast } from "react-toastify";
import api from "../../lib/api";

// Importações dos novos componentes modularizados
import RequesterDetailsCard from "./components/RequesterDetailsCard";
import EventDetailsCard from "./components/EventDetailsCard";
import LocationAgendaCard from "./components/LocationAgendaCard";
import FoodFinanceCard from "./components/FoodFinanceCard";
import InfrastructureSupportCard from "./components/InfrastructureSupportCard";
import { ROOM_OPTIONS } from "../FormsPage/EventForm/mockData";

export default function ReviewPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Controle de Rejeição
  const [isRejectMode, setIsRejectMode] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // Feedback pós decisão
  const [decisionDone, setDecisionDone] = useState(false);
  const [decisionMessage, setDecisionMessage] = useState("");

  // Carrega os dados do evento na montagem da tela
  useEffect(() => {
    if (!token) {
      toast.error("Token de revisão administrativo ausente.");
      setLoading(false);
      return;
    }

    const fetchEventDetails = async () => {
      try {
        const response = await api.get(`/events/admin-review`, {
          params: { token },
        });
        setEventData(response.data);
      } catch (err: any) {
        const message = err.response?.data?.message || "";
        if (
          message.includes("decidido") ||
          message.includes("approved") ||
          message.includes("rejected") ||
          message.includes("anteriormente")
        ) {
          setDecisionDone(true);
          setDecisionMessage(
            message || "Este evento já foi avaliado anteriormente.",
          );
        } else {
          toast.error(
            "Erro ao buscar detalhes do evento. Token inválido ou expirado.",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [token]);

  // Função para enviar aprovação ou rejeição
  const handleDecision = async (approved: boolean) => {
    if (!token) return;

    if (!approved && rejectReason.trim().length < 5) {
      toast.warn(
        "Por favor, informe um motivo válido com no mínimo 5 caracteres.",
      );
      return;
    }

    setSubmitting(true);
    try {
      const payload: any = { token, approved };
      if (!approved) {
        payload.reason = rejectReason.trim();
      }

      await api.post(`/events/admin-review`, payload);

      toast.success(
        approved
          ? "Evento aprovado com sucesso!"
          : "Evento rejeitado com sucesso!",
      );
      setDecisionMessage(
        approved
          ? "Este evento foi APROVADO com sucesso!"
          : `Este evento foi REJEITADO. Motivo: ${rejectReason}`,
      );
      setDecisionDone(true);
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          "Ocorreu um erro ao registrar a decisão.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Resolve o rótulo do espaço
  const selectedRoom = eventData?.selectedRoom;
  const roomDetails = ROOM_OPTIONS.find((r) => r.value === selectedRoom);
  const roomLabel = roomDetails
    ? `${roomDetails.label} (${roomDetails.location})`
    : selectedRoom || "Não informado";

  // Gera o PDF (usando window.print nativo com regras de impressão)
  const handlePrint = () => {
    window.print();
  };

  // Exporta todos os dados do evento para uma planilha (CSV formato Excel pt-BR)
  const handleExportCSV = () => {
    if (!eventData) return;

    const formatDate = (dateStr: string) => {
      if (!dateStr) return "";
      const cleanDate = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
      const [year, month, day] = cleanDate.split("-");
      return `${day}/${month}/${year}`;
    };

    const dataToExport = {
      "Código de Controle": eventData.controlCode || "",
      "Tipo de Reserva":
        eventData.requesterType === "locacao"
          ? "Locação Externa"
          : "Comunidade Interna",
      "Nome do Solicitante": eventData.requesterName || "",
      "E-mail do Solicitante": eventData.requesterEmail || "",
      "Telefone do Solicitante": eventData.requesterPhone || "",
      "Setor / Curso / Coordenação":
        eventData.requesterDepartment || "Não se aplica",
      "Evento Parceiro?": eventData.isPartnerEvent ? "Sim" : "Não",
      "Instituição Parceira": eventData.partnerInstitution || "Não se aplica",
      "Responsável Parceiro": eventData.partnerName || "Não se aplica",
      "E-mail do Parceiro": eventData.partnerEmail || "Não se aplica",
      "Telefone do Parceiro": eventData.partnerPhone || "Não se aplica",
      "Título do Evento": eventData.eventTitle || "Não se aplica",
      "Tipo de Evento": eventData.eventType || "Não se aplica",
      "Público Estimado": eventData.estimatedPublic || "Não se aplica",
      "Público-Alvo": Array.isArray(eventData.targetAudience)
        ? eventData.targetAudience.join(", ")
        : eventData.targetAudience || "Não se aplica",
      "Resumo do Evento": (
        eventData.eventDescription || "Não se aplica"
      ).replace(/\n/g, " "),
      "Espaço Reservado": roomLabel,
      "Data do Evento": formatDate(eventData.eventDate),
      "Horário de Início": eventData.startTime || "",
      "Horário de Término": eventData.endTime || "",
      "Observações de Espaço": (eventData.roomNotes || "Nenhuma").replace(
        /\n/g,
        " ",
      ),
      "Necessita Orçamento?": eventData.needsBudget ? "Sim" : "Não",
      "Plano de Coffee Break": eventData.coffeeBreak || "Não se aplica",
      "Observações de Coffee": (eventData.coffeeNotes || "Nenhuma").replace(
        /\n/g,
        " ",
      ),
      "Utensílios de Copa": Array.isArray(eventData.copa)
        ? eventData.copa.join(", ")
        : eventData.copa || "Não se aplica",
      "Outros itens de Copa": eventData.otherCopaDescription || "Não se aplica",
      "Equipamentos de T.I.": Array.isArray(eventData.tiEquipment)
        ? eventData.tiEquipment.join(", ")
        : eventData.tiEquipment || "Não se aplica",
      "Móveis e Apoio": Array.isArray(eventData.furnitureSupport)
        ? eventData.furnitureSupport.join(", ")
        : eventData.furnitureSupport || "Não se aplica",
      "Outros Móveis": eventData.otherFurnitureDescription || "Não se aplica",
      "Materiais de Apresentação": Array.isArray(
        eventData.presentationMaterials,
      )
        ? eventData.presentationMaterials.join(", ")
        : eventData.presentationMaterials || "Não se aplica",
      "Link do Google Drive":
        eventData.presentationDriveLink || "Não se aplica",
      "Solicitou Arte?": eventData.needsArtwork ? "Sim" : "Não",
      "Necessita Impressão?": eventData.hasPrintedArtwork ? "Sim" : "Não",
      "Descrição da Arte": (
        eventData.artworkDescription || "Não se aplica"
      ).replace(/\n/g, " "),
    };

    const headers = Object.keys(dataToExport).join(";");
    const values = Object.values(dataToExport)
      .map((val) => `"${String(val).replace(/"/g, '""')}"`)
      .join(";");

    const csvContent = "\uFEFF" + headers + "\n" + values;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `reserva_${eventData.controlCode || "evento"}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Dados exportados para planilha com sucesso!");
  };

  if (loading) {
    return (
      <div className='max-w-2xl mx-auto my-12 bg-white rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-6 border border-gray-100 shadow-xl'>
        <Loader2 className='h-16 w-16 text-primary animate-spin' />
        <div>
          <h3 className='text-lg font-extrabold text-brand uppercase tracking-wider'>
            Buscando detalhes da reserva
          </h3>
          <p className='text-xs text-gray-400 mt-2 font-medium'>
            Carregando dados logísticos e estruturais do evento...
          </p>
        </div>
      </div>
    );
  }

  if (decisionDone) {
    return (
      <div className='max-w-2xl mx-auto my-12 bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-xl animate-fadeIn'>
        <div className='p-8 bg-brand text-white text-center flex flex-col items-center'>
          <div className='p-3 bg-white/10 rounded-full mb-3'>
            <FileCheck2 className='h-12 w-12 text-white' />
          </div>
          <h3 className='text-xl sm:text-2xl font-black uppercase tracking-wider'>
            Revisão Concluída
          </h3>
          <p className='text-xs text-white/80 mt-1 font-medium'>
            Ação administrativa já executada
          </p>
        </div>

        <div className='p-8 sm:p-10 text-center space-y-6'>
          <div className='bg-gray-50 border border-gray-150 rounded-2xl p-5 text-center font-semibold text-gray-700'>
            <p className='text-sm'>{decisionMessage}</p>
          </div>
          <p className='text-xs text-gray-400 font-medium leading-relaxed'>
            O solicitante e os setores envolvidos foram notificados de forma
            automática por e-mail.
          </p>
          <div className='border-t border-gray-100 pt-6'>
            <button
              onClick={() => navigate("/")}
              className='inline-flex items-center space-x-2 px-6 h-12 bg-brand text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow-md hover:bg-brand/95 active:scale-[0.98] transition-all cursor-pointer'
            >
              <ArrowLeft className='w-4 h-4' />
              <span>Voltar ao Formulário</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className='max-w-2xl mx-auto my-12 bg-white rounded-3xl p-10 text-center border border-gray-100 shadow-xl space-y-6'>
        <XCircle className='h-16 w-16 text-primary mx-auto' />
        <h3 className='text-lg font-extrabold text-brand uppercase tracking-wider'>
          Reserva não Encontrada
        </h3>
        <p className='text-sm text-gray-500 font-medium leading-relaxed'>
          Não foi possível carregar os dados. O token pode estar inválido,
          expirado ou a reserva já foi excluída do sistema.
        </p>
        <button
          onClick={() => navigate("/")}
          className='px-6 h-12 bg-brand text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow-md transition-all cursor-pointer'
        >
          Ir para Página Inicial
        </button>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto my-8 bg-white rounded-3xl border border-gray-150 shadow-2xl overflow-hidden animate-fadeIn print:shadow-none print:my-0 print:border-none'>
      {/* Banner Superior da Revisão */}
      <div className='p-6 sm:p-8 bg-linear-to-r from-brand to-brand/95 text-white shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:bg-none print:text-brand print:border-b print:border-gray-200 print:px-0 print:pt-0'>
        <div>
          <span className='text-[10px] bg-white/10 text-white font-bold px-2.5 py-1 rounded-md uppercase tracking-widest border border-white/10 print:hidden'>
            Painel do Administrador
          </span>
          <h3 className='text-xl sm:text-2xl font-black uppercase tracking-wider mt-2.5 print:mt-0 print:text-brand'>
            Revisão de Reserva
          </h3>
        </div>
        <div className='flex items-center gap-3 print:bg-transparent'>
          <div className='bg-white text-brand px-4 py-2 font-black rounded-xl text-sm tracking-widest uppercase border border-white/20 print:border-gray-300 print:text-gray-700'>
            {eventData.controlCode}
          </div>
        </div>
      </div>

      {/* Barra de Ações Rápidas (PDF / Planilha) */}
      <div className='bg-gray-100/50 border-b border-gray-150 px-6 sm:px-8 py-3.5 flex justify-between items-center print:hidden'>
        <span className='text-xs font-semibold text-gray-500'>
          Ações Rápidas do Documento:
        </span>
        <div className='flex items-center gap-2'>
          <button
            onClick={handleExportCSV}
            className='inline-flex items-center space-x-1.5 px-3.5 py-2 bg-white text-gray-700 hover:text-brand border border-gray-200 hover:border-brand/30 font-bold text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer shadow-xs hover:shadow-sm'
            title='Exportar dados para Excel (.csv)'
          >
            <Download className='w-4 h-4 text-brand' />
            <span className='hidden sm:inline'>Planilha (CSV)</span>
          </button>
          <button
            onClick={handlePrint}
            className='inline-flex items-center space-x-1.5 px-3.5 py-2 bg-brand text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow-md hover:bg-brand/95 active:scale-[0.98] transition-all cursor-pointer'
            title='Imprimir ou Salvar em PDF'
          >
            <Printer className='w-4 h-4' />
            <span>Gerar PDF / Imprimir</span>
          </button>
        </div>
      </div>

      <div className='p-6 sm:p-8 space-y-6 bg-gray-50/30 print:bg-white print:px-0 print:py-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-1'>
          {/* COLUNA ESQUERDA */}
          <div className='space-y-6'>
            <RequesterDetailsCard eventData={eventData} />
            <EventDetailsCard eventData={eventData} />
            <InfrastructureSupportCard eventData={eventData} />
          </div>

          {/* COLUNA DIREITA */}
          <div className='space-y-6'>
            <LocationAgendaCard eventData={eventData} roomLabel={roomLabel} />
            <FoodFinanceCard eventData={eventData} />
          </div>
        </div>

        {/* ÁREA DE AÇÃO DO ADMIN */}
        <div className='bg-white rounded-2xl p-6 border border-gray-150 shadow-md space-y-4 animate-slideDown print:hidden'>
          {!isRejectMode ? (
            <div className='flex flex-col sm:flex-row gap-4 justify-end'>
              <button
                type='button'
                onClick={() => setIsRejectMode(true)}
                disabled={submitting}
                className='w-full sm:w-auto px-8 h-12 border-2 border-red-200 text-red-600 font-bold text-xs tracking-wider uppercase rounded-xl hover:bg-red-50 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center space-x-2'
              >
                <span>Rejeitar Solicitação</span>
              </button>
              <button
                type='button'
                onClick={() => handleDecision(true)}
                disabled={submitting}
                className='w-full sm:w-auto px-8 h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow-md active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center space-x-2'
              >
                {submitting && <Loader2 className='w-4 h-4 animate-spin' />}
                <span>Aprovar Solicitação</span>
              </button>
            </div>
          ) : (
            <div className='space-y-4 animate-fadeIn'>
              <div className='space-y-2'>
                <label className='block text-xs font-bold uppercase tracking-wider text-brand'>
                  Motivo da Rejeição <span className='text-primary'>*</span>
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder='Descreva detalhadamente o motivo do cancelamento / rejeição...'
                  rows={3}
                  className='w-full p-4 rounded-xl border border-gray-200 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all resize-none'
                />
                <span className='text-[10px] text-gray-400 block text-right font-medium'>
                  Mínimo de 5 caracteres. Atual: {rejectReason.trim().length}
                </span>
              </div>

              <div className='flex flex-col sm:flex-row gap-3 justify-end'>
                <button
                  type='button'
                  onClick={() => {
                    setIsRejectMode(false);
                    setRejectReason("");
                  }}
                  disabled={submitting}
                  className='w-full sm:w-auto px-6 h-11 border border-gray-200 text-gray-500 font-semibold text-xs tracking-wider uppercase rounded-xl hover:bg-gray-50 transition-all cursor-pointer'
                >
                  Cancelar
                </button>
                <button
                  type='button'
                  onClick={() => handleDecision(false)}
                  disabled={submitting || rejectReason.trim().length < 5}
                  className='w-full sm:w-auto px-6 h-11 bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow-md active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center space-x-1.5'
                >
                  {submitting && <Loader2 className='w-4 h-4 animate-spin' />}
                  <span>Confirmar Rejeição</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
