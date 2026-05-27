import { FileUp, Link } from "lucide-react";
import CheckboxGrid from "./CheckboxGrid";
import { PRESENTATION_MATERIAL_OPTIONS } from "../mockData";
import { useFormContext } from "react-hook-form";
import InputField from "../../../components/InputField";

export default function PresentationMaterialCard() {
  const { register, watch, formState: { errors } } = useFormContext();
  const presentationMaterials = watch("presentationMaterials") || [];
  const showDriveInput = presentationMaterials.includes("google_drive_link");

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

      <CheckboxGrid
        name="presentationMaterials"
        options={PRESENTATION_MATERIAL_OPTIONS}
        withCardWrapper={false}
      />

      {showDriveInput && (
        <div className="mt-4 animate-fadeIn">
          <InputField
            {...register("presentationDriveLink")}
            label="Link do Google Drive"
            type="url"
            placeholder="https://drive.google.com/..."
            required
            icon={<Link className="h-4 w-4" />}
            error={errors.presentationDriveLink?.message as string}
          />
        </div>
      )}
    </div>
  );
}
