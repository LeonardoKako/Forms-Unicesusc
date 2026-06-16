import { useEffect, useState } from "react";
import { FileCheck, Copy, Check } from "lucide-react";
import { ROOM_OPTIONS, SUPPORT_TEAMS_OPTIONS } from "../mockData";
import { toast } from "react-toastify";

interface SuccessModalProps {
  isOpen: boolean;
  data: any | null;
  onClose: () => void;
  onReset: () => void;
}

export default function SuccessModal({
  isOpen,
  data,
  onClose,
  onReset,
}: SuccessModalProps) {
  const [copied, setCopied] = useState(false);

  // Prevent body scrolling when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !data) return null;

  const roomDetails = ROOM_OPTIONS.find((r) => r.value === data.selectedRoom);
  const roomLabel = roomDetails
    ? `${roomDetails.label} (${roomDetails.location})`
    : data.selectedRoom;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const isLocacao = data.requesterType === "locacao";

  const handleCopyCode = () => {
    navigator.clipboard.writeText(data.controlCode);
    setCopied(true);
    toast.success("Código copiado para a área de transferência!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn'>
      <div className='bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all animate-scaleUp max-h-[90vh] flex flex-col'>
        {/* Modal Header */}
        <div className='p-6 sm:p-8 bg-linear-to-r from-brand to-brand/90 text-white text-center shrink-0'>
          <div className='inline-flex p-3 bg-white/10 rounded-full mb-3.5 animate-pulse'>
            <FileCheck className='h-8 w-8 text-white' />
          </div>
          <h3 className='text-xl sm:text-2xl font-black uppercase tracking-wider'>
            Solicitação Enviada!
          </h3>

          <div className="mt-4 flex flex-col items-center gap-2">
            <span className='text-[10px] uppercase font-extrabold tracking-widest opacity-80'>
              {isLocacao ? "Código de Locação Externa (Público)" : "Código de Evento Interno (Institucional)"}
            </span>
            <div className="flex items-center gap-2">
              <div className={`px-5 py-2.5 font-mono font-black rounded-xl shadow-inner text-base tracking-widest border uppercase flex items-center gap-3 transition-all bg-brand text-white border-brand/30`}>
                <span>{data.controlCode}</span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="hover:scale-110 active:scale-95 transition-all p-1.5 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center"
                  title="Copiar Código"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-300 animate-scaleUp" />
                  ) : (
                    <Copy className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>
            </div>
            <p className='text-[10px] text-white/80 max-w-xs text-center leading-normal mt-0.5 font-medium'>
              O prefixo <strong>{isLocacao ? "LOC (Locação)" : "INT (Interno)"}</strong> indica a categoria da reserva, seguido por 6 números gerados aleatoriamente.
            </p>
          </div>
        </div>

        {/* Modal Body (Scrollable container) */}
        <div className='flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-gray-50/50'>
          {/* AVISO IMPORTANTE DE VALIDAÇÃO DE E-MAIL */}
          <div className="p-5 rounded-2xl border flex flex-col gap-2.5 text-sm leading-relaxed shadow-sm bg-amber-50 border-amber-200 text-amber-800">
            <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-xs">
              <span className="text-base">✉️</span>
              <span>Ação Necessária para Validação!</span>
            </div>
            {isLocacao ? (
              <p className="font-medium text-xs sm:text-[13px]">
                Sua solicitação de locação foi registrada com sucesso. Um e-mail com o link de validação foi enviado para o <strong>verificador responsável</strong>. O processo de reserva continuará somente após a confirmação dele.
              </p>
            ) : (
              <div className="space-y-1.5 font-medium text-xs sm:text-[13px]">
                <p>
                  Enviamos um e-mail de validação para <strong>{data.requesterEmail}</strong>.
                </p>
                <p className="font-black text-red-700 uppercase bg-red-50/50 p-2 rounded-lg border border-red-200/40">
                  ⚠️ Atenção: Você deve abrir o seu e-mail e clicar no link de confirmação para validar sua identidade. A equipe administrativa só receberá sua solicitação após essa validação.
                </p>
              </div>
            )}
          </div>

          {/* SEÇÃO 1: DADOS DO SOLICITANTE */}
          <div className='bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4'>
            <h4 className='text-xs font-black uppercase tracking-wider text-primary border-b border-gray-100 pb-2'>
              👤 Identificação do Solicitante
            </h4>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-xs'>
              <div>
                <span className='font-semibold text-gray-400 block'>Nome</span>
                <span className='font-bold text-gray-800 text-sm'>
                  {data.requesterName}
                </span>
              </div>
              <div>
                <span className='font-semibold text-gray-400 block'>
                  Vínculo
                </span>
                <span className='font-bold text-gray-800 text-sm uppercase tracking-wide'>
                  {isLocacao ? "Locação Externa" : "Comunidade Interna"}
                </span>
              </div>
              <div>
                <span className='font-semibold text-gray-400 block'>
                  E-mail
                </span>
                <span className='font-medium text-gray-700'>
                  {data.requesterEmail}
                </span>
              </div>
              <div>
                <span className='font-semibold text-gray-400 block'>
                  Telefone/Celular
                </span>
                <span className='font-medium text-gray-700'>
                  {data.requesterPhone}
                </span>
              </div>
              {!isLocacao && data.requesterDepartment && (
                <div className='col-span-1 md:col-span-2'>
                  <span className='font-semibold text-gray-400 block'>
                    Setor/Curso/Coordenação
                  </span>
                  <span className='font-semibold text-gray-700'>
                    {data.requesterDepartment}
                  </span>
                </div>
              )}
            </div>

            {/* Evento Parceiro (Apenas Interno) */}
            {!isLocacao && data.isPartnerEvent && (
              <div className='mt-3 bg-amber-50/50 p-4 rounded-xl border border-amber-100 space-y-2 text-xs'>
                <span className='font-bold text-amber-800 block'>
                  🤝 Detalhes do Evento Parceiro
                </span>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                  <div>
                    <span className='font-semibold text-gray-500 block'>
                      Responsável Parceiro
                    </span>
                    <span className='font-bold text-gray-800'>
                      {data.partnerName}
                    </span>
                  </div>
                  <div>
                    <span className='font-semibold text-gray-500 block'>
                      Empresa/Instituição
                    </span>
                    <span className='font-bold text-gray-800'>
                      {data.partnerInstitution}
                    </span>
                  </div>
                  <div>
                    <span className='font-semibold text-gray-500 block'>
                      E-mail Parceiro
                    </span>
                    <span className='font-medium text-gray-700'>
                      {data.partnerEmail}
                    </span>
                  </div>
                  <div>
                    <span className='font-semibold text-gray-500 block'>
                      Telefone Parceiro
                    </span>
                    <span className='font-medium text-gray-700'>
                      {data.partnerPhone}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SEÇÃO 2: DETALHES DO EVENTO (Apenas Interno) */}
          {!isLocacao && (
            <div className='bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4'>
              <h4 className='text-xs font-black uppercase tracking-wider text-primary border-b border-gray-100 pb-2'>
                📝 Detalhes do Evento
              </h4>
              <div className='space-y-3 text-xs'>
                <div>
                  <span className='font-semibold text-gray-400 block'>
                    Título do Evento
                  </span>
                  <span className='font-extrabold text-gray-800 text-sm'>
                    {data.eventTitle}
                  </span>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <span className='font-semibold text-gray-400 block'>
                      Tipo do Evento
                    </span>
                    <span className='font-bold text-gray-700'>
                      {data.eventType}
                    </span>
                  </div>
                  <div>
                    <span className='font-semibold text-gray-400 block'>
                      Público Estimado
                    </span>
                    <span className='font-bold text-gray-700'>
                      {data.estimatedPublic} pessoas
                    </span>
                  </div>
                </div>
                <div>
                  <span className='font-semibold text-gray-400 block'>
                    Resumo e Finalidade
                  </span>
                  <p className='text-gray-700 leading-relaxed font-medium mt-1 whitespace-pre-wrap bg-gray-50 p-3 rounded-xl border border-gray-100'>
                    {data.eventDescription}
                  </p>
                </div>
                <div>
                  <span className='font-semibold text-gray-400 block'>
                    Público Alvo
                  </span>
                  <span className='font-bold text-gray-700'>
                    {data.targetAudience?.join(", ")}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* SEÇÃO 3: DATA, LOCAL E ALIMENTAÇÃO */}
          <div className='bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4'>
            <h4 className='text-xs font-black uppercase tracking-wider text-primary border-b border-gray-100 pb-2'>
              📅 Data, Local & Infraestrutura
            </h4>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-xs'>
              <div>
                <span className='font-semibold text-gray-400 block'>
                  Data da Reserva
                </span>
                <span className='font-bold text-gray-800 text-sm'>
                  {formatDate(data.eventDate)}
                </span>
              </div>
              <div>
                <span className='font-semibold text-gray-400 block'>
                  Horário
                </span>
                <span className='font-bold text-gray-800 text-sm'>
                  {data.startTime} às {data.endTime}
                </span>
              </div>
              <div className='col-span-1 md:col-span-2'>
                <span className='font-semibold text-gray-400 block'>
                  Espaço Solicitado
                </span>
                <span className='font-bold text-gray-800 text-sm'>
                  {roomLabel}
                </span>
              </div>
              {data.roomNotes && (
                <div className='col-span-1 md:col-span-2 bg-gray-50 p-3.5 rounded-xl border border-gray-100 mt-1'>
                  <span className='font-semibold text-gray-500 block mb-0.5'>
                    Observações de Espaço Adicional
                  </span>
                  <p className='text-gray-700 leading-normal font-medium'>
                    {data.roomNotes}
                  </p>
                </div>
              )}
              {!isLocacao && (
                <>
                  <div>
                    <span className='font-semibold text-gray-400 block'>
                      Necessita de Orçamento?
                    </span>
                    <span className='font-bold text-gray-700'>
                      {data.needsBudget ? "Sim, necessita" : "Não necessita"}
                    </span>
                  </div>
                  {data.needsBudget && (
                    <div className='col-span-1 md:col-span-2 bg-red-50/20 p-3 rounded-xl border border-red-100/50 flex justify-between items-center'>
                      <div>
                        <span className='font-semibold text-red-800 block'>
                          Confirmação da Reitoria
                        </span>
                        <span className='text-[10px] text-red-600 font-medium'>
                          Aprovação financeira integrada
                        </span>
                      </div>
                      <span className='font-bold text-green-600 flex items-center text-[11px]'>
                        ✓ Anexado
                      </span>
                    </div>
                  )}
                  <div className='col-span-1 md:col-span-2 border-t border-gray-100 pt-3 grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <span className='font-semibold text-gray-400 block'>
                        Itens de Copa
                      </span>
                      <span className='font-bold text-gray-700'>
                        {data.copa?.join(", ") || "Nenhum"}
                      </span>
                    </div>
                    <div>
                      <span className='font-semibold text-gray-400 block'>
                        Plano de Coffee Break
                      </span>
                      <span className='font-bold text-gray-700 uppercase tracking-wide text-[11px]'>
                        {data.coffeeBreak === "nao_se_aplica" && "Não se aplica"}
                        {data.coffeeBreak === "padrao_100" && "Padrão (Até 100 pessoas)"}
                        {data.coffeeBreak === "padrao_288" && "Padrão (Até 288 pessoas)"}
                        {data.coffeeBreak === "biscoitos_100" && "Biscoitos (Até 100 pessoas)"}
                      </span>
                    </div>
                  </div>
                  {data.coffeeNotes && (
                    <div className='col-span-1 md:col-span-2 bg-gray-50 p-3 rounded-xl border border-gray-100 mt-1'>
                      <span className='font-semibold text-gray-500 block mb-0.5'>
                        Observações de Alimentação
                      </span>
                      <p className='text-gray-700 leading-normal font-medium'>
                        {data.coffeeNotes}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* SEÇÃO 4: LOGÍSTICA E APOIO */}
          <div className='bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4'>
            <h4 className='text-xs font-black uppercase tracking-wider text-primary border-b border-gray-100 pb-2'>
              🛠️ Logística & Apoio
            </h4>
            <div className='space-y-4 text-xs'>
              {!isLocacao && (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <span className='font-semibold text-gray-400 block mb-1'>
                      Equipamentos de T.I.
                    </span>
                    <span className='font-bold text-gray-700'>
                      {data.tiEquipment?.join(", ") || "Nenhum"}
                    </span>
                  </div>
                  <div>
                    <span className='font-semibold text-gray-400 block mb-1'>
                      Móveis e Apoio
                    </span>
                    <span className='font-bold text-gray-700'>
                      {data.furnitureSupport?.join(", ") || "Nenhum"}
                      {data.otherFurnitureDescription &&
                        ` (Outros: ${data.otherFurnitureDescription})`}
                    </span>
                  </div>
                </div>
              )}
              <div className={isLocacao ? "" : "border-t border-gray-100 pt-3"}>
                <span className='font-semibold text-gray-400 block mb-1.5'>
                  Equipes de Apoio Acionadas
                </span>
                <div className='flex flex-wrap gap-1.5'>
                  {data.supportTeams && data.supportTeams.length > 0 ? (
                    data.supportTeams.map((teamId: string) => (
                      <span
                        key={teamId}
                        className='bg-brand/5 border border-brand/10 text-brand text-[10px] font-bold px-2 py-0.5 rounded-md'
                      >
                        {SUPPORT_TEAMS_OPTIONS.find((t) => t.id === teamId)
                          ?.label || teamId}
                      </span>
                    ))
                  ) : (
                    <span className='text-gray-500 font-medium'>Nenhuma</span>
                  )}
                </div>
              </div>

              {!isLocacao && (
                <div className='border-t border-gray-100 pt-3 grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <span className='font-semibold text-gray-400 block'>
                      Apresentação de Slides/Vídeo
                    </span>
                    <span className='font-bold text-gray-700'>
                      {data.presentationMaterials?.join(", ") || "Nenhum"}
                    </span>
                    {data.presentationMaterials?.includes(
                      "google_drive_link",
                    ) &&
                      data.presentationDriveLink && (
                        <a
                          href={data.presentationDriveLink}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-primary hover:underline block mt-1 font-semibold truncate'
                        >
                          🔗 Link do Drive
                        </a>
                      )}
                  </div>
                  <div>
                    <span className='font-semibold text-gray-400 block'>
                      Necessita de Arte do Marketing?
                    </span>
                    <span className='font-bold text-gray-700'>
                      {data.needsArtwork ? "Sim" : "Não"}
                    </span>
                  </div>
                  {data.needsArtwork && data.artworkDescription && (
                    <div className='col-span-1 md:col-span-2 bg-brand/5 p-3 rounded-xl border border-brand/10'>
                      <span className='font-semibold text-brand block mb-1'>
                        Descrição da Arte Solicitada
                      </span>
                      <p className='text-gray-700 leading-normal'>
                        {data.artworkDescription}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer Buttons */}
        <div className='p-6 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row gap-3 justify-end'>
          <button
            type='button'
            onClick={onReset}
            className='w-full sm:w-auto px-6 h-12 bg-primary text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow-md hover:bg-primary/95 active:scale-[0.98] transition-all'
          >
            Nova Solicitação
          </button>
          <button
            type='button'
            onClick={onClose}
            className='w-full sm:w-auto px-6 h-12 border-2 border-gray-200 text-gray-600 font-bold text-xs tracking-wider uppercase rounded-xl hover:border-gray-300 active:scale-[0.98] transition-all'
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
