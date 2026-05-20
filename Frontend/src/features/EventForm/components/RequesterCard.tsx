import { useFormContext, Controller } from "react-hook-form";
import { User, BookOpen, Info } from "lucide-react";
import InputField from "../../../components/InputField";
import ToggleGroup from "../../../components/ToggleGroup";
import { EventFormData } from "../schema";

export default function RequesterCard() {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<EventFormData>();

  // Watch requesterType for dynamic field labelling
  const requesterType = watch("requesterType");

  return (
    <div className='bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md'>
      {/* Header do Card */}
      <div className='flex items-center space-x-3 mb-6 pb-3 border-b border-gray-100'>
        <div className='p-2 bg-brand/5 rounded-xl text-brand'>
          <User className='h-5 w-5' />
        </div>
        <div>
          <h2 className='text-base font-extrabold uppercase tracking-wide text-brand'>
            Identificação do Solicitante
          </h2>
          <p className='text-xs text-gray-400'>
            Quem está agendando este espaço acadêmico
          </p>
        </div>
      </div>

      <div className='space-y-5'>
        {/* ToggleGroup - Vínculo Acadêmico */}
        <Controller
          name='requesterType'
          control={control}
          render={({ field }) => (
            <ToggleGroup
              label='Tipo de Vínculo'
              value={field.value}
              onChange={field.onChange}
              error={errors.requesterType?.message}
              required
              options={[
                { value: "interno", label: "Comunidade Interna" },
                { value: "externo", label: "Comunidade Externa" },
              ]}
            />
          )}
        />

        {/* Input Nome */}
        <InputField
          {...register("requesterName")}
          label='Nome do Solicitante / Responsável'
          placeholder='Ex: Prof. Dr. Leonardo Silva'
          error={errors.requesterName?.message}
          required
          icon={<User className='h-4 w-4' />}
        />

        {/* Input Email */}
        <InputField
          {...register("requesterEmail")}
          label='E-mail de Contato'
          type='email'
          placeholder='Ex: leonardo.silva@cesusc.edu.br'
          error={errors.requesterEmail?.message}
          required
          icon={<BookOpen className='h-4 w-4' />}
        />

        {/* Input Setor / Curso ou Empresa Externa */}
        <InputField
          {...register("requesterDepartment")}
          label={
            requesterType === "interno"
              ? "Setor, Coordenação ou Curso"
              : "Instituição ou Empresa Externa"
          }
          placeholder={
            requesterType === "interno"
              ? "Ex: Coordenação de Engenharia"
              : "Ex: Fundação Cultural Sul"
          }
          error={errors.requesterDepartment?.message}
          required
          icon={<Info className='h-4 w-4' />}
        />
      </div>
    </div>
  );
}
