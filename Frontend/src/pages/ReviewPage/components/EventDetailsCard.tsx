import { FileText } from "lucide-react";
import InfoField from "./InfoField";

interface EventDetailsCardProps {
  eventData: any;
}

export default function EventDetailsCard({ eventData }: EventDetailsCardProps) {
  const isInterno = eventData.requesterType === "interno";

  if (!isInterno) {
    return (
      <div className='bg-white rounded-2xl p-5 border border-gray-100 shadow-xs text-center space-y-2 opacity-60 print:hidden'>
        <h4 className='text-xs font-black uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-2 flex items-center gap-1.5 justify-center'>
          <FileText className='w-4 h-4' /> Detalhes do Evento
        </h4>
        <p className='text-xs text-gray-400 italic'>
          Dados de evento acadêmico/institucional não se aplicam para Locações Externas.
        </p>
      </div>
    );
  }

  return (
    <div className='bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-4 print:border-gray-200 print:shadow-none'>
      <h4 className='text-xs font-black uppercase tracking-wider text-primary border-b border-gray-100 pb-2 flex items-center gap-1.5 print:text-brand print:border-gray-200'>
        <FileText className='w-4 h-4 print:hidden' /> Detalhes do Evento
      </h4>

      <div className='space-y-4'>
        <InfoField
          label='Título do Evento'
          value={eventData.eventTitle}
          highlight
        />

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <InfoField
            label='Tipo de Evento'
            value={eventData.eventType}
            placeholder='Não informado'
          />
          <InfoField
            label='Público Estimado'
            value={
              eventData.estimatedPublic
                ? `${eventData.estimatedPublic} pessoas`
                : null
            }
            placeholder='Não informado'
          />
        </div>

        <InfoField
          label='Público-Alvo'
          value={
            Array.isArray(eventData.targetAudience)
              ? eventData.targetAudience
                  .map((val: any) =>
                    typeof val === "object" && val !== null
                      ? val.name || val.id
                      : val
                  )
                  .join(", ")
              : eventData.targetAudience
          }
          placeholder='Nenhum selecionado'
        />

        <div className='space-y-1.5'>
          <span className='font-semibold text-gray-400 block text-[10px] uppercase tracking-wider'>
            Resumo e Finalidade
          </span>
          <p className='text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100 leading-relaxed font-medium print:bg-white print:border-gray-200'>
            {eventData.eventDescription || "Sem descrição informada."}
          </p>
        </div>
      </div>
    </div>
  );
}
