import { CupSoda } from "lucide-react";
import { useFormContext } from "react-hook-form";
import CheckboxGrid from "./CheckboxGrid";
import { COPA_OPTIONS } from "../mockData";

export default function CopaCard() {
  const {
    watch,
    register,
    formState: { errors },
  } = useFormContext();
  const selectedCopa = watch("copa") || [];
  const showOtherInput = selectedCopa.includes("outro");

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
      >
        {showOtherInput && (
          <div className="mt-4 p-4 bg-gray-50 border border-gray-100 rounded-xl space-y-2 animate-slideDown">
            <label className="block text-xs font-bold uppercase tracking-wider text-brand">
              Descreva os outros itens e quantidades:
            </label>
            <input
              type="text"
              {...register("otherCopaDescription")}
              placeholder="Ex: 3 jarras adicionais, talheres específicos..."
              className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
            />
            {errors.otherCopaDescription && (
              <p className="text-xs text-red-600 font-medium">
                {errors.otherCopaDescription.message as string}
              </p>
            )}
          </div>
        )}
      </CheckboxGrid>
    </div>
  );
}
