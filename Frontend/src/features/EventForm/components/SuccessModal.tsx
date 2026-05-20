import { CheckCircle2 } from "lucide-react";
import { ROOM_OPTIONS, TI_EQUIPMENT_OPTIONS } from "../mockData";
import { EventFormData } from "../schema";

interface SuccessModalProps {
  isOpen: boolean;
  data: EventFormData | null;
  onClose: () => void;
  onReset: () => void;
}

export default function SuccessModal({
  isOpen,
  data,
  onClose,
  onReset,
}: SuccessModalProps) {
  if (!isOpen || !data) return null;

  // Helper local to format short dates
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  // Find dynamic descriptive room string
  const roomLabel =
    ROOM_OPTIONS.find((r) => r.value === data.selectedRoom)?.label ||
    data.selectedRoom;

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn'>
      <div className='relative bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-100 animate-scaleUp'>
        {/* Decorative Top Accent Bar */}
        <div className='h-2 bg-brand w-full'></div>

        {/* Modal Body */}
        <div className='p-8 text-center'>
          {/* Green Check Icon with Ring effect */}
          <div className='mx-auto h-16 w-16 rounded-full bg-green-50 flex items-center justify-center text-green-500 mb-5 shadow-inner'>
            <CheckCircle2 className='h-10 w-10' />
          </div>

          <h3 className='text-2xl font-extrabold text-brand uppercase tracking-wide'>
            Solicitação Recebida!
          </h3>
          <p className='text-sm text-gray-500 mt-2 max-w-sm mx-auto leading-relaxed'>
            O formulário de agendamento de espaço foi processado e validado com
            sucesso pelo front-end!
          </p>

          {/* Aggregated Info Card Box */}
          <div className='bg-gray-50/80 rounded-2xl p-5 text-left text-xs text-gray-600 mt-6 space-y-3.5 border border-gray-100'>
            {/* Header: Control code */}
            <div className='flex justify-between items-center pb-2 border-b border-gray-200/50'>
              <span className='font-semibold text-gray-400'>
                Código de Controle
              </span>
              <span className='font-extrabold text-brand tracking-wider uppercase'>
                #{Math.floor(100000 + Math.random() * 900000)}
              </span>
            </div>

            {/* Row 1: Event Title */}
            <div>
              <span className='font-semibold text-gray-400 block mb-0.5'>
                Evento
              </span>
              <span className='font-extrabold text-gray-800 text-sm leading-tight block'>
                {data.eventTitle}
              </span>
            </div>

            {/* Row 2: Requester Name & Type */}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <span className='font-semibold text-gray-400 block mb-0.5'>
                  Responsável
                </span>
                <span className='font-bold text-gray-700 block truncate'>
                  {data.requesterName}
                </span>
              </div>
              <div>
                <span className='font-semibold text-gray-400 block mb-0.5'>
                  Vínculo
                </span>
                <span className='font-bold text-primary uppercase block tracking-wider'>
                  {data.requesterType}
                </span>
              </div>
            </div>

            {/* Row 3: Date & Hours */}
            <div className='grid grid-cols-2 gap-4 pt-2 border-t border-gray-200/50'>
              <div>
                <span className='font-semibold text-gray-400 block mb-0.5'>
                  Data da Reserva
                </span>
                <span className='font-bold text-gray-700 block'>
                  {formatDate(data.eventDate)}
                </span>
              </div>
              <div>
                <span className='font-semibold text-gray-400 block mb-0.5'>
                  Horário
                </span>
                <span className='font-bold text-gray-700 block'>
                  {data.startTime} às {data.endTime}
                </span>
              </div>
            </div>

            {/* Row 4: Room Location */}
            <div className='pt-2 border-t border-gray-200/50'>
              <span className='font-semibold text-gray-400 block mb-0.5'>
                Local
              </span>
              <span className='font-bold text-gray-800 block'>{roomLabel}</span>
            </div>

            {/* Row 5: Budget Requirements (Condicional) */}
            {data.needsBudget && (
              <div className='pt-2 border-t border-gray-200/50 space-y-1 bg-red-50/10 p-2.5 rounded-lg border border-primary/10'>
                <div className="flex justify-between items-center text-[9px]">
                  <span className='font-bold text-primary uppercase tracking-wider'>
                    Orçamento Solicitado
                  </span>
                  <span className='font-semibold text-gray-500'>
                    Notificado: {data.budgetEmail || "financeiro@unicesusc.edu.br"}
                  </span>
                </div>
                <p className='font-semibold text-gray-700 mt-0.5 leading-relaxed'>
                  {data.budgetDescription}
                </p>
              </div>
            )}

            {/* Row 6: IT Equipment resources badges */}
            {data.tiEquipment && data.tiEquipment.length > 0 && !data.tiEquipment.includes('nao_se_aplica') && (
              <div className='pt-2 border-t border-gray-200/50'>
                <span className='font-semibold text-gray-400 block mb-1'>
                  Equipamentos Solicitados
                </span>
                <div className='flex flex-wrap gap-1.5'>
                  {data.tiEquipment.map((id: string) => (
                    <span
                      key={id}
                      className='bg-brand/5 border border-brand/10 text-brand text-[10px] font-bold px-2 py-0.5 rounded-md'
                    >
                      {TI_EQUIPMENT_OPTIONS.find((opt) => opt.id === id)?.label || id}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer Buttons */}
          <div className='mt-8 flex flex-col sm:flex-row gap-3 justify-center'>
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
              className='w-full sm:w-auto px-6 h-12 border-2 border-gray-200 text-gray-600 font-bold text-xs tracking-wider uppercase rounded-xl hover:border-gray-300 transition-all'
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
