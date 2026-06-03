import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import EventForm from "./features/EventForm";
import VerifyAuthor from "./features/EventForm/components/VerifyAuthor";
import AdminReview from "./features/EventForm/components/AdminReview";
import { CalendarRange, ShieldAlert } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <BrowserRouter>
      <div className='flex flex-col min-h-screen bg-bg-app transition-colors duration-300'>
        {/* Header institucional */}
        <Header />

        {/* Main Content Area */}
        <main className='grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
          <Routes>
            {/* ROTA PRINCIPAL: Form de reserva de espaço */}
            <Route
              path="/"
              element={
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
                      <span>Resposta em até 48 horas úteis</span>
                    </div>
                  </div>

                  {/* Render Event booking React Form container */}
                  <EventForm />
                </>
              }
            />

            {/* ROTA: Confirmacao de autor via token JWT */}
            <Route path="/verificar-evento" element={<VerifyAuthor />} />

            {/* ROTA: Revisão do Admin via token JWT */}
            <Route path="/revisar-evento" element={<AdminReview />} />
          </Routes>
        </main>

        <Footer />
        <ToastContainer
          position='top-center'
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='colored'
        />
      </div>
    </BrowserRouter>
  );
}
