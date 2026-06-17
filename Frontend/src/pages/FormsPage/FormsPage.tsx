import { CalendarRange, ShieldAlert } from "lucide-react";
import EventForm from "./EventForm";

export default function FormsPage() {
  return (
    <>
      {/* Page Hero Section */}
      <div className='mb-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-xs'>
        <div className='flex items-center space-x-4'>
          <div className='p-3.5 bg-brand text-white rounded-2xl shadow-inner flex items-center justify-center'>
            <CalendarRange className='h-6 w-6' />
          </div>
          <div>
            <h2 className='text-xl font-extrabold text-brand tracking-tight'>
              Nova Reserva de Espaço
            </h2>
            <p className='text-xs text-gray-500 mt-0.5'>
              Preencha todos os campos obrigatórios para solicitar a
              homologação e reserva do seu evento.
            </p>
          </div>
        </div>

        {/* Quick Informative Badge */}
        <div className='flex items-center space-x-2 text-[10px] uppercase font-bold tracking-wider text-brand bg-brand/5 px-3 py-1.5 rounded-lg border border-brand/10'>
          <ShieldAlert className='h-3.5 w-3.5 text-primary' />
          <span>Resposta em até 7 dias corridos</span>
        </div>
      </div>

      {/* Render Event booking React Form container */}
      <EventForm />
    </>
  );
}
