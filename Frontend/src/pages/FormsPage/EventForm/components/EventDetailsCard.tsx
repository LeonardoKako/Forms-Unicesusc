import { useFormContext } from "react-hook-form";
import { Sparkles, User } from "lucide-react";
import InputField from "../../../../components/InputField";
import CheckboxGrid from "./CheckboxGrid";
import { TARGET_AUDIENCE_OPTIONS } from "../mockData";
import { EventFormData } from "../schema";

export default function EventDetailsCard() {
  const {
    register,
    formState: { errors },
  } = useFormContext<EventFormData>();

  return (
    <div className='bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md'>
      {/* Header do Card */}
      <div className='flex items-center space-x-3 mb-6 pb-3 border-b border-gray-100'>
        <div className='p-2 bg-brand/5 rounded-xl text-brand'>
          <Sparkles className='h-5 w-5' />
        </div>
        <div>
          <h2 className='text-base font-extrabold uppercase tracking-wide text-brand'>
            Detalhes do Evento
          </h2>
          <p className='text-xs text-gray-400'>
            Informações gerais e objetivos do encontro
          </p>
        </div>
      </div>

      <div className='space-y-5'>
        {/* Título do Evento */}
        <InputField
          {...register("eventTitle")}
          label='Título do Evento'
          placeholder='Ex: I Simpósio de Tecnologia da Informação da Unicesusc'
          error={errors.eventTitle?.message}
          required
          icon={<Sparkles className='h-4 w-4' />}
        />

        {/* Tipo de Evento e Público Estimado */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <InputField
            {...register("eventType")}
            as='select'
            label='Tipo de Evento'
            error={errors.eventType?.message}
            required
            options={[
              { value: "", label: "Selecione uma opção..." },
              { value: "palestra", label: "Palestra / Painel" },
              { value: "workshop", label: "Workshop / Oficina" },
              { value: "reuniao", label: "Reunião Acadêmica" },
              { value: "banca", label: "Defesa de TCC / Banca" },
              { value: "outro", label: "Outro Evento" },
            ]}
          />

          <InputField
            {...register("estimatedPublic")}
            type='number'
            label='Público Estimado'
            placeholder='Ex: 50'
            error={errors.estimatedPublic?.message}
            required
            icon={<User className='h-4 w-4' />}
          />
        </div>

        {/* Público Alvo */}
        <div className='bg-gray-50/50 p-4.5 rounded-xl border border-gray-100'>
          <CheckboxGrid
            name='targetAudience'
            label='Público Alvo'
            options={TARGET_AUDIENCE_OPTIONS}
            withCardWrapper={false}
          />
        </div>

        {/* Descrição do Evento */}
        <InputField
          {...register("eventDescription")}
          as='textarea'
          label='Resumo e Finalidade do Evento'
          placeholder='Descreva brevemente as atividades, cronograma resumido ou requisitos específicos do evento...'
          error={errors.eventDescription?.message}
          required
        />
      </div>
    </div>
  );
}
