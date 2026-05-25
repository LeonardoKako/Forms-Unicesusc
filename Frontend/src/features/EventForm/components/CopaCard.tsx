import { CupSoda } from "lucide-react";
import CheckboxGrid from "./CheckboxGrid";
import { COPA_OPTIONS } from "../mockData";

export default function CopaCard() {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md animate-fadeIn">
      {/* Header do Card */}
      <div className="flex items-center space-x-3 mb-6 pb-3 border-b border-gray-100">
        <div className="p-2 bg-brand/5 rounded-xl text-brand">
          <CupSoda className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-extrabold uppercase tracking-wide text-brand">
            Copa
          </h2>
          <p className="text-xs text-gray-400">
            Utensílios e materiais
          </p>
        </div>
      </div>

      <CheckboxGrid
        name="copa"
        options={COPA_OPTIONS}
        columns={3}
        withCardWrapper={false}
      />
    </div>
  );
}
