import { Palette } from "lucide-react";
import { useFormContext } from "react-hook-form";
import ToggleGroup from "../../../components/ToggleGroup";
import InputField from "../../../components/InputField";

export default function ArtworkCard() {
  const { watch, setValue, formState: { errors } } = useFormContext();
  const needsArtwork = watch("needsArtwork");

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md animate-fadeIn">
      {/* Header do Card */}
      <div className="flex items-center space-x-3 mb-6 pb-3 border-b border-gray-100">
        <div className="p-2 bg-brand/5 rounded-xl text-brand">
          <Palette className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-extrabold uppercase tracking-wide text-brand">
            Arte e Comunicação
          </h2>
          <p className="text-xs text-gray-400">
            Necessidade de artes para divulgação
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <ToggleGroup
          label="Gostaria de solicitar arte para divulgação?"
          value={needsArtwork ? "sim" : "nao"}
          onChange={(val) => {
            setValue("needsArtwork", val === "sim", { shouldValidate: true, shouldDirty: true });
            if (val === "nao") {
              setValue("artworkDescription", "");
            }
          }}
          options={[
            { value: "sim", label: "Sim" },
            { value: "nao", label: "Não" }
          ]}
          error={errors.needsArtwork?.message as string}
        />

        {needsArtwork && (
          <div className="animate-fadeIn">
            <InputField
              label="Descrição da Arte"
              name="artworkDescription"
              type="textarea"
              placeholder="Ex: Story para Instagram, Publicação no Feed, Banner 2x1m..."
              required
            />
          </div>
        )}
      </div>
    </div>
  );
}
