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

// Importações dos mesmos componentes modularizados da ReviewPageEvent
import RequesterDetailsCard from "../ReviewPageEvent/components/RequesterDetailsCard";
import LocationAgendaCard from "../ReviewPageEvent/components/LocationAgendaCard";
import InfrastructureSupportCard from "../ReviewPageEvent/components/InfrastructureSupportCard";
import { ROOM_OPTIONS } from "../FormsPage/EventForm/mockData";

export default function ReviewPageLocation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [locationData, setLocationData] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Controle de Rejeição
  const [isRejectMode, setIsRejectMode] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // Feedback pós decisão
  const [decisionDone, setDecisionDone] = useState(false);
  const [decisionMessage, setDecisionMessage] = useState("");

  // Carrega os dados da locação na montagem da tela
  useEffect(() => {
    if (!token) {
      toast.error("Token de revisão administrativo ausente.");
      setLoading(false);
      return;
    }

    const fetchLocationDetails = async () => {
      try {
        const response = await api.get(`/locations/admin-review`, {
          params: { token },
        });
        setLocationData(response.data);
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
            message || "Esta locação já foi avaliada anteriormente.",
          );
        } else {
          toast.error(
            "Erro ao buscar detalhes da locação. Token inválido ou expirado.",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLocationDetails();
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

      await api.post(`/locations/admin-review`, payload);

      toast.success(
        approved
          ? "Locação aprovada com sucesso!"
          : "Locação rejeitada com sucesso!",
      );
      setDecisionMessage(
        approved
          ? "Esta locação foi APROVADA com sucesso!"
          : `Esta locação foi REJEITADA. Motivo: ${rejectReason}`,
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
  const selectedRoom = locationData?.selectedRoom;
  const roomDetails = ROOM_OPTIONS.find((r) => r.value === selectedRoom);
  const roomLabel = roomDetails
    ? `${roomDetails.label} (${roomDetails.location})`
    : selectedRoom || "Não informado";

  // Gera o PDF
  const handlePrint = () => {
    window.print();
  };

  // Exporta os dados da locação externa para CSV
  const handleExportCSV = () => {
    if (!locationData) return;

    const formatDate = (dateStr: string) => {
      if (!dateStr) return "";
      const cleanDate = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
      const [year, month, day] = cleanDate.split("-");
      return `${day}/${month}/${year}`;
    };

    const dataToExport = {
      "Código de Controle": locationData.controlCode || "",
      "Tipo de Reserva": "Locação Externa",
      "Nome do Responsável / Empresa": locationData.requesterName || "",
      "E-mail do Solicitante": locationData.requesterEmail || "",
      "Telefone do Solicitante": locationData.requesterPhone || "",
      "Espaço Reservado": roomLabel,
      "Data do Evento": formatDate(locationData.eventDate),
      "Horário de Início": locationData.startTime || "",
      "Horário de Término": locationData.endTime || "",
      "Observações de Espaço": (locationData.roomNotes || "Nenhuma").replace(
        /\n/g,
        " ",
      ),
      "Equipes de Apoio": Array.isArray(locationData.supportTeams)
        ? locationData.supportTeams.map((t: any) => typeof t === "object" && t !== null ? t.name || t.id : t).join(", ")
        : locationData.supportTeams || "Nenhuma",
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
      `locacao_${locationData.controlCode || "externa"}.csv`,
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
            Buscando detalhes da locação
          </h3>
          <p className='text-xs text-gray-400 mt-2 font-medium'>
            Carregando dados estruturais da locação externa...
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

  if (!locationData) {
    return (
      <div className='max-w-2xl mx-auto my-12 bg-white rounded-3xl p-10 text-center border border-gray-100 shadow-xl space-y-6'>
        <XCircle className='h-16 w-16 text-primary mx-auto' />
        <h3 className='text-lg font-extrabold text-brand uppercase tracking-wider'>
          Locação não Encontrada
        </h3>
        <p className='text-sm text-gray-500 font-medium leading-relaxed'>
          Não foi possível carregar os dados. O token pode estar inválido,
          expirado ou a locação já foi excluída do sistema.
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
            Revisão de Locação Externa
          </h3>
        </div>
        <div className='flex items-center gap-3 print:bg-transparent'>
          <div className='bg-white text-brand px-4 py-2 font-black rounded-xl text-sm tracking-widest uppercase border border-white/20 print:border-gray-300 print:text-gray-700'>
            {locationData.controlCode}
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
            <RequesterDetailsCard eventData={locationData} />
            <InfrastructureSupportCard eventData={locationData} />
          </div>

          {/* COLUNA DIREITA */}
          <div className='space-y-6'>
            <LocationAgendaCard eventData={locationData} roomLabel={roomLabel} />
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
                <span>Rejeitar Locação</span>
              </button>
              <button
                type='button'
                onClick={() => handleDecision(true)}
                disabled={submitting}
                className='w-full sm:w-auto px-8 h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow-md active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center space-x-2'
              >
                {submitting && <Loader2 className='w-4 h-4 animate-spin' />}
                <span>Aprovar Locação</span>
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
                  placeholder='Descreva detalhadamente o motivo do cancelamento / rejeição da locação...'
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
