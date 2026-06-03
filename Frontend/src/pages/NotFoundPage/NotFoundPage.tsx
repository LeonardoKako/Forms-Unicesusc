import { useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className='max-w-2xl mx-auto my-12 bg-white rounded-3xl p-10 sm:p-12 text-center border border-gray-100 shadow-xl space-y-6 animate-fadeIn'>
      <div className='p-4 bg-brand/5 text-primary rounded-full w-20 h-20 flex items-center justify-center mx-auto border border-brand/10'>
        <AlertCircle className='h-10 w-10' />
      </div>
      <div>
        <h3 className='text-xl sm:text-2xl font-black text-brand uppercase tracking-wider'>
          Página não encontrada
        </h3>
        <p className='text-xs text-gray-400 mt-2 font-medium uppercase tracking-widest'>
          Erro 404
        </p>
      </div>
      <p className='text-sm text-gray-500 font-medium leading-relaxed max-w-md mx-auto'>
        O endereço que você tentou acessar não existe ou foi movido. Certifique-se de que a URL inserida está correta.
      </p>
      <div className='border-t border-gray-100 pt-6'>
        <button
          onClick={() => navigate("/")}
          className='inline-flex items-center space-x-2 px-6 h-12 bg-brand text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow-md hover:bg-brand/95 active:scale-[0.98] transition-all cursor-pointer'
        >
          <ArrowLeft className='w-4 h-4' />
          <span>Ir para Página Inicial</span>
        </button>
      </div>
    </div>
  );
}
