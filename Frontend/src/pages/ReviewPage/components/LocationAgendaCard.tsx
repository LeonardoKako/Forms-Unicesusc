import { Calendar, MapPin, Clock } from "lucide-react";
import InfoField from "./InfoField";

interface LocationAgendaCardProps {
  eventData: any;
  roomLabel: string;
}

export default function LocationAgendaCard({
  eventData,
  roomLabel,
}: LocationAgendaCardProps) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const cleanDate = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
    const [year, month, day] = cleanDate.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <div className='bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-4 print:border-gray-200 print:shadow-none'>
      <h4 className='text-xs font-black uppercase tracking-wider text-primary border-b border-gray-100 pb-2 flex items-center gap-1.5 print:text-brand print:border-gray-200'>
        <Calendar className='w-4 h-4 print:hidden' /> Local & Agenda
      </h4>

      <div className='space-y-4'>
        <div className='flex items-center space-x-2.5'>
          <MapPin className='w-5 h-5 text-brand/70 shrink-0 print:hidden' />
          <InfoField
            label='Espaço Reservado'
            value={roomLabel}
            highlight
            className='grow'
          />
        </div>

        <div className='flex items-center space-x-2.5'>
          <Clock className='w-5 h-5 text-brand/70 shrink-0 print:hidden' />
          <div className='grid grid-cols-2 gap-4 grow'>
            <InfoField
              label='Data do Evento'
              value={formatDate(eventData.eventDate)}
            />
            <InfoField
              label='Horário'
              value={`${eventData.startTime} às ${eventData.endTime}`}
            />
          </div>
        </div>

        <div className='space-y-1.5'>
          <span className='font-semibold text-gray-400 block text-[10px] uppercase tracking-wider'>
            Espaços Extras / Observações de Local
          </span>
          {eventData.roomNotes ? (
            <p className='text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100 leading-normal font-medium print:bg-white print:border-gray-200'>
              {eventData.roomNotes}
            </p>
          ) : (
            <span className='text-xs text-gray-400 italic font-normal bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md inline-block'>
              Nenhuma observação informada
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
