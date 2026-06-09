import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FormsPage from "./pages/FormsPage/FormsPage";
import VerifyPageEvent from "./pages/VerifyPageEvent/VerifyPageEvent";
import ReviewPageEvent from "./pages/ReviewPageEvent/ReviewPageEvent";
import VerifyPageLocation from "./pages/VerifyPageLocation/VerifyPageLocation";
import ReviewPageLocation from "./pages/ReviewPageLocation/ReviewPageLocation";
import FormDetailsPage from "./pages/FormDetailsPage/FormDetailsPage";
import LocationDetailsPage from "./pages/LocationDetailsPage/LocationDetailsPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
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
            <Route path='/' element={<FormsPage />} />

            {/* Rotas de Eventos Internos */}
            <Route path='/verificar-evento' element={<VerifyPageEvent />} />
            <Route path='/revisar-evento' element={<ReviewPageEvent />} />

            {/* Rotas de Locações Externas */}
            <Route path='/verificar-locacao' element={<VerifyPageLocation />} />
            <Route path='/revisar-locacao' element={<ReviewPageLocation />} />

            {/* ROTA: Detalhes do Evento para Equipes de Apoio */}
            <Route path='/forms/:id' element={<FormDetailsPage />} />

            {/* ROTA: Detalhes da Locação para Equipes de Apoio */}
            <Route path='/location/:id' element={<LocationDetailsPage />} />

            {/* ROTA FALLBACK: 404 Not Found */}
            <Route path='*' element={<NotFoundPage />} />
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
