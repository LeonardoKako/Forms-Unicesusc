import { Box } from "lucide-react";
import CheckboxGrid from "./CheckboxGrid";
import { FURNITURE_SUPPORT_OPTIONS } from "../mockData";

export default function FurnitureSupportCard() {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md animate-fadeIn">
      {/* Header do Card */}
      <div className="flex items-center space-x-3 mb-6 pb-3 border-b border-gray-100">
        <div className="p-2 bg-brand/5 rounded-xl text-brand">
          <Box className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-extrabold uppercase tracking-wide text-brand">
            Móveis e Apoio
          </h2>
          <p className="text-xs text-gray-400">
            Cadeiras, mesas e estruturas extras
          </p>
        </div>
      </div>

      <CheckboxGrid
        name="furnitureSupport"
        options={FURNITURE_SUPPORT_OPTIONS}
        withCardWrapper={false}
      />
    </div>
  );
}
