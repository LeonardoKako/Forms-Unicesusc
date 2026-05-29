import { User, Phone, BookOpen, Info } from "lucide-react";
import InputField from "../../../components/InputField";
import { useFormContext } from "react-hook-form";

interface RequesterCardProps {
  isLocationForm?: boolean;
}

export default function RequesterCard({ isLocationForm = false }: RequesterCardProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

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
            Informações sobre o responsável pelo agendamento
          </p>
        </div>
      </div>

      <div className='space-y-6'>
        {isLocationForm ? (
          <div className='space-y-4 animate-fadeIn'>
            {/* Campos Simplificados para Locação */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <InputField
                {...register("requesterName")}
                label='Nome do Responsável / Empresa'
                placeholder='Ex: ACME Corporation'
                required
                error={errors.requesterName?.message as string}
                icon={<User className='h-4 w-4' />}
              />
              <InputField
                {...register("requesterPhone")}
                label='Telefone de Contato'
                placeholder='(48) 99999-9999'
                required
                error={errors.requesterPhone?.message as string}
                icon={<Phone className='h-4 w-4' />}
              />
            </div>

            <InputField
              {...register("requesterEmail")}
              label='E-mail de Contato'
              type='email'
              placeholder='Ex: financeiro@empresa.com'
              required
              error={errors.requesterEmail?.message as string}
              icon={<BookOpen className='h-4 w-4' />}
            />

            {/* Alerta de validação do administrativo */}
            <div className="flex items-start space-x-2 text-xs text-brand bg-brand/5 p-3.5 rounded-xl border border-brand/10 animate-fadeIn mt-2">
              <Info className="h-4.5 w-4.5 shrink-0 text-brand mt-0.5" />
              <span className="leading-relaxed font-medium">
                <strong>Atenção:</strong> Todas as solicitações de locação externa deverão ser validadas previamente pelo e-mail administrativo oficial: <strong className="text-primary">gestor.campus@unicesusc.edu.br</strong>.
              </span>
            </div>
          </div>
        ) : (
          <div className='space-y-5 animate-fadeIn'>
            {/* Comunidade Interna */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <InputField
                {...register("requesterName")}
                label='Nome do Responsável Unicesusc'
                placeholder='Ex: Prof. Dr. Leonardo Silva'
                error={errors.requesterName?.message as string}
                required
                icon={<User className='h-4 w-4' />}
              />
              <InputField
                {...register("requesterPhone")}
                label='Telefone / Celular (Unicesusc)'
                placeholder='Ex: (48) 99999-9999'
                error={errors.requesterPhone?.message as string}
                required
                icon={<Phone className='h-4 w-4' />}
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <InputField
                {...register("requesterEmail")}
                label='E-mail Institucional'
                type='email'
                placeholder='Ex: leonardo.silva@unicesusc.edu.br'
                error={errors.requesterEmail?.message as string}
                required
                icon={<BookOpen className='h-4 w-4' />}
              />
              <InputField
                {...register("requesterDepartment")}
                label='Setor, Coordenação ou Curso'
                placeholder='Ex: Coordenação de Engenharia'
                error={errors.requesterDepartment?.message as string}
                required
                icon={<BookOpen className='h-4 w-4' />}
              />
            </div>

            {/* Evento Parceiro */}
            <div className='pt-4 border-t border-gray-100'>
              <div className='flex items-center space-x-3 mb-4'>
                <input
                  type='checkbox'
                  id='isPartnerEvent'
                  {...register("isPartnerEvent")}
                  className='h-4.5 w-4.5 rounded border-gray-300 text-primary focus:ring-primary/20 accent-primary cursor-pointer'
                />
                <label htmlFor='isPartnerEvent' className='text-sm font-semibold text-gray-700 cursor-pointer select-none'>
                  Este é um evento parceiro?
                </label>
              </div>

              {isPartnerEvent && (
                <div className='mt-5 space-y-5 bg-brand/5 p-5 rounded-xl border border-brand/10 animate-fadeIn'>
                  <div className='flex items-start space-x-2 text-sm text-amber-700 bg-amber-100/50 p-3 rounded-lg border border-amber-200'>
                    <p className='font-medium'>
                      Atenção: O responsável Unicesusc deve estar presente no
                      evento e acompanhar todas as atividades, mesmo sendo um
                      evento parceiro.
                    </p>
                  </div>

                  <h3 className='font-bold text-sm text-brand uppercase tracking-wider mb-2'>
                    Dados do Parceiro
                  </h3>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <InputField
                      {...register("partnerName")}
                      label='Nome do Parceiro'
                      placeholder='Ex: Maria Souza'
                      error={errors.partnerName?.message as string}
                      required
                      icon={<User className='h-4 w-4' />}
                    />
                    <InputField
                      {...register("partnerPhone")}
                      label='Telefone / Celular'
                      placeholder='Ex: (48) 98888-8888'
                      error={errors.partnerPhone?.message as string}
                      required
                      icon={<Phone className='h-4 w-4' />}
                    />
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <InputField
                      {...register("partnerEmail")}
                      label='E-mail do Parceiro'
                      type='email'
                      placeholder='Ex: maria@empresa.com.br'
                      error={errors.partnerEmail?.message as string}
                      required
                      icon={<BookOpen className='h-4 w-4' />}
                    />
                    <InputField
                      {...register("partnerInstitution")}
                      label='Empresa / Instituição'
                      placeholder='Ex: Tech Solutions Ltda'
                      error={errors.partnerInstitution?.message as string}
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

// Pequeno mock de componente de ícone para evitar quebras se não importado
import { Building } from "lucide-react";
