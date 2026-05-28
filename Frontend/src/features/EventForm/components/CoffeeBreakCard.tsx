import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Coffee, Info } from "lucide-react";
import CheckboxGrid from "./CheckboxGrid";
import { COFFEE_BREAK_OPTIONS } from "../mockData";

export default function CoffeeBreakCard() {
  const { watch, setValue, formState: { errors } } = useFormContext();
  const coffeeBreak = watch("coffeeBreak") || [];
  const hasItems = coffeeBreak.length > 0 && !coffeeBreak.includes("nao_se_aplica");

  useEffect(() => {
    if (hasItems) {
      setValue("needsBudget", true, { shouldValidate: true, shouldDirty: true });
    }
  }, [hasItems, setValue]);

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md animate-fadeIn">
      {/* Header do Card */}
      <div className="flex items-center space-x-3 mb-6 pb-3 border-b border-gray-100">
        <div className="p-2 bg-brand/5 rounded-xl text-brand">
          <Coffee className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-extrabold uppercase tracking-wide text-brand">
            Coffee Break
          </h2>
          <p className="text-xs text-gray-400">
            Necessidades de alimentação
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <CheckboxGrid
          name="coffeeBreak"
          options={COFFEE_BREAK_OPTIONS}
          columns={3}
          withCardWrapper={false}
        />

        {hasItems && (
          <div className="flex items-start space-x-2 text-xs text-amber-600 font-semibold bg-amber-50/50 p-3.5 rounded-xl border border-amber-200/50 animate-fadeIn">
            <Info className="h-4.5 w-4.5 shrink-0 text-amber-500 mt-0.5" />
            <span>Atenção: A solicitação de Coffee Break exige obrigatoriamente orçamento aprovado para o evento. O orçamento será marcado como &quot;Sim&quot; de forma automática.</span>
          </div>
        )}

        {errors.coffeeBreak && (
          <p className="text-xs text-red-600 font-medium animate-fadeIn">
            {errors.coffeeBreak.message as string}
          </p>
        )}
      </div>
    </div>
  );
}
