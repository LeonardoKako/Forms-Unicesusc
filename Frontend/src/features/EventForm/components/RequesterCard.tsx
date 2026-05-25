import { useFormContext, Controller } from "react-hook-form";
import { User, BookOpen, Info, Phone, FileCheck, Building } from "lucide-react";
import InputField from "../../../components/InputField";
import ToggleGroup from "../../../components/ToggleGroup";
import { EventFormData } from "../schema";

export default function RequesterCard() {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<EventFormData>();

  // Watch requesterType for dynamic field labelling
  const requesterType = watch("requesterType");
  const isPartnerEvent = watch("isPartnerEvent");

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

      <div className='space-y-6'>
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
                { value: "locacao", label: "Locação" },
              ]}
            />
          )}
        />

        {/* Renderização Condicional baseada no Tipo */}
        {requesterType === "locacao" ? (
          <div className="space-y-5 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                {...register("requesterName")}
                label='Nome do Responsável'
                placeholder='Ex: João da Silva'
                error={errors.requesterName?.message}
                required
                icon={<User className='h-4 w-4' />}
              />
              <InputField
                {...register("requesterPhone")}
                label='Telefone / Celular'
                placeholder='Ex: (48) 99999-9999'
                error={errors.requesterPhone?.message}
                required
                icon={<Phone className='h-4 w-4' />}
              />
            </div>
            
            <InputField
              {...register("requesterEmail")}
              label='E-mail de Contato'
              type='email'
              placeholder='Ex: joao@empresa.com.br'
              error={errors.requesterEmail?.message}
              required
              icon={<BookOpen className='h-4 w-4' />}
            />

            {/* Aval do Administrativo (File Upload) */}
            <div className="flex flex-col space-y-2 mt-4">
              <label className="text-[13px] font-extrabold uppercase tracking-wide text-brand">
                Confirmação do Administrativo <span className="text-primary">*</span>
              </label>
              <div className="flex items-center justify-center w-full">
                <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${errors.adminApprovalFile ? 'border-red-300 bg-red-50/50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}>
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FileCheck className="w-8 h-8 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Clique para anexar a confirmação</span> ou arraste
                    </p>
                    <p className="text-xs text-gray-500">PDF, JPG, PNG (MAX. 10MB)</p>
                  </div>
                  <input type="file" className="hidden" accept=".pdf,image/*" {...register("adminApprovalFile")} />
                </label>
              </div>
              {errors.adminApprovalFile && (
                <p className="text-xs text-red-600 font-medium animate-fadeIn">
                  {errors.adminApprovalFile.message as string}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-5 animate-fadeIn">
            {/* Comunidade Interna */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                {...register("requesterName")}
                label='Nome do Responsável Unicesusc'
                placeholder='Ex: Prof. Dr. Leonardo Silva'
                error={errors.requesterName?.message}
                required
                icon={<User className='h-4 w-4' />}
              />
              <InputField
                {...register("requesterPhone")}
                label='Telefone / Celular (Unicesusc)'
                placeholder='Ex: (48) 99999-9999'
                error={errors.requesterPhone?.message}
                required
                icon={<Phone className='h-4 w-4' />}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                {...register("requesterEmail")}
                label='E-mail Institucional'
                type='email'
                placeholder='Ex: leonardo.silva@cesusc.edu.br'
                error={errors.requesterEmail?.message}
                required
                icon={<BookOpen className='h-4 w-4' />}
              />
              <InputField
                {...register("requesterDepartment")}
                label='Setor, Coordenação ou Curso'
                placeholder='Ex: Coordenação de Engenharia'
                error={errors.requesterDepartment?.message}
                required
                icon={<Info className='h-4 w-4' />}
              />
            </div>

            {/* Evento Parceiro */}
            <div className="pt-4 border-t border-gray-100">
              <ToggleGroup
                label="Este é um evento parceiro?"
                value={isPartnerEvent ? "sim" : "nao"}
                onChange={(val) => {
                  setValue("isPartnerEvent", val === "sim", { shouldValidate: true, shouldDirty: true });
                }}
                options={[
                  { value: "nao", label: "Não" },
                  { value: "sim", label: "Sim" },
                ]}
              />

              {isPartnerEvent && (
                <div className="mt-5 space-y-5 bg-brand/5 p-5 rounded-xl border border-brand/10 animate-fadeIn">
                  <div className="flex items-start space-x-2 text-sm text-amber-700 bg-amber-100/50 p-3 rounded-lg border border-amber-200">
                    <Info className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
                    <p className="font-medium">
                      Atenção: O responsável Unicesusc deve estar presente no evento e acompanhar todas as atividades, mesmo sendo um evento parceiro.
                    </p>
                  </div>

                  <h3 className="font-bold text-sm text-brand uppercase tracking-wider mb-2">
                    Dados do Parceiro
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      {...register("partnerName")}
                      label='Nome do Parceiro'
                      placeholder='Ex: Maria Souza'
                      error={errors.partnerName?.message}
                      required
                      icon={<User className='h-4 w-4' />}
                    />
                    <InputField
                      {...register("partnerPhone")}
                      label='Telefone / Celular'
                      placeholder='Ex: (48) 98888-8888'
                      error={errors.partnerPhone?.message}
                      required
                      icon={<Phone className='h-4 w-4' />}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      {...register("partnerEmail")}
                      label='E-mail do Parceiro'
                      type='email'
                      placeholder='Ex: maria@empresa.com.br'
                      error={errors.partnerEmail?.message}
                      required
                      icon={<BookOpen className='h-4 w-4' />}
                    />
                    <InputField
                      {...register("partnerInstitution")}
                      label='Empresa / Instituição'
                      placeholder='Ex: Tech Solutions Ltda'
                      error={errors.partnerInstitution?.message}
                      required
                      icon={<Building className='h-4 w-4' />}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
