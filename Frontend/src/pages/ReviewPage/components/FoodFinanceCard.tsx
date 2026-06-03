import { Coffee, FileText } from "lucide-react";
import InfoField from "./InfoField";

interface FoodFinanceCardProps {
  eventData: any;
}

export default function FoodFinanceCard({ eventData }: FoodFinanceCardProps) {
  const isInterno = eventData.requesterType === "interno";

  if (!isInterno) {
    return (
      <div className='bg-white rounded-2xl p-5 border border-gray-100 shadow-xs text-center space-y-2 opacity-60 print:hidden'>
        <h4 className='text-xs font-black uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-2 flex items-center gap-1.5 justify-center'>
          <Coffee className='w-4 h-4' /> Alimentação & Finanças
        </h4>
        <p className='text-xs text-gray-400 italic'>
          Serviços de copa, coffee break e orçamento interno não se aplicam para Locações Externas.
        </p>
      </div>
    );
  }

  const getCoffeeBreakLabel = (value: string) => {
    switch (value) {
      case "nao_se_aplica":
        return "Não se aplica";
      case "padrao_100":
        return "Padrão (Até 100 pessoas)";
      case "padrao_288":
        return "Padrão (Até 288 pessoas)";
      case "biscoitos_100":
        return "Biscoitos (Até 100 pessoas)";
      default:
        return value || "Não informado";
    }
  };

  return (
    <div className='bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-4 print:border-gray-200 print:shadow-none'>
      <h4 className='text-xs font-black uppercase tracking-wider text-primary border-b border-gray-100 pb-2 flex items-center gap-1.5 print:text-brand print:border-gray-200'>
        <Coffee className='w-4 h-4 print:hidden' /> Alimentação & Finanças
      </h4>

      <div className='space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <InfoField
            label='Plano de Coffee Break'
            value={getCoffeeBreakLabel(eventData.coffeeBreak)}
            highlight
          />
          <div className='space-y-1'>
            <span className='font-semibold text-gray-400 block text-[10px] uppercase tracking-wider'>
              Exige Orçamento?
            </span>
            <span
              className={`text-xs font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider inline-block ${
                eventData.needsBudget
                  ? "bg-red-50 border border-red-200 text-red-700"
                  : "bg-gray-50 border border-gray-100 text-gray-400"
              }`}
            >
              {eventData.needsBudget ? "Sim" : "Não"}
            </span>
          </div>
        </div>

        {eventData.coffeeNotes && (
          <div className='space-y-1'>
            <span className='font-semibold text-gray-400 block text-[10px] uppercase tracking-wider'>
              Observações do Coffee
            </span>
            <p className='text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-100 font-medium print:bg-white print:border-gray-200'>
              {eventData.coffeeNotes}
            </p>
          </div>
        )}

        <div className='border-t border-gray-100 pt-3 space-y-3 print:border-gray-200'>
          <InfoField
            label='Utensílios de Copa'
            value={eventData.copa}
            placeholder='Nenhum utensílio solicitado'
          />
          
          {eventData.otherCopaDescription && (
            <InfoField
              label='Outros itens de Copa (Descrição)'
              value={eventData.otherCopaDescription}
            />
          )}
        </div>

        {eventData.needsBudget && (
          <div className='border-t border-gray-100 pt-3 space-y-2 print:border-gray-200'>
            <span className='font-semibold text-gray-400 block text-[10px] uppercase tracking-wider'>
              Aprovação da Reitoria
            </span>
            {eventData.budgetApprovalFileUrl ? (
              <a
                href={eventData.budgetApprovalFileUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center space-x-1.5 text-xs text-primary font-bold hover:underline bg-brand/5 border border-brand/10 px-3 py-1.5 rounded-lg print:border-gray-200'
              >
                <FileText className='w-4 h-4' />
                <span>Visualizar Confirmação da Reitoria (Anexo)</span>
              </a>
            ) : (
              <span className='text-xs text-red-600 font-semibold italic bg-red-50 border border-red-100 px-2 py-0.5 rounded-md inline-block'>
                Arquivo de aprovação obrigatório não anexado
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
