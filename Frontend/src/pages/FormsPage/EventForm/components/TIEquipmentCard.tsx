import { useState } from "react";
import { Cpu, Info } from "lucide-react";
import CheckboxGrid from "./CheckboxGrid";
import { TI_EQUIPMENT_OPTIONS } from "../mockData";
import InfoModal from "../../../../components/InfoModal";
import telaoPequeno from "../../../../assets/images/telaoPequeno.png";
import telaoGrande from "../../../../assets/images/telaoGrande.png";

export default function TIEquipmentCard() {
  const [modalData, setModalData] = useState<{ isOpen: boolean; title: string; imageUrl: string } | null>(null);

  const handleInfoClick = (optionId: string) => {
    if (optionId === 'projetor_pequeno') {
      setModalData({
        isOpen: true,
        title: 'Projetor Pequeno',
        imageUrl: telaoPequeno // Placeholder, replace with actual
      });
    } else if (optionId === 'projetor_grande') {
      setModalData({
        isOpen: true,
        title: 'Projetor Grande',
        imageUrl: telaoGrande // Placeholder, replace with actual
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md animate-fadeIn">
      {/* Header do Card */}
      <div className="flex items-center space-x-3 mb-6 pb-3 border-b border-gray-100">
        <div className="p-2 bg-brand/5 rounded-xl text-brand">
          <Cpu className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-extrabold uppercase tracking-wide text-brand">
            Equipamentos de T.I.
          </h2>
          <p className="text-xs text-gray-400">
            Aparelhos e suporte tecnológico
          </p>
        </div>
      </div>

      <CheckboxGrid
        name="tiEquipment"
        options={TI_EQUIPMENT_OPTIONS}
        withCardWrapper={false}
        onInfoClick={handleInfoClick}
      >
        <div className='flex items-start space-x-2 text-sm text-amber-600 font-semibold bg-amber-50/50 p-3.5 rounded-xl border border-amber-200/50 mt-4'>
          <Info className='h-4 w-4 shrink-0 text-amber-500 mt-0.5' />
          <span className="leading-relaxed">
            A equipe de T.I. oferece suporte apenas para os equipamentos fornecidos ao solicitar o evento.
          </span>
        </div>
      </CheckboxGrid>

      {modalData && (
        <InfoModal
          isOpen={modalData.isOpen}
          onClose={() => setModalData(null)}
          title={modalData.title}
          type="image"
          imageUrl={modalData.imageUrl}
        />
      )}
    </div>
  );
}
