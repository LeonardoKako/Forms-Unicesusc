import { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { User, BookOpen, Info, Phone, FileCheck, Building } from "lucide-react";
import InputField from "../../../components/InputField";
import ToggleGroup from "../../../components/ToggleGroup";
import { EventFormData } from "../schema";

export default function RequesterCard() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<EventFormData>();

  // Watch requesterType for dynamic field labelling
  const requesterType = watch("requesterType");
  const isPartnerEvent = watch("isPartnerEvent");

  const prevRequesterTypeRef = useRef<string>("interno");

  // Transições de campos ao alternar entre interno e locação
  useEffect(() => {
    const prevType = prevRequesterTypeRef.current;
    if (prevType !== requesterType) {
      if (requesterType === "interno") {
        // Limpar todos os campos e estados ao ir para Comunidade Interna
        setValue("requesterName", "");
        setValue("requesterPhone", "");
        setValue("requesterEmail", "");
        setValue("requesterDepartment", "");
        setValue("isPartnerEvent", false);
        setValue("partnerName", "");
        setValue("partnerEmail", "");
        setValue("partnerPhone", "");
        setValue("partnerInstitution", "");
        setValue("adminApprovalFileUrl", undefined);
      } else if (requesterType === "locacao") {
        // Limpar campos de identificação e forçar o e-mail administrativo padrão
        setValue("requesterName", "");
        setValue("requesterPhone", "");
        setValue("requesterEmail", "gestor.campus@unicesusc.edu.br", {
          shouldValidate: true,
        });
        setValue("adminApprovalFileUrl", undefined);
      }
    }
    prevRequesterTypeRef.current = requesterType;
  }, [requesterType, setValue]);

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
        {/* Tipo de Solicitante */}
        <div>
          <label className='text-[13px] font-extrabold uppercase tracking-wide text-brand block mb-3.5'>
            Tipo de Solicitante
          </label>
          <div className='grid grid-cols-2 gap-4'>
            <label
              className={`
                flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300
                ${
                  requesterType === "interno"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50/50"
                }
              `}
            >
              <input
                type='radio'
                value='interno'
                {...register("requesterType")}
                className='sr-only'
              />
              <span className='font-extrabold text-sm uppercase tracking-wide'>
                Comunidade Interna
              </span>
              <span className='text-[10px] opacity-80 mt-1 font-medium'>
                Professores, coordenadores, setores
              </span>
            </label>

            <label
              className={`
                flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300
                ${
                  requesterType === "locacao"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50/50"
                }
              `}
            >
              <input
                type='radio'
                value='locacao'
                {...register("requesterType")}
                className='sr-only'
              />
              <span className='font-extrabold text-sm uppercase tracking-wide'>
                Locação Externa
              </span>
              <span className='text-[10px] opacity-80 mt-1 font-medium'>
                Eventos de terceiros e parcerias
              </span>
            </label>
          </div>
        </div>

        <div className='border-t border-gray-100 my-6'></div>

        {/* Renderização Condicional baseada no Tipo */}
        {requesterType === "locacao" ? (
          <div className='space-y-4 animate-fadeIn'>
            {/* Locação */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <InputField
                {...register("requesterName")}
                label='Nome do Responsável / Empresa'
                placeholder='Ex: ACME Corporation'
                required
                error={errors.requesterName?.message as string}
              />
              <InputField
                {...register("requesterPhone")}
                label='Telefone de Contato'
                placeholder='(48) 99999-9999'
                required
                error={errors.requesterPhone?.message as string}
              />
            </div>

            <InputField
              {...register("requesterEmail")}
              label='E-mail do Administrativo'
              placeholder='gestor.campus@unicesusc.edu.br'
              required
              disabled
              className='bg-gray-50/80 text-gray-500 font-medium cursor-not-allowed select-none border-gray-200'
              error={errors.requesterEmail?.message as string}
            />

            {/* Aval do Administrativo (File Upload) */}
            <div className='flex flex-col space-y-2 mt-4'>
              <label className='text-[13px] font-extrabold uppercase tracking-wide text-brand'>
                Confirmação do Administrativo{" "}
                <span className='text-primary'>*</span>
              </label>
              <div className='flex items-center justify-center w-full'>
                {watch("adminApprovalFileUrl") &&
                watch("adminApprovalFileUrl").length > 0 ? (
                  <div className='flex flex-col items-center justify-center w-full p-6 border-2 border-emerald-300 bg-emerald-50/30 rounded-xl relative'>
                    <div className='flex items-center space-x-3 mb-3'>
                      <div className='p-2 bg-emerald-500/10 rounded-lg text-emerald-600'>
                        <FileCheck className='h-6 w-6 animate-bounce' />
                      </div>
                      <div className='text-left'>
                        <p className='text-sm font-semibold text-gray-800 truncate max-w-[250px] sm:max-w-[400px]'>
                          {watch("adminApprovalFileUrl")[0].name}
                        </p>
                        <p className='text-xs text-gray-500'>
                          {(
                            watch("adminApprovalFileUrl")[0].size /
                            1024 /
                            1024
                          ).toFixed(2)}{" "}
                          MB
                        </p>
                      </div>
                    </div>
                    <div className='flex space-x-3'>
                      <button
                        type='button'
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setValue("adminApprovalFileUrl", undefined, {
                            shouldValidate: true,
                          });
                        }}
                        className='px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200'
                      >
                        Remover arquivo
                      </button>
                    </div>
                  </div>
                ) : (
                  <label
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${errors.adminApprovalFileUrl ? "border-red-300 bg-red-50/50" : "border-gray-300 bg-gray-50 hover:bg-gray-100"}`}
                  >
                    <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                      <FileCheck className='w-8 h-8 mb-3 text-gray-400' />
                      <p className='mb-2 text-sm text-gray-500'>
                        <span className='font-semibold'>
                          Clique para anexar a confirmação
                        </span>{" "}
                        ou arraste
                      </p>
                      <p className='text-xs text-gray-500'>
                        PDF, JPG, PNG (MAX. 10MB)
                      </p>
                    </div>
                    <input
                      type='file'
                      className='hidden'
                      accept='.pdf,image/*'
                      {...register("adminApprovalFileUrl")}
                    />
                  </label>
                )}
              </div>
              {errors.adminApprovalFileUrl && (
                <p className='text-xs text-red-600 font-medium animate-fadeIn'>
                  {errors.adminApprovalFileUrl.message as string}
                </p>
              )}
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

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <InputField
                {...register("requesterEmail")}
                label='E-mail Institucional'
                type='email'
                placeholder='Ex: leonardo.silva@unicesusc.edu.br'
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
            <div className='pt-4 border-t border-gray-100'>
              <ToggleGroup
                label='Este é um evento parceiro?'
                value={isPartnerEvent ? "sim" : "nao"}
                onChange={(val) => {
                  setValue("isPartnerEvent", val === "sim", {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
                options={[
                  { value: "nao", label: "Não" },
                  { value: "sim", label: "Sim" },
                ]}
              />

              {isPartnerEvent && (
                <div className='mt-5 space-y-5 bg-brand/5 p-5 rounded-xl border border-brand/10 animate-fadeIn'>
                  <div className='flex items-start space-x-2 text-sm text-amber-700 bg-amber-100/50 p-3 rounded-lg border border-amber-200'>
                    <Info className='h-5 w-5 shrink-0 text-amber-600 mt-0.5' />
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

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
