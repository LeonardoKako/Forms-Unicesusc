import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Loader2,
  XCircle,
  FileText,
  Calendar,
  Clock,
  MapPin,
  Coffee,
  Users,
  Cpu,
  FileCheck2,
  ArrowLeft,
} from "lucide-react";
import { ROOM_OPTIONS, SUPPORT_TEAMS_OPTIONS } from "../FormsPage/EventForm/mockData";
import { toast } from "react-toastify";
import api from "../../lib/api";

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

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
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

  const roomDetails = ROOM_OPTIONS.find(
    (r) => r.value === eventData.selectedRoom,
  );
  const roomLabel = roomDetails
    ? `${roomDetails.label} (${roomDetails.location})`
    : eventData.selectedRoom;

  return (
    <div className='max-w-4xl mx-auto my-8 bg-white rounded-3xl border border-gray-150 shadow-2xl overflow-hidden animate-fadeIn'>
      {/* Banner Superior da Revisão */}
      <div className='p-6 sm:p-8 bg-linear-to-r from-brand to-brand/95 text-white shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <span className='text-[10px] bg-white/10 text-white font-bold px-2.5 py-1 rounded-md uppercase tracking-widest border border-white/10'>
            Painel do Administrador
          </span>
          <h3 className='text-xl sm:text-2xl font-black uppercase tracking-wider mt-2.5'>
            Revisão de Reserva
          </h3>
        </div>
        <div className='bg-white text-brand px-4 py-2 font-black rounded-xl text-sm tracking-widest uppercase border border-white/20'>
          {eventData.controlCode}
        </div>
      </div>

      <div className='p-6 sm:p-8 space-y-6 bg-gray-50/30'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* COLUNA ESQUERDA: DADOS SOLICITANTE E EVENTO */}
          <div className='space-y-6'>
            {/* Solicitante */}
            <div className='bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-4'>
              <h4 className='text-xs font-black uppercase tracking-wider text-primary border-b border-gray-100 pb-2 flex items-center gap-1.5'>
                <Users className='w-4 h-4' /> Identificação do Solicitante
              </h4>
              <div className='space-y-3 text-xs'>
                <div>
                  <span className='font-semibold text-gray-400 block'>
                    Nome
                  </span>
                  <span className='font-bold text-gray-800 text-sm'>
                    {eventData.requesterName}
                  </span>
                </div>
                <div>
                  <span className='font-semibold text-gray-400 block'>
                    Vínculo
                  </span>
                  <span className='font-bold text-gray-800 uppercase tracking-wide'>
                    {eventData.requesterType === "locacao"
                      ? "Locação Externa"
                      : "Comunidade Interna"}
                  </span>
                </div>
                <div>
                  <span className='font-semibold text-gray-400 block'>
                    E-mail
                  </span>
                  <span className='font-medium text-gray-700'>
                    {eventData.requesterEmail}
                  </span>
                </div>
                <div>
                  <span className='font-semibold text-gray-400 block'>
                    Telefone/Celular
                  </span>
                  <span className='font-medium text-gray-700'>
                    {eventData.requesterPhone}
                  </span>
                </div>
                {eventData.requesterDepartment && (
                  <div>
                    <span className='font-semibold text-gray-400 block'>
                      Setor/Curso/Coordenação
                    </span>
                    <span className='font-semibold text-gray-700'>
                      {eventData.requesterDepartment}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Detalhes do Evento */}
            {eventData.requesterType === "interno" && (
              <div className='bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-4'>
                <h4 className='text-xs font-black uppercase tracking-wider text-primary border-b border-gray-100 pb-2 flex items-center gap-1.5'>
                  <FileText className='w-4 h-4' /> Detalhes do Evento
                </h4>
                <div className='space-y-3 text-xs'>
                  <div>
                    <span className='font-semibold text-gray-400 block'>
                      Título do Evento
                    </span>
                    <span className='font-extrabold text-gray-800 text-sm'>
                      {eventData.eventTitle}
                    </span>
                  </div>
                  <div className='grid grid-cols-2 gap-2'>
                    <div>
                      <span className='font-semibold text-gray-400 block'>
                        Tipo
                      </span>
                      <span className='font-bold text-gray-700'>
                        {eventData.eventType}
                      </span>
                    </div>
                    <div>
                      <span className='font-semibold text-gray-400 block'>
                        Público Estimado
                      </span>
                      <span className='font-bold text-gray-700'>
                        {eventData.estimatedPublic} pessoas
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className='font-semibold text-gray-400 block mb-1'>
                      Resumo e Finalidade
                    </span>
                    <p className='text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100 leading-relaxed font-medium'>
                      {eventData.eventDescription}
                    </p>
                  </div>
                  {eventData.targetAudience && (
                    <div>
                      <span className='font-semibold text-gray-400 block'>
                        Público Alvo
                      </span>
                      <span className='font-bold text-gray-700'>
                        {Array.isArray(eventData.targetAudience)
                          ? eventData.targetAudience.map((val: any) => typeof val === "object" && val !== null ? val.name || val.id : val).join(", ")
                          : eventData.targetAudience}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* COLUNA DIREITA: LOCAL, COPA, LOGÍSTICA E APOIO */}
          <div className='space-y-6'>
            {/* Espaço e Agenda */}
            <div className='bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-4'>
              <h4 className='text-xs font-black uppercase tracking-wider text-primary border-b border-gray-100 pb-2 flex items-center gap-1.5'>
                <Calendar className='w-4 h-4' /> Local & Agenda
              </h4>
              <div className='space-y-3 text-xs'>
                <div className='flex items-center space-x-2.5'>
                  <MapPin className='w-4 h-4 text-brand/70' />
                  <div>
                    <span className='font-semibold text-gray-400 block text-[10px]'>
                      Espaço
                    </span>
                    <span className='font-bold text-gray-800'>{roomLabel}</span>
                  </div>
                </div>
                <div className='flex items-center space-x-2.5'>
                  <Clock className='w-4 h-4 text-brand/70' />
                  <div>
                    <span className='font-semibold text-gray-400 block text-[10px]'>
                      Data e Horário
                    </span>
                    <span className='font-bold text-gray-800'>
                      {formatDate(eventData.eventDate)} | {eventData.startTime}{" "}
                      às {eventData.endTime}
                    </span>
                  </div>
                </div>
                {eventData.roomNotes && (
                  <div className='bg-gray-50 p-3 rounded-xl border border-gray-100 mt-2'>
                    <span className='font-semibold text-gray-500 block mb-0.5 text-[10px]'>
                      Espaços extras / Observações
                    </span>
                    <p className='text-gray-600 font-medium leading-normal'>
                      {eventData.roomNotes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Alimentação e Orçamento */}
            {eventData.requesterType === "interno" && (
              <div className='bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-4'>
                <h4 className='text-xs font-black uppercase tracking-wider text-primary border-b border-gray-100 pb-2 flex items-center gap-1.5'>
                  <Coffee className='w-4 h-4' /> Alimentação & Finanças
                </h4>
                <div className='space-y-3 text-xs'>
                  <div>
                    <span className='font-semibold text-gray-400 block'>
                      Plano de Coffee Break
                    </span>
                    <span className='font-extrabold text-brand uppercase tracking-wider text-[11px]'>
                      {eventData.coffeeBreak === "nao_se_aplica" &&
                        "Não se aplica"}
                      {eventData.coffeeBreak === "padrao_100" &&
                        "Padrão (Até 100 pessoas)"}
                      {eventData.coffeeBreak === "padrao_288" &&
                        "Padrão (Até 288 pessoas)"}
                      {eventData.coffeeBreak === "biscoitos_100" &&
                        "Biscoitos (Até 100 pessoas)"}
                    </span>
                  </div>
                  {eventData.coffeeNotes && (
                    <div className='bg-gray-50 p-2.5 rounded-lg border border-gray-100 font-medium text-gray-600'>
                      {eventData.coffeeNotes}
                    </div>
                  )}
                  <div className='border-t border-gray-100 pt-2.5 grid grid-cols-2 gap-2'>
                    <div>
                      <span className='font-semibold text-gray-400 block'>
                        Utensílios Copa
                      </span>
                      <span className='font-bold text-gray-700'>
                        {eventData.copa?.join(", ") || "Nenhum"}
                      </span>
                      {eventData.otherCopaDescription && (
                        <span className='text-[10px] text-gray-400 block mt-0.5'>
                          Outro: {eventData.otherCopaDescription}
                        </span>
                      )}
                    </div>
                    <div>
                      <span className='font-semibold text-gray-400 block'>
                        Exige Orçamento?
                      </span>
                      <span className='font-bold text-gray-700'>
                        {eventData.needsBudget ? "Sim" : "Não"}
                      </span>
                    </div>
                  </div>
                  {eventData.needsBudget && eventData.budgetApprovalFileUrl && (
                    <div className='mt-2'>
                      <a
                        href={eventData.budgetApprovalFileUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex items-center space-x-1.5 text-xs text-primary font-bold hover:underline'
                      >
                        <span>📄 Visualizar Confirmação da Reitoria</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Equipamentos e Equipes */}
            <div className='bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-4'>
              <h4 className='text-xs font-black uppercase tracking-wider text-primary border-b border-gray-100 pb-2 flex items-center gap-1.5'>
                <Cpu className='w-4 h-4' /> Equipamentos & Apoio
              </h4>
              <div className='space-y-3.5 text-xs'>
                {eventData.requesterType === "interno" && (
                  <>
                    <div>
                      <span className='font-semibold text-gray-400 block mb-1'>
                        Equipamentos de T.I.
                      </span>
                      <span className='font-bold text-gray-700'>
                        {eventData.tiEquipment?.join(", ") || "Nenhum"}
                      </span>
                    </div>
                    <div>
                      <span className='font-semibold text-gray-400 block mb-1'>
                        Móveis e Apoio
                      </span>
                      <span className='font-bold text-gray-700'>
                        {eventData.furnitureSupport?.join(", ") || "Nenhum"}
                        {eventData.otherFurnitureDescription &&
                          ` (Outros: ${eventData.otherFurnitureDescription})`}
                      </span>
                    </div>
                  </>
                )}
                <div>
                  <span className='font-semibold text-gray-400 block mb-2'>
                    Equipes de Apoio Acionadas
                  </span>
                  <div className='flex flex-wrap gap-1'>
                    {eventData.supportTeams?.map((team: any, index: number) => {
                      const teamId = typeof team === "object" && team !== null ? team.id : team;
                      const teamLabel = typeof team === "object" && team !== null ? team.name || team.id : team;
                      const resolvedLabel = SUPPORT_TEAMS_OPTIONS.find((t) => t.id === teamId)?.label || teamLabel;
                      return (
                        <span
                          key={teamId ? `${teamId}-${index}` : index}
                          className='bg-brand/5 border border-brand/10 text-brand text-[9px] font-bold px-2 py-0.5 rounded-md'
                        >
                          {resolvedLabel}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ÁREA DE AÇÃO DO ADMIN */}
        <div className='bg-white rounded-2xl p-6 border border-gray-150 shadow-md space-y-4 animate-slideDown'>
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
