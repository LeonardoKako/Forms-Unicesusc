import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Coffee, Info, DollarSign } from "lucide-react";

export default function CoffeeBreakCard() {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const coffeeBreak = watch("coffeeBreak") || "nao_se_aplica";
  const hasPlan = coffeeBreak !== "nao_se_aplica";

  // Automatização de Orçamento se selecionar um plano
  useEffect(() => {
    if (hasPlan) {
      setValue("needsBudget", true, { shouldValidate: true, shouldDirty: true });
    }
  }, [hasPlan, setValue]);

  // Função auxiliar para retornar itens de cada plano
  const getPlanDetails = (plan: string) => {
    switch (plan) {
      case "padrao_100":
        return [
          "2 sucos",
          "1 cento de salgados fritos",
          "1 cento de salgados assados",
          "1,5 bolo de cenoura com cobertura",
          "2 térmicas de café"
        ];
      case "padrao_288":
        return [
          "2,5 centos de salgados assados",
          "2,5 centos de salgados fritos",
          "2 kg de bolo de cenoura com cobertura",
          "2 sucos de 5 litros",
          "2 térmicas de café"
        ];
      case "biscoitos_100":
        return [
          "2 térmicas de café",
          "14 pacotes de Club Social",
          "9 pacotes de Folhado Doce",
          "9 pacotes de Rosquinhas"
        ];
      default:
        return [];
    }
  };

  const planDetails = getPlanDetails(coffeeBreak);

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
            Planos estruturados de alimentação
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Observações Gerais (Badge Premium superior) */}
        <div className="flex items-start space-x-2.5 text-xs text-brand bg-brand/5 p-4 rounded-xl border border-brand/10">
          <Info className="h-4.5 w-4.5 shrink-0 text-primary mt-0.5" />
          <span className="leading-relaxed">
            <strong>Observações gerais:</strong> As 2 térmicas de café acompanham suporte com copos, mexedores, açúcar e guardanapos, 1 mesa com toalha preta e utensílios.
          </span>
        </div>

        {/* Dropdown de Planos */}
        <div className="space-y-1.5">
          <label className="block text-[13px] font-extrabold uppercase tracking-wide text-brand">
            Selecione o Plano de Coffee Break
          </label>
          <select
            {...register("coffeeBreak")}
            className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all cursor-pointer bg-white"
          >
            <option value="nao_se_aplica">Não será preciso/não se aplica</option>
            <option value="padrao_100">Coffee Break Padrão – até 100 pessoas</option>
            <option value="padrao_288">Coffee Break Padrão – até 288 pessoas</option>
            <option value="biscoitos_100">Coffee Break Biscoitos – até 100 pessoas</option>
          </select>
          {errors.coffeeBreak && (
            <p className="text-xs text-red-600 font-medium">
              {errors.coffeeBreak.message as string}
            </p>
          )}
        </div>

        {/* Lista de itens inclusos dinamicamente */}
        {hasPlan && planDetails.length > 0 && (
          <div className="bg-gray-50 border border-gray-150 rounded-2xl p-4.5 space-y-3 animate-fadeIn">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand">
              ☕ Itens Inclusos no Pacote:
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600 list-disc list-inside">
              {planDetails.map((item, idx) => (
                <li key={idx} className="font-semibold text-gray-700">
                  {item}
                </li>
              ))}
            </ul>

            {/* Aviso de Orçamento Automático */}
            <div className="flex items-start space-x-2 text-[11px] text-amber-700 bg-amber-50 border border-amber-200/50 p-3 rounded-xl mt-2">
              <DollarSign className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
              <span>A solicitação de Coffee Break exige obrigatoriamente orçamento aprovado para o evento. O orçamento será marcado como <strong>&quot;Sim&quot;</strong> automaticamente.</span>
            </div>
          </div>
        )}

        {/* Observações Extras do Coffee (Campo de texto Opcional) */}
        <div className="space-y-1.5 animate-fadeIn">
          <label className="text-[13px] font-extrabold uppercase tracking-wide text-brand block">
            Observações Extras de Alimentação (Opcional)
          </label>
          <textarea
            {...register("coffeeNotes")}
            placeholder="Ex: Informar restrições alimentares, solicitações especiais, ou alguma alteração no cardápio..."
            rows={3}
            className="w-full p-4 rounded-xl border border-gray-200 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all resize-none"
          />
        </div>
      </div>
    </div>
  );
}
