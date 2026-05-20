import { Users } from "lucide-react";
import CheckboxGrid from "./CheckboxGrid";
import { SUPPORT_TEAMS_OPTIONS } from "../mockData";

export default function SupportTeamsCard() {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md animate-fadeIn">
      {/* Header do Card */}
      <div className="flex items-center space-x-3 mb-6 pb-3 border-b border-gray-100">
        <div className="p-2 bg-brand/5 rounded-xl text-brand">
          <Users className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-extrabold uppercase tracking-wide text-brand">
            Equipes de Apoio
          </h2>
          <p className="text-xs text-gray-400">
            Setores acionados para a realização do evento
          </p>
        </div>
      </div>

      <CheckboxGrid
        name="supportTeams"
        options={SUPPORT_TEAMS_OPTIONS}
        columns={3}
        withCardWrapper={false}
      />
    </div>
  );
}
