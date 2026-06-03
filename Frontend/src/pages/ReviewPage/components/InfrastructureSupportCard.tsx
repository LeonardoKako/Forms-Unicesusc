import { Cpu, Link } from "lucide-react";
import { SUPPORT_TEAMS_OPTIONS } from "../../FormsPage/EventForm/mockData";
import InfoField from "./InfoField";

interface InfrastructureSupportCardProps {
  eventData: any;
}

export default function InfrastructureSupportCard({
  eventData,
}: InfrastructureSupportCardProps) {
  const isInterno = eventData.requesterType === "interno";

  const getResolvedTeams = () => {
    if (!eventData.supportTeams) return [];
    return eventData.supportTeams.map((team: any) => {
      const teamId = typeof team === "object" && team !== null ? team.id : team;
      const teamLabel =
        typeof team === "object" && team !== null ? team.name || team.id : team;
      return (
        SUPPORT_TEAMS_OPTIONS.find((t) => t.id === teamId)?.label || teamLabel
      );
    });
  };

  return (
    <div className='bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-4 print:border-gray-200 print:shadow-none'>
      <h4 className='text-xs font-black uppercase tracking-wider text-primary border-b border-gray-100 pb-2 flex items-center gap-1.5 print:text-brand print:border-gray-200'>
        <Cpu className='w-4 h-4 print:hidden' /> Infraestrutura & Apoio
      </h4>

      <div className='space-y-4'>
        {/* Equipes de Apoio Acionadas (Aparece para ambos) */}
        <div>
          <span className='font-semibold text-gray-400 block text-[10px] uppercase tracking-wider mb-2'>
            Equipes de Apoio Acionadas
          </span>
          <div className='flex flex-wrap gap-1.5'>
            {eventData.supportTeams && eventData.supportTeams.length > 0 ? (
              getResolvedTeams().map((teamLabel: string, index: number) => (
                <span
                  key={index}
                  className='bg-brand/5 border border-brand/10 text-brand text-[9px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider print:bg-gray-100 print:border-gray-200'
                >
                  {teamLabel}
                </span>
              ))
            ) : (
              <span className='text-xs text-gray-400 italic font-normal bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md inline-block'>
                Nenhuma equipe acionada
              </span>
            )}
          </div>
        </div>

        {isInterno ? (
          <>
            {/* Equipamentos de TI */}
            <div className='border-t border-gray-100 pt-3 print:border-gray-200'>
              <InfoField
                label='Equipamentos de T.I. Solicitados'
                value={eventData.tiEquipment}
                placeholder='Nenhum equipamento de T.I. solicitado'
              />
            </div>

            {/* Móveis e Apoio */}
            <div className='border-t border-gray-100 pt-3 space-y-3 print:border-gray-200'>
              <InfoField
                label='Móveis e Apoio Logístico'
                value={eventData.furnitureSupport}
                placeholder='Nenhum móvel solicitado'
              />
              {eventData.otherFurnitureDescription && (
                <InfoField
                  label='Outros Móveis (Descrição)'
                  value={eventData.otherFurnitureDescription}
                />
              )}
            </div>

            {/* Material de Apresentação e Drive */}
            <div className='border-t border-gray-100 pt-3 space-y-3 print:border-gray-200'>
              <InfoField
                label='Materiais de Apresentação'
                value={eventData.presentationMaterials}
                placeholder='Nenhum material de apresentação solicitado'
              />
              {eventData.presentationDriveLink && (
                <div className='space-y-1.5'>
                  <span className='font-semibold text-gray-400 block text-[10px] uppercase tracking-wider'>
                    Link do Google Drive
                  </span>
                  <a
                    href={eventData.presentationDriveLink}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center space-x-1 text-xs text-primary font-bold hover:underline bg-brand/5 border border-brand/10 px-3 py-1.5 rounded-lg'
                  >
                    <Link className='w-3.5 h-3.5' />
                    <span>Acessar Google Drive do Evento</span>
                  </a>
                </div>
              )}
            </div>

            {/* Comunicação e Divulgação (Marketing) */}
            <div className='border-t border-gray-100 pt-3 space-y-3 print:border-gray-200'>
              <div className='flex items-center justify-between'>
                <span className='text-xs font-bold text-gray-700'>
                  Solicitar Arte para Divulgação?
                </span>
                <span
                  className={`text-xs font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider ${
                    eventData.needsArtwork
                      ? "bg-brand/5 border border-brand/10 text-brand"
                      : "bg-gray-50 border border-gray-100 text-gray-400"
                  }`}
                >
                  {eventData.needsArtwork ? "Sim" : "Não"}
                </span>
              </div>

              {eventData.needsArtwork && (
                <div className='bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3 print:bg-white print:border-gray-200'>
                  <div className='flex items-center justify-between border-b border-gray-200 pb-2'>
                    <span className='text-[10px] font-bold text-gray-500 uppercase tracking-wider'>
                      Necessita de material impresso físico?
                    </span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase ${
                        eventData.hasPrintedArtwork
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {eventData.hasPrintedArtwork ? "Sim" : "Não"}
                    </span>
                  </div>

                  <InfoField
                    label='Descrição da Arte / Peças'
                    value={eventData.artworkDescription}
                    placeholder='Não detalhado'
                  />
                </div>
              )}
            </div>
          </>
        ) : (
          <div className='border-t border-gray-100 pt-3 space-y-2 opacity-65 print:hidden'>
            <span className='text-[10px] font-bold text-gray-400 uppercase tracking-wider'>
              Equipamentos de T.I, Móveis e Mídia (Marketing)
            </span>
            <p className='text-xs text-gray-400 italic'>
              Não aplicáveis para locações externas (apenas apoio geral de
              equipes).
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
