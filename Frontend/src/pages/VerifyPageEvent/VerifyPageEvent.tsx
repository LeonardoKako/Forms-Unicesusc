import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle2, AlertTriangle, Loader2, ArrowLeft } from "lucide-react";
import api from "../../lib/api";

export default function VerifyPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("Token de validação não encontrado na URL.");
      return;
    }

    const verifyToken = async () => {
      try {
        // GET /events/verify-author?token=TOKEN
        await api.get(`/events/verify-author`, {
          params: { token },
        });
        setStatus("success");
      } catch (err: any) {
        setStatus("error");
        const backendMessage =
          err.response?.data?.message ||
          "Token de verificação inválido ou expirado (tempo limite de 30 minutos excedido).";
        setErrorMessage(backendMessage);
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className='max-w-2xl mx-auto my-8 bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden animate-fadeIn'>
      {status === "loading" && (
        <div className='p-12 text-center flex flex-col items-center justify-center space-y-6'>
          <Loader2 className='h-16 w-16 text-primary animate-spin' />
          <div>
            <h3 className='text-lg font-extrabold text-brand uppercase tracking-wider'>
              Verificando sua solicitação
            </h3>
            <p className='text-xs text-gray-400 mt-2 font-medium'>
              Aguarde enquanto validamos as credenciais e confirmamos o
              agendamento...
            </p>
          </div>
        </div>
      )}

      {status === "success" && (
        <div className='animate-scaleUp'>
          {/* Header Sucesso */}
          <div className='p-8 bg-emerald-600 text-white text-center flex flex-col items-center'>
            <div className='p-3 bg-white/10 rounded-full mb-3 animate-pulse'>
              <CheckCircle2 className='h-12 w-12 text-white' />
            </div>
            <h3 className='text-xl sm:text-2xl font-black uppercase tracking-wider'>
              E-mail Confirmado!
            </h3>
            <p className='text-xs text-emerald-100/90 mt-1 font-medium'>
              Sua autoria foi validada com sucesso
            </p>
          </div>

          {/* Body Sucesso */}
          <div className='p-8 sm:p-10 text-center space-y-6'>
            <p
              style={{ fontWeight: 600 }}
              className='text-sm sm:text-base text-gray-600 leading-relaxed'
            >
              Sua solicitação de evento foi confirmada com sucesso e já foi
              encaminhada para a aprovação do setor de eventos.
            </p>
            <div className='border-t border-gray-100 pt-6'>
              <button
                onClick={() => navigate("/")}
                className='inline-flex items-center space-x-2 px-6 h-12 bg-brand text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow-md hover:bg-brand/95 active:scale-[0.98] transition-all cursor-pointer'
              >
                <ArrowLeft className='w-4 h-4' />
                <span>Voltar ao Formulário</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className='animate-scaleUp'>
          {/* Header Erro */}
          <div className='p-8 bg-red-600 text-white text-center flex flex-col items-center'>
            <div className='p-3 bg-white/10 rounded-full mb-3'>
              <AlertTriangle className='h-12 w-12 text-white' />
            </div>
            <h3 className='text-xl sm:text-2xl font-black uppercase tracking-wider'>
              Falha na Verificação
            </h3>
            <p className='text-xs text-red-100/90 mt-1 font-medium'>
              Não foi possível confirmar o agendamento
            </p>
          </div>

          {/* Body Erro */}
          <div className='p-8 sm:p-10 text-center space-y-6'>
            <div className='bg-red-50/55 border border-red-100 rounded-2xl p-5 text-left'>
              <span className='text-xs font-bold text-red-800 uppercase tracking-wider block mb-1'>
                Motivo do Impedimento:
              </span>
              <p className='text-xs sm:text-sm text-red-700 leading-relaxed font-medium'>
                {errorMessage ||
                  "Token de verificação inválido ou expirado (tempo limite de 30 minutos excedido). O evento foi cancelado automaticamente. Por favor, acesse o sistema e realize o preenchimento do formulário novamente."}
              </p>
            </div>

            <p className='text-xs text-gray-400 font-medium'>
              Se o prazo de 30 minutos expirou, você precisará preencher um novo
              formulário de reserva.
            </p>

            <div className='border-t border-gray-100 pt-6'>
              <button
                onClick={() => navigate("/")}
                className='inline-flex items-center space-x-2 px-6 h-12 bg-primary text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow-md hover:bg-primary/95 active:scale-[0.98] transition-all cursor-pointer'
              >
                <span>Fazer Nova Reserva</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
