import { useState, useEffect, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ChevronRight } from "lucide-react";

import { eventFormSchema, EventFormData } from "./schema";
import { mockBackendPayload } from "./mockBackendPayload";
import RequesterCard from "./components/RequesterCard";
import EventDetailsCard from "./components/EventDetailsCard";
import DateLocationCard from "./components/DateLocationCard";
import CopaCard from "./components/CopaCard";
import CoffeeBreakCard from "./components/CoffeeBreakCard";
import TIEquipmentCard from "./components/TIEquipmentCard";
import FurnitureSupportCard from "./components/FurnitureSupportCard";
import SupportTeamsCard from "./components/SupportTeamsCard";
import PresentationMaterialCard from "./components/PresentationMaterialCard";
import ArtworkCard from "./components/ArtworkCard";
import SuccessModal from "./components/SuccessModal";
import InfoModal from "@/components/InfoModal";
import ExtraDocsCard from "./components/ExtraDocsCard";

import { supabase } from "@/lib/supabase";

export default function EventForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [submittedData, setSubmittedData] = useState<any | null>(null);

  // Helper para fazer upload de arquivos no Supabase
  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // Envia o arquivo binário para o bucket 'comprovantes'
    const { error } = await supabase.storage
      .from("comprovantes")
      .upload(filePath, file);

    if (error) {
      throw error;
    }

    // Busca a URL pública do arquivo
    const { data } = supabase.storage.from("comprovantes").getPublicUrl(filePath);
    return data.publicUrl;
  };

  // Initialize form methods
  const methods = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      requesterType: "interno",
      requesterPhone: "",
      requesterDepartment: "",
      isPartnerEvent: false,
      partnerName: "",
      partnerEmail: "",
      partnerPhone: "",
      partnerInstitution: "",
      adminApprovalFileUrl: undefined,
      acceptTerms: false,
      needsBudget: undefined,
      budgetApprovalFileUrl: undefined,
      targetAudience: [],
      copa: [],
      coffeeBreak: [],
      tiEquipment: [],
      furnitureSupport: [],
      otherFurnitureDescription: "",
      supportTeams: ["marketing", "administrativo"],
      presentationMaterials: [],
      presentationDriveLink: "",
      needsArtwork: false,
      artworkDescription: "",
    },
  });

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = methods;

  // Sincronização reativa entre Equipamentos de TI e Equipes de Apoio (TI)
  const tiEquipment = methods.watch("tiEquipment") || [];
  const supportTeams = methods.watch("supportTeams") || [];

  const prevTiEquipmentRef = useRef<string[]>([]);
  const prevSupportTeamsRef = useRef<string[]>([]);

  useEffect(() => {
    const prevTiEquipment = prevTiEquipmentRef.current;
    const prevSupportTeams = prevSupportTeamsRef.current;

    const hasActiveTiEquipment = tiEquipment.some(id => id !== "nao_se_aplica" && id !== "");
    const hasTiSupport = supportTeams.includes("ti");

    const tiEquipmentChanged = JSON.stringify(prevTiEquipment) !== JSON.stringify(tiEquipment);
    const supportTeamsChanged = JSON.stringify(prevSupportTeams) !== JSON.stringify(supportTeams);

    if (tiEquipmentChanged) {
      if (hasActiveTiEquipment && !hasTiSupport) {
        methods.setValue("supportTeams", [...supportTeams, "ti"], { shouldValidate: true, shouldDirty: true });
      }
    } else if (supportTeamsChanged) {
      const prevHadTiSupport = prevSupportTeams.includes("ti");
      if (prevHadTiSupport && !hasTiSupport && hasActiveTiEquipment) {
        methods.setValue("tiEquipment", ["nao_se_aplica"], { shouldValidate: true, shouldDirty: true });
      }
    }

    prevTiEquipmentRef.current = tiEquipment;
    prevSupportTeamsRef.current = supportTeams;
  }, [tiEquipment, supportTeams, methods]);

  // Simulated request submit logic
  const onSubmit = async (data: EventFormData) => {
    setIsSubmitting(true);
    try {
      let finalBudgetUrl = "";

      // 1. Upload do Arquivo de Orçamento (Se houver arquivo selecionado no FileList)
      if (data.budgetApprovalFileUrl && data.budgetApprovalFileUrl.length > 0) {
        console.log("Subindo arquivo de orçamento para o Supabase Storage...", data.budgetApprovalFileUrl[0]);
        finalBudgetUrl = await uploadFile(data.budgetApprovalFileUrl[0], "orcamentos");
        console.log("Arquivo submetido com sucesso! URL pública gerada:", finalBudgetUrl);
      }

      // 2. Monta o payload final com a URL em string simples para o backend receber!
      const finalPayload = {
        ...data,
        budgetApprovalFileUrl: finalBudgetUrl,
        adminApprovalFileUrl: data.adminApprovalFileUrl && data.adminApprovalFileUrl.length > 0 
          ? "[FileList Temporário - Integraremos na sequência]" 
          : ""
      };

      console.log("Mock de payload completo esperado pelo backend:", mockBackendPayload);
      console.log("PAYLOAD LIMPO E FINAL ENVIADO (Pronto para Banco de Dados!):", finalPayload);

      setSubmittedData(finalPayload);
      setShowSuccessModal(true);
    } catch (err: any) {
      console.error("Erro no upload para o Supabase:", err);
      alert(`Erro ao enviar arquivo para o Supabase: ${err.message || err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form status and data
  const handleResetForm = () => {
    reset();
    setShowSuccessModal(false);
    setSubmittedData(null);
  };

  return (
    <FormProvider {...methods}>
      <div className='w-full'>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-start'>
            {/* LEFT COLUMN: Modularized cards */}
            <div className='lg:col-span-7 space-y-6'>
              <RequesterCard />
              <EventDetailsCard />
              <ArtworkCard />
              <TIEquipmentCard />
              <SupportTeamsCard />
              <ExtraDocsCard />
            </div>

            {/* RIGHT COLUMN: Modularized cards and submit footer */}
            <div className='lg:col-span-5 space-y-6'>
              <DateLocationCard />
              <CopaCard />
              <CoffeeBreakCard />
              <FurnitureSupportCard />
              <PresentationMaterialCard />

              {/* Termos de Uso e Botão de Envio */}
              <div className='bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4'>
                {/* Checkbox de Aceitação */}
                <div className='flex flex-col space-y-1'>
                  <label className='flex items-start space-x-3 cursor-pointer'>
                    <input
                      type='checkbox'
                      {...register("acceptTerms")}
                      className='mt-1 h-4.5 w-4.5 rounded border-gray-300 text-primary focus:ring-primary/20 accent-primary'
                    />
                    <span className='text-xs text-gray-500 leading-normal font-medium'>
                      Declaro estar ciente dos{" "}
                      <button
                        type='button'
                        onClick={(e) => {
                          e.preventDefault();
                          setShowTermsModal(true);
                        }}
                        className='text-primary hover:underline font-semibold focus:outline-none'
                      >
                        Termos de Uso
                      </button>{" "}
                      e das normas de segurança dos ambientes da Unicesusc.
                    </span>
                  </label>
                  {errors.acceptTerms && (
                    <span className='text-xs text-red-600 font-medium ml-7 animate-fadeIn'>
                      {errors.acceptTerms.message}
                    </span>
                  )}
                </div>

                {/* Botão de Envio de Agendamento */}
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className={`
                    w-full h-13 rounded-xl font-bold text-sm tracking-wide text-white uppercase shadow-md flex items-center justify-center space-x-2 transition-all duration-300 outline-none
                    ${
                      isSubmitting
                        ? "bg-primary/70 cursor-not-allowed"
                        : "bg-primary hover:bg-primary/95 active:scale-[0.98] hover:shadow-lg focus:ring-4 focus:ring-primary/20"
                    }
                  `}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className='h-5 w-5 animate-spin' />
                      <span>Enviando Solicitação...</span>
                    </>
                  ) : (
                    <>
                      <span>Enviar Solicitação</span>
                      <ChevronRight className='h-4.5 w-4.5' />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Modal de Sucesso Apresentacional */}
        <SuccessModal
          isOpen={showSuccessModal}
          data={submittedData}
          onClose={() => setShowSuccessModal(false)}
          onReset={handleResetForm}
        />

        {/* Modal de Termos de Uso */}
        <InfoModal
          isOpen={showTermsModal}
          onClose={() => setShowTermsModal(false)}
          title='Termos de Uso'
          type='document'
        >
          <div className='space-y-4'>
            <h4 className='font-bold text-gray-800 text-lg'>
              Regras e Normas de Utilização
            </h4>
            <p className='text-sm text-gray-600 leading-relaxed'>
              Este é um documento de espaço reservado. Aqui você poderá anexar
              ou escrever os termos de uso reais do ambiente, detalhando as
              regras de convivência, horários permitidos, responsabilidades
              sobre equipamentos e demais normas de segurança necessárias para a
              realização de eventos na instituição.
            </p>
            <p className='text-sm text-gray-600 leading-relaxed'>
              O texto completo será incluído aqui futuramente.
            </p>
          </div>
        </InfoModal>
      </div>
    </FormProvider>
  );
}
