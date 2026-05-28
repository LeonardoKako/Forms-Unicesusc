import { FileText, ExternalLink, Info } from "lucide-react";

export default function ExtraDocsCard() {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md animate-fadeIn">
      {/* Header do Card */}
      <div className="flex items-center space-x-3 mb-6 pb-3 border-b border-gray-100">
        <div className="p-2 bg-brand/5 rounded-xl text-brand">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-extrabold uppercase tracking-wide text-brand">
            Documentos Extras
          </h2>
          <p className="text-xs text-gray-400">
            Modelos oficiais e relatórios pós-evento
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Bloco de Links de Documentos */}
        <div className="space-y-5">
          
          {/* Item 1: Lista de Frequência */}
          <div className="p-4 bg-brand/5 border border-brand/10 rounded-xl space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-brand">
              Lista de Frequência & Certificação
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Para certificação, você pode imprimir a lista oficial ou usar um aplicativo próprio contendo: nome completo e matrícula (para alunos), ou nome completo, CPF e e-mail (para comunidade externa).
            </p>
            <a
              href="https://drive.google.com/file/d/17F3PHj51SHSfDPXngMrC-NuvANVrpoJx/view?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider"
            >
              <span>Acessar Lista de Frequência Extensão</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Item 2: Relatório Pós-Evento */}
          <div className="p-4 bg-brand/5 border border-brand/10 rounded-xl space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-brand">
              Relatório Pós-Evento
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Após o término do evento, é obrigatório preencher o relatório contendo a lista de presença final e fotos/imagens capturadas do evento.
            </p>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSewKe3glEo94aZZ4DlVH8s-w4X1NykKBoWgWDxAPyvXI0FHZA/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider"
            >
              <span>Preencher Relatório Pós-Evento</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Dúvidas Pró-Comunidade */}
          <div className="flex items-start space-x-2 text-[11px] text-gray-400 font-medium">
            <Info className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
            <span>Em caso de dúvidas sobre a lista de presença, entre em contato diretamente com o NASCE - Pró-Comunidade.</span>
          </div>

        </div>
      </div>
    </div>
  );
}
