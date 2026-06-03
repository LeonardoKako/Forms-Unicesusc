import { Palette, Info } from "lucide-react";
import { useFormContext } from "react-hook-form";
import ToggleGroup from "../../../../components/ToggleGroup";
import InputField from "../../../../components/InputField";

export default function ArtworkCard() {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const needsArtwork = watch("needsArtwork");
  const hasPrintedArtwork = watch("hasPrintedArtwork");

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
            if (val !== "sim") {
              setValue("artworkDescription", "");
              setValue("hasPrintedArtwork", false, { shouldValidate: true });
            }
          }}
          options={[
            { value: "sim", label: "Sim" },
            { value: "nao", label: "Não" }
          ]}
          error={errors.needsArtwork?.message as string}
        />

        {needsArtwork && (
          <div className="animate-fadeIn space-y-5">
            {/* Checkbox para Peça Impressa */}
            <div className="p-4 bg-gray-50 border border-gray-150 rounded-xl space-y-3">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("hasPrintedArtwork")}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setValue("hasPrintedArtwork", isChecked, { shouldValidate: true, shouldDirty: true });
                    if (isChecked) {
                      setValue("needsBudget", true, { shouldValidate: true, shouldDirty: true });
                    }
                  }}
                  className="mt-1 h-4.5 w-4.5 rounded border-gray-300 text-primary focus:ring-primary/20 accent-primary"
                />
                <div className="select-none">
                  <span className="text-sm text-brand font-bold block leading-none mb-1">
                    Solicitar Peça Impressa (Ex: Banner, Panfleto)
                  </span>
                  <span className="text-xs text-gray-400">
                    Marque apenas se houver necessidade de impressão física do material.
                  </span>
                </div>
              </label>
              {errors.hasPrintedArtwork && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.hasPrintedArtwork.message as string}
                </p>
              )}
            </div>

            {hasPrintedArtwork && (
              <div className="flex items-start space-x-2 text-xs text-amber-600 font-semibold bg-amber-50/50 p-3.5 rounded-xl border border-amber-200/50 animate-fadeIn">
                <Info className="h-4.5 w-4.5 shrink-0 text-amber-500 mt-0.5" />
                <span>Atenção: A solicitação de artes físicas/impressas exige obrigatoriamente orçamento para o evento. O orçamento será marcado como &quot;Sim&quot; de forma automática.</span>
              </div>
            )}

            <InputField
              {...register("artworkDescription")}
              label="Descrição da Arte"
              as="textarea"
              placeholder="Ex: Story para Instagram (digital), Banner impresso 2x1m (impresso)..."
              required
              error={errors.artworkDescription?.message as string}
            />
          </div>
        )}
      </div>
    </div>
  );
}
