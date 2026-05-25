import { FileUp } from "lucide-react";
import CheckboxGrid from "./CheckboxGrid";
import { PRESENTATION_MATERIAL_OPTIONS } from "../mockData";
import { useFormContext } from "react-hook-form";

export default function PresentationMaterialCard() {
  const { register } = useFormContext();

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md animate-fadeIn">
      {/* Header do Card */}
      <div className="flex items-center space-x-3 mb-6 pb-3 border-b border-gray-100">
        <div className="p-2 bg-brand/5 rounded-xl text-brand">
          <FileUp className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-extrabold uppercase tracking-wide text-brand">
            Material de Apresentação
          </h2>
          <p className="text-xs text-gray-400">
            Arquivos e mídias para o evento
          </p>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Envio de Arquivos (Opcional)
        </label>
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FileUp className="w-8 h-8 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Clique para enviar</span> ou arraste e solte
              </p>
              <p className="text-xs text-gray-500">PDF, PPT, MP4 (MAX. 50MB)</p>
            </div>
            <input type="file" className="hidden" multiple {...register("presentationFiles")} />
          </label>
        </div>
      </div>

      <CheckboxGrid
        name="presentationMaterials"
        options={PRESENTATION_MATERIAL_OPTIONS}
        withCardWrapper={false}
      />
    </div>
  );
}
