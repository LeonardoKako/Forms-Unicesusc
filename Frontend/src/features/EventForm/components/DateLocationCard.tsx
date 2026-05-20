import { useFormContext, Controller } from "react-hook-form";
import { Calendar, MapPin, Clock, DollarSign, Mail, Info } from "lucide-react";
import InputField from "../../../components/InputField";
import ToggleGroup from "../../../components/ToggleGroup";
import { ROOM_OPTIONS } from "../mockData";
import { EventFormData } from "../schema";

export default function DateLocationCard() {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<EventFormData>();

  // Watch selectedRoom for dynamic details display
  const selectedRoom = watch("selectedRoom");
  const roomDetails = ROOM_OPTIONS.find((r) => r.value === selectedRoom);

  // Watch needsBudget and startTime to calculate rules and restrictions
  const needsBudget = watch("needsBudget");
  const startTime = watch("startTime");

  // Calculate dynamic minimum date string (YYYY-MM-DD) based on needsBudget Selection
  const getMinDateStr = () => {
    if (needsBudget === undefined) return undefined;
    const today = new Date();
    // Prazo mínimo: 15 dias se necessita de orçamento, 7 dias caso contrário
    const minDays = needsBudget ? 15 : 7;
    today.setDate(today.getDate() + minDays);

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const minDateStr = getMinDateStr();
  const isDateDisabled = needsBudget === undefined;
  const isEndTimeDisabled = !startTime;

  return (
    <div className='bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md'>
      {/* Header do Card */}
      <div className='flex items-center space-x-3 mb-6 pb-3 border-b border-gray-100'>
        <div className='p-2 bg-brand/5 rounded-xl text-brand'>
          <Calendar className='h-5 w-5' />
        </div>
        <div>
          <h2 className='text-base font-extrabold uppercase tracking-wide text-brand'>
            Orçamento, Data e Local
          </h2>
          <p className='text-xs text-gray-400'>
            Necessidade financeira e cronograma do evento
          </p>
        </div>
      </div>

      <div className='space-y-5'>
        {/* Pergunta de Orçamento / Fomento (Movido para cá para UX perfeita) */}
        <div>
          <Controller
            name='needsBudget'
            control={control}
            render={({ field }) => (
              <ToggleGroup
                label='Este evento necessita de orçamento?'
                value={
                  field.value === true
                    ? "sim"
                    : field.value === false
                      ? "nao"
                      : ""
                }
                onChange={(val) => field.onChange(val === "sim")}
                error={errors.needsBudget?.message}
                required
                options={[
                  { value: "nao", label: "Não necessita" },
                  { value: "sim", label: "Sim, necessita" },
                ]}
              />
            )}
          />
        </div>

        {/* Bloco de Orçamento Condicional */}
        {needsBudget === true && (
          <div className='bg-brand/5 border border-brand/10 rounded-2xl p-4.5 space-y-4 animate-fadeIn'>
            <div className='flex items-center space-x-2 text-brand'>
              <DollarSign className='h-5 w-5 text-primary animate-pulse' />
              <span className='font-extrabold text-xs uppercase tracking-wider'>
                Detalhamento Financeiro
              </span>
            </div>

            {/* Descrição da Necessidade de Orçamento */}
            <InputField
              {...register("budgetDescription")}
              as='textarea'
              label='Descrição e Justificativa de Orçamento'
              placeholder='Descreva detalhadamente o que será necessário custear (ex: coffee break, palestrante, material de apoio)...'
              error={errors.budgetDescription?.message}
              required
            />

            {/* Menu Dropdown de E-mail de Notificação (Selecionado e não alterável) */}
            <InputField
              {...register("budgetEmail")}
              as='select'
              label='E-mail de Notificação do Setor Responsável'
              disabled
              required
              icon={<Mail className='h-4 w-4' />}
              options={[
                {
                  value: "financeiro@unicesusc.edu.br",
                  label: "financeiro@unicesusc.edu.br",
                },
              ]}
            />

            <p className='text-[9px] text-gray-400 leading-normal italic'>
              * O departamento financeiro será notificado de forma imediata e
              automática com este extrato de fomento.
            </p>
          </div>
        )}

        {/* Separador de Seção */}
        <div className='border-t border-gray-100/80 my-3'></div>

        {/* Data do Evento (Desabilitada até o orçamento ser respondido) */}
        <div className='relative'>
          <InputField
            {...register("eventDate")}
            type='date'
            label='Data do Evento'
            error={errors.eventDate?.message}
            required
            disabled={isDateDisabled}
            min={isDateDisabled ? undefined : minDateStr}
            icon={<Calendar className='h-4 w-4' />}
            className={isDateDisabled ? "bg-gray-50/50 border-dashed" : ""}
          />
        </div>

        {/* Aviso ou prazo da Data com base na seleção de orçamento */}
        {isDateDisabled ? (
          <div className='flex items-center space-x-2 text-xs text-amber-600 font-semibold bg-amber-50/50 p-3.5 rounded-xl border border-amber-200/50 animate-pulse'>
            <Info className='h-4 w-4 shrink-0 text-amber-500' />
            <span>
              Selecione a opção de orçamento acima para liberar o calendário.
            </span>
          </div>
        ) : (
          <p className='text-[10px] text-gray-400 leading-normal italic mt-[-8px] animate-fadeIn'>
            * Prazo para agendamento: no mínimo{" "}
            <strong>{needsBudget ? "15 dias" : "7 dias"}</strong> de
            antecedência ({needsBudget ? "exige fomento" : "sem orçamento"}).
          </p>
        )}

        {/* Horários de Início e Término */}
        <div className='grid grid-cols-2 gap-4'>
          <InputField
            {...register("startTime")}
            type='time'
            label='Hora Início'
            error={errors.startTime?.message}
            required
          />

          <InputField
            {...register("endTime")}
            type='time'
            label='Hora Término'
            error={errors.endTime?.message}
            required
            disabled={isEndTimeDisabled}
            placeholder={isEndTimeDisabled ? "Aguardando..." : ""}
            className={isEndTimeDisabled ? "bg-gray-50/50 border-dashed" : ""}
          />
        </div>

        {isEndTimeDisabled && (
          <div className='flex items-center space-x-1.5 text-[10px] text-amber-600 font-medium animate-fadeIn'>
            <Clock className='h-3.5 w-3.5' />
            <span>
              Defina o horário de início para habilitar o término do evento.
            </span>
          </div>
        )}

        {/* Espaço Solicitado */}
        <InputField
          {...register("selectedRoom")}
          as='select'
          label='Espaço Solicitado'
          error={errors.selectedRoom?.message}
          required
          options={[
            { value: "", label: "Escolha uma sala/auditório..." },
            ...ROOM_OPTIONS.map((room) => ({
              value: room.value,
              label: `${room.label} (Capacidade: ${room.capacity} pessoas)`,
            })),
          ]}
        />

        {/* Informações detalhadas do Espaço Selecionado */}
        {roomDetails && (
          <div className='bg-brand/5 border border-brand/10 rounded-xl p-4 text-xs text-brand leading-relaxed animate-fadeIn'>
            <div className='flex items-center space-x-1.5 font-bold uppercase tracking-wider mb-1'>
              <MapPin className='h-3.5 w-3.5 text-primary' />
              <span>Localização Física</span>
            </div>
            <p className='font-semibold text-gray-700'>
              {roomDetails.location}
            </p>
            <p className='text-gray-500 mt-0.5'>
              Capacidade homologada para segurança e prevenção contra incêndio
              de até {roomDetails.capacity} participantes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
