import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Loader2,
  XCircle,
  Printer,
  Download,
  CalendarRange,
} from "lucide-react";
import { ROOM_OPTIONS } from "../FormsPage/EventForm/mockData";
import { toast } from "react-toastify";
import api from "../../lib/api";

// Importações dos mesmos componentes de visualização da ReviewPageEvent
import RequesterDetailsCard from "../ReviewPageEvent/components/RequesterDetailsCard";
import LocationAgendaCard from "../ReviewPageEvent/components/LocationAgendaCard";
import InfrastructureSupportCard from "../ReviewPageEvent/components/InfrastructureSupportCard";

export default function LocationDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [locationData, setLocationData] = useState<any | null>(null);

  // Carrega os dados da locação na montagem da tela pelo ID público
  useEffect(() => {
    if (!id) {
      toast.error("ID de identificação da locação ausente.");
      setLoading(false);
      return;
    }

    const fetchLocationDetails = async () => {
      try {
        const response = await api.get(`/locations/${id}`);
        setLocationData(response.data);
      } catch (err: any) {
        toast.error(
          err.response?.data?.message ||
            "Erro ao buscar detalhes da locação. Registro não encontrado ou cancelado.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLocationDetails();
  }, [id]);

  // Resolve o rótulo do espaço
  const selectedRoom = locationData?.selectedRoom;
  const roomDetails = ROOM_OPTIONS.find((r) => r.value === selectedRoom);
  const roomLabel = roomDetails
    ? `${roomDetails.label} (${roomDetails.location})`
    : selectedRoom || "Não informado";

  // Gera o PDF
  const handlePrint = () => {
    window.print();
  };

  // Exporta os dados da locação para CSV
  const handleExportCSV = () => {
    if (!locationData) return;

    const formatDate = (dateStr: string) => {
      if (!dateStr) return "";
      const cleanDate = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
      const [year, month, day] = cleanDate.split("-");
      return `${day}/${month}/${year}`;
    };

    const dataToExport = {
      "Código de Controle": locationData.controlCode || "",
      "Tipo de Reserva": "Locação Externa",
      "Nome do Responsável / Empresa": locationData.requesterName || "",
      "E-mail do Solicitante": locationData.requesterEmail || "",
      "Telefone do Solicitante": locationData.requesterPhone || "",
      "Espaço Reservado": roomLabel,
      "Data do Evento": formatDate(locationData.eventDate),
      "Horário de Início": locationData.startTime || "",
      "Horário de Término": locationData.endTime || "",
      "Observações de Espaço": (locationData.roomNotes || "Nenhuma").replace(
        /\n/g,
        " ",
      ),
      "Equipes de Apoio": Array.isArray(locationData.supportTeams)
        ? locationData.supportTeams.map((t: any) => typeof t === "object" && t !== null ? t.name || t.id : t).join(", ")
        : locationData.supportTeams || "Nenhuma",
    };

    const headers = Object.keys(dataToExport).join(";");
    const values = Object.values(dataToExport)
      .map((val) => `"${String(val).replace(/"/g, '""')}"`)
      .join(";");

    const csvContent = "\uFEFF" + headers + "\n" + values;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `locacao_${locationData.controlCode || "externa"}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Dados exportados para planilha com sucesso!");
  };

  if (loading) {
    return (
      <div className='max-w-2xl mx-auto my-12 bg-white rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-6 border border-gray-100 shadow-xl'>
        <Loader2 className='h-16 w-16 text-primary animate-spin' />
        <div>
          <h3 className='text-lg font-extrabold text-brand uppercase tracking-wider'>
            Carregando detalhes da locação
          </h3>
          <p className='text-xs text-gray-400 mt-2 font-medium'>
            Buscando informações aprovadas e dados de suporte...
          </p>
        </div>
      </div>
    );
  }

  if (!locationData) {
    return (
      <div className='max-w-2xl mx-auto my-12 bg-white rounded-3xl p-10 text-center border border-gray-100 shadow-xl space-y-6'>
        <XCircle className='h-16 w-16 text-primary mx-auto' />
        <h3 className='text-lg font-extrabold text-brand uppercase tracking-wider'>
          Solicitação Não Encontrada
        </h3>
        <p className='text-sm text-gray-500 font-medium leading-relaxed'>
          O link acessado é inválido ou a locação em questão foi cancelada ou expirou do sistema de agendamentos.
        </p>
        <button
          onClick={() => navigate("/")}
          className='px-6 h-12 bg-brand text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow-md transition-all cursor-pointer'
        >
          Ir para Página Inicial
        </button>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto my-8 bg-white rounded-3xl border border-gray-150 shadow-2xl overflow-hidden animate-fadeIn print:shadow-none print:my-0 print:border-none'>
      {/* Banner Superior da Visualização */}
      <div className='p-6 sm:p-8 bg-linear-to-r from-brand to-brand/95 text-white shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:bg-none print:text-brand print:border-b print:border-gray-200 print:px-0 print:pt-0'>
        <div>
          <span className='text-[10px] bg-white/10 text-white font-bold px-2.5 py-1 rounded-md uppercase tracking-widest border border-white/10 print:hidden'>
            Detalhamento do Apoio
          </span>
          <h3 className='text-xl sm:text-2xl font-black uppercase tracking-wider mt-2.5 print:mt-0 print:text-brand'>
            Ficha de Locação Aprovada
          </h3>
        </div>
        <div className='flex items-center gap-3 print:bg-transparent'>
          <div className='bg-white text-brand px-4 py-2 font-black rounded-xl text-sm tracking-widest uppercase border border-white/20 print:border-gray-300 print:text-gray-700'>
            {locationData.controlCode}
          </div>
        </div>
      </div>

      {/* Barra de Ações Rápidas (PDF / Planilha) */}
      <div className='bg-gray-100/50 border-b border-gray-150 px-6 sm:px-8 py-3.5 flex justify-between items-center print:hidden'>
        <span className='text-xs font-semibold text-gray-500'>
          Ações Rápidas do Documento:
        </span>
        <div className='flex items-center gap-2'>
          <button
            onClick={handleExportCSV}
            className='inline-flex items-center space-x-1.5 px-3.5 py-2 bg-white text-gray-700 hover:text-brand border border-gray-200 hover:border-brand/30 font-bold text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer shadow-xs hover:shadow-sm'
            title='Exportar dados para Excel (.csv)'
          >
            <Download className='w-4 h-4 text-brand' />
            <span className='hidden sm:inline'>Planilha (CSV)</span>
          </button>
          <button
            onClick={handlePrint}
            className='inline-flex items-center space-x-1.5 px-3.5 py-2 bg-brand text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow-md hover:bg-brand/95 active:scale-[0.98] transition-all cursor-pointer'
            title='Imprimir ou Salvar em PDF'
          >
            <Printer className='w-4 h-4' />
            <span>Gerar PDF / Imprimir</span>
          </button>
        </div>
      </div>

      <div className='p-6 sm:p-8 space-y-6 bg-gray-50/30 print:bg-white print:px-0 print:py-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-1'>
          {/* COLUNA ESQUERDA */}
          <div className='space-y-6'>
            <RequesterDetailsCard eventData={locationData} />
            <InfrastructureSupportCard eventData={locationData} />
          </div>

          {/* COLUNA DIREITA */}
          <div className='space-y-6'>
            <LocationAgendaCard eventData={locationData} roomLabel={roomLabel} />
          </div>
        </div>

        {/* Rodapé informativo para o apoio */}
        <div className='bg-white rounded-2xl p-5 border border-gray-150 shadow-xs flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left print:hidden'>
          <div className='p-3 bg-brand/5 text-brand rounded-xl flex items-center justify-center shrink-0'>
            <CalendarRange className='h-6 w-6' />
          </div>
          <div>
            <h5 className='text-xs font-black uppercase text-brand tracking-wider'>
              Suporte de Infraestrutura Unicesusc
            </h5>
            <p className='text-xs text-gray-400 mt-0.5 leading-relaxed font-medium'>
              Esta ficha contém todas as demandas e recursos contratados para a locação. Em caso de dúvidas, entre em contato com o administrador de locações pelo e-mail <strong>apoio.eventos@unicesusc.edu.br</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
