import Header from "./components/Header";
import EventForm from "./features/EventForm";
import { CalendarRange, ShieldAlert, HeartHandshake } from "lucide-react";

export default function App() {
  return (
    <div className='flex flex-col min-h-screen bg-bg-app transition-colors duration-300'>
      {/* Header institucional */}
      <Header />

      {/* Main Content Area */}
      <main className='grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
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
            <span>Resposta em até 48 horas úteis</span>
          </div>
        </div>

        {/* Render Event booking React Form container */}
        <EventForm />
      </main>

      {/* Institutional Footer */}
      <footer className='bg-brand text-white/80 py-10 mt-12 border-t-4 border-primary'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 text-sm'>
            {/* Column 1: Info Unicesusc */}
            <div className='space-y-3'>
              <div className='flex items-center space-x-1.5'>
                <span className='font-extrabold text-white text-lg tracking-tight'>
                  UNICESUSC
                </span>
              </div>
              <p className='text-xs text-white/60 leading-relaxed max-w-xs'>
                Complexo de Ensino Superior de Santa Catarina. Formando cidadãos
                e profissionais qualificados com responsabilidade social.
              </p>
            </div>

            {/* Column 2: Normas de Uso */}
            <div className='space-y-2.5'>
              <h4 className='font-bold text-white uppercase tracking-wider text-xs flex items-center gap-1.5'>
                <ShieldAlert className='h-4 w-4 text-primary' />
                <span>Termos e Regulamentos</span>
              </h4>
              <ul className='space-y-1.5 text-xs text-white/70'>
                <li>• Cancelamento com no mínimo 24h de antecedência</li>
                <li>• Manter a organização e limpeza do espaço solicitado</li>
                <li>• Proibido consumir alimentos dentro dos laboratórios</li>
                <li>• A TI não fornece adaptadores de cabos de vídeo</li>
              </ul>
            </div>

            {/* Column 3: Suporte Técnico */}
            <div className='space-y-2.5'>
              <h4 className='font-bold text-white uppercase tracking-wider text-xs flex items-center gap-1.5'>
                <HeartHandshake className='h-4 w-4 text-primary' />
                <span>Ajuda e Suporte</span>
              </h4>
              <p className='text-xs text-white/70 leading-relaxed'>
                Dúvidas técnicas no agendamento ou suporte a áudio/vídeo? Entre
                em contato com a equipe de Tecnologia da Informação.
              </p>
              <div className='text-xs font-semibold text-white mt-2'>
                <span>E-mail: </span>
                <a
                  href='mailto:suporte.ti@cesusc.edu.br'
                  className='text-primary hover:underline'
                >
                  suporte.ti@cesusc.edu.br
                </a>
              </div>
            </div>
          </div>

          <div className='mt-8 pt-6 border-t border-white/10 text-center text-xs text-white/40'>
            <p>
              © {new Date().getFullYear()} Faculdade Cesusc. Todos os direitos
              reservados. Interface construída com Antigravity.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
