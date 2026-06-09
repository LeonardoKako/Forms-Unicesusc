import { Users, Info } from "lucide-react";
import InfoField from "./InfoField";

interface RequesterDetailsCardProps {
  eventData: any;
}

export default function RequesterDetailsCard({ eventData }: RequesterDetailsCardProps) {
  const isInterno = eventData.requesterType === "interno";

  return (
    <div className='bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-4 print:border-gray-200 print:shadow-none'>
      <h4 className='text-xs font-black uppercase tracking-wider text-primary border-b border-gray-100 pb-2 flex items-center gap-1.5 print:text-brand print:border-gray-200'>
        <Users className='w-4 h-4 print:hidden' /> Identificação do Solicitante
      </h4>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <InfoField
          label='Nome / Responsável'
          value={eventData.requesterName}
          highlight
        />
        <InfoField
          label='Vínculo'
          value={
            eventData.requesterType === "locacao"
              ? "Locação Externa"
              : "Comunidade Interna"
          }
        />
        <InfoField
          label='E-mail de Contato'
          value={eventData.requesterEmail}
        />
        <InfoField
          label='Telefone / Celular'
          value={eventData.requesterPhone}
        />
        {isInterno && (
          <InfoField
            label='Setor / Curso / Coordenação'
            value={eventData.requesterDepartment}
            placeholder='Não informado'
            className='md:col-span-2'
          />
        )}
      </div>

      {isInterno && (
        <div className='border-t border-gray-100 pt-3 mt-2 space-y-3 print:border-gray-200'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-bold text-gray-700'>
              Evento Parceiro?
            </span>
            <span
              className={`text-xs font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider ${
                eventData.isPartnerEvent
                  ? "bg-amber-50 border border-amber-200 text-amber-700"
                  : "bg-gray-50 border border-gray-100 text-gray-400"
              }`}
            >
              {eventData.isPartnerEvent ? "Sim" : "Não"}
            </span>
          </div>

          {eventData.isPartnerEvent && (
            <div className='bg-brand/5 p-4 rounded-xl border border-brand/10 space-y-3 animate-fadeIn print:bg-gray-50 print:border-gray-200'>
              <h5 className='text-[10px] font-black text-brand uppercase tracking-wider flex items-center gap-1'>
                <Info className='w-3.5 h-3.5 text-primary' /> Dados da Instituição Parceira
              </h5>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                <InfoField
                  label='Instituição'
                  value={eventData.partnerInstitution}
                  placeholder='Não informado'
                />
                <InfoField
                  label='Responsável Técnico'
                  value={eventData.partnerName}
                  placeholder='Não informado'
                />
                <InfoField
                  label='E-mail Parceiro'
                  value={eventData.partnerEmail}
                  placeholder='Não informado'
                />
                <InfoField
                  label='Telefone Parceiro'
                  value={eventData.partnerPhone}
                  placeholder='Não informado'
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
