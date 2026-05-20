import { GraduationCap, Bell, User } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-brand text-white shadow-lg sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo / Branding */}
          <div className="flex items-center space-x-4">
            <div className="bg-primary p-2.5 rounded-xl shadow-md flex items-center justify-center transition-transform hover:scale-105 duration-200">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl tracking-tight">UNICESUSC</span>

              </div>
              <p className="text-[10px] text-white/70 uppercase tracking-widest font-semibold mt-0.5">
                Sistemas Acadêmicos
              </p>
            </div>
          </div>

          {/* Central Title - Hidden on small mobile */}
          <div className="hidden md:flex flex-col items-center">
            <h1 className="text-base font-bold tracking-wide uppercase text-white/90">
              Solicitação de Espaços e Eventos
            </h1>
            <span className="text-xs text-white/60">Portal de Agendamentos e Reservas</span>
          </div>

          {/* Right Action Icons & User Profile */}
          <div className="flex items-center space-x-4">
            <button
              className="relative p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
              aria-label="Notificações"
            >
              <Bell className="h-5.5 w-5.5" />
              <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-primary border-2 border-brand animate-pulse"></span>
            </button>

            {/* User Profile Info */}
            <div className="flex items-center space-x-3 pl-3 border-l border-white/20">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold leading-none">Prof. Leonardo</p>
                <p className="text-[11px] text-white/60 mt-1">Coordenação Geral</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-primary border border-white/20 flex items-center justify-center text-white font-bold text-sm tracking-wide shadow-inner cursor-pointer hover:bg-primary/95 hover:shadow-md transition-all duration-200">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>

        </div>
      </div>
      {/* Decorative accent bottom line using the secondary primary color (Vermelho Vivo) */}
      <div className="h-1 bg-primary w-full shadow-sm"></div>
    </header>
  )
}
