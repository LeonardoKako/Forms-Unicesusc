import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FormsPage from "./pages/FormsPage/FormsPage";
import VerifyPage from "./pages/VerifyPage/VerifyPage";
import ReviewPage from "./pages/ReviewPage/ReviewPage";
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

            {/* ROTA: Confirmacao de autor via token JWT */}
            <Route path='/verificar-evento' element={<VerifyPage />} />

            {/* ROTA: Revisão do Admin via token JWT */}
            <Route path='/revisar-evento' element={<ReviewPage />} />

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
