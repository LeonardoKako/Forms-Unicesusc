import { Cpu } from "lucide-react";
import CheckboxGrid from "./CheckboxGrid";
import { TI_EQUIPMENT_OPTIONS } from "../mockData";

export default function TIEquipmentCard() {
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
      />
    </div>
  );
}
