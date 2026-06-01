import { useState, useEffect, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ChevronRight, User, Key } from "lucide-react";

import { eventFormSchema, locationFormSchema } from "./schema";
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
import { toast } from "react-toastify";

type FormType = "interno" | "locacao";

export default function EventForm() {
  const [formType, setFormType] = useState<FormType>("interno");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [submittedData, setSubmittedData] = useState<any | null>(null);

  // Helper para fazer upload de arquivos no Supabase
  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error } = await supabase.storage
      .from("comprovantes")
      .upload(filePath, file);

    if (error) {
      throw error;
    }

    const { data } = supabase.storage
      .from("comprovantes")
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  // Instanciamos os métodos do formulário com base na aba ativa (interno vs locacao)
  const methods = useForm<any>({
    resolver: zodResolver(
      formType === "interno" ? eventFormSchema : locationFormSchema,
    ),
    defaultValues: {
      requesterType: formType,
      requesterName: "",
      requesterEmail: "",
      requesterPhone: "",
      requesterDepartment: "",
      isPartnerEvent: false,
      partnerName: "",
      partnerEmail: "",
      partnerPhone: "",
      partnerInstitution: "",
      acceptTerms: false,
      needsBudget: undefined,
      budgetApprovalFileUrl: undefined,
      roomNotes: "",
      targetAudience: [],
      copa: [],
      coffeeBreak: "nao_se_aplica",
      coffeeNotes: "",
      tiEquipment: [],
      furnitureSupport: [],
      otherFurnitureDescription: "",
      supportTeams: ["marketing", "administrativo"],
      presentationMaterials: [],
      presentationDriveLink: "",
      needsArtwork: false,
      hasPrintedArtwork: false,
      artworkDescription: "",
    },
  });

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  // Resetar ou setar o requesterType correto ao mudar de aba
  useEffect(() => {
    reset({
      requesterType: formType,
      requesterName: "",
      requesterEmail: "",
      requesterPhone: "",
      requesterDepartment: "",
      isPartnerEvent: false,
      partnerName: "",
      partnerEmail: "",
      partnerPhone: "",
      partnerInstitution: "",
      acceptTerms: false,
      needsBudget: undefined,
      budgetApprovalFileUrl: undefined,
      roomNotes: "",
      targetAudience: [],
      copa: [],
      coffeeBreak: "nao_se_aplica",
      coffeeNotes: "",
      tiEquipment: [],
      furnitureSupport: [],
      otherFurnitureDescription: "",
      supportTeams: ["marketing", "administrativo"],
      presentationMaterials: [],
      presentationDriveLink: "",
      needsArtwork: false,
      hasPrintedArtwork: false,
      artworkDescription: "",
    });
  }, [formType, reset]);

  // Sincronização reativa entre Equipamentos de TI e Equipes de Apoio (TI) - Apenas para formulário Interno
  const tiEquipment = watch("tiEquipment") || [];
  const supportTeams = watch("supportTeams") || [];

  const prevTiEquipmentRef = useRef<string[]>([]);
  const prevSupportTeamsRef = useRef<string[]>([]);

  useEffect(() => {
    if (formType !== "interno") return;

    const prevTiEquipment = prevTiEquipmentRef.current;
    const prevSupportTeams = prevSupportTeamsRef.current;

    const hasActiveTiEquipment = tiEquipment.some(
      (id: string) => id !== "nao_se_aplica" && id !== "",
    );
    const hasTiSupport = supportTeams.includes("ti");

    const tiEquipmentChanged =
      JSON.stringify(prevTiEquipment) !== JSON.stringify(tiEquipment);
    const supportTeamsChanged =
      JSON.stringify(prevSupportTeams) !== JSON.stringify(supportTeams);

    if (tiEquipmentChanged) {
      if (hasActiveTiEquipment && !hasTiSupport) {
        setValue("supportTeams", [...supportTeams, "ti"], {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    } else if (supportTeamsChanged) {
      const prevHadTiSupport = prevSupportTeams.includes("ti");
      if (prevHadTiSupport && !hasTiSupport && hasActiveTiEquipment) {
        setValue("tiEquipment", ["nao_se_aplica"], {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    }

    prevTiEquipmentRef.current = tiEquipment;
    prevSupportTeamsRef.current = supportTeams;
  }, [tiEquipment, supportTeams, setValue, formType]);

  // Envio de formulário final
  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      let finalBudgetUrl = "";

      // 1. Upload do Arquivo de Orçamento (Apenas no Interno, se aplicável)
      if (
        formType === "interno" &&
        data.budgetApprovalFileUrl &&
        data.budgetApprovalFileUrl.length > 0
      ) {
        console.log(
          "Subindo arquivo de orçamento para o Supabase Storage...",
          data.budgetApprovalFileUrl[0],
        );
        finalBudgetUrl = await uploadFile(
          data.budgetApprovalFileUrl[0],
          "orcamentos",
        );
      }

      // 2. Limpeza dos dados dependendo da API/Formulário ativo
      let finalPayload: any = {};

      if (formType === "interno") {
        // Envia todos os dados pertinentes ao evento interno
        finalPayload = {
          controlCode: `#INT-${Math.floor(100000 + Math.random() * 900000)}`,
          requesterType: "interno",
          requesterName: data.requesterName,
          requesterEmail: data.requesterEmail,
          requesterPhone: data.requesterPhone,
          requesterDepartment: data.requesterDepartment,
          isPartnerEvent: data.isPartnerEvent,
          partnerName: data.isPartnerEvent ? data.partnerName : undefined,
          partnerEmail: data.isPartnerEvent ? data.partnerEmail : undefined,
          partnerPhone: data.isPartnerEvent ? data.partnerPhone : undefined,
          partnerInstitution: data.isPartnerEvent
            ? data.partnerInstitution
            : undefined,
          eventTitle: data.eventTitle,
          eventType: data.eventType,
          eventDescription: data.eventDescription,
          targetAudience: data.targetAudience,
          estimatedPublic: data.estimatedPublic,
          eventDate: data.eventDate,
          startTime: data.startTime,
          endTime: data.endTime,
          selectedRoom: data.selectedRoom,
          roomNotes: data.roomNotes,
          needsBudget: data.needsBudget,
          budgetApprovalFileUrl: finalBudgetUrl,
          copa: data.copa,
          coffeeBreak: data.coffeeBreak,
          coffeeNotes: data.coffeeNotes,
          tiEquipment: data.tiEquipment,
          furnitureSupport: data.furnitureSupport,
          otherFurnitureDescription: data.furnitureSupport.includes("outro")
            ? data.otherFurnitureDescription
            : undefined,
          supportTeams: data.supportTeams,
          presentationMaterials: data.presentationMaterials,
          presentationDriveLink: data.presentationMaterials.includes(
            "google_drive_link",
          )
            ? data.presentationDriveLink
            : undefined,
          needsArtwork: data.needsArtwork,
          hasPrintedArtwork: data.needsArtwork ? data.hasPrintedArtwork : false,
          artworkDescription: data.needsArtwork
            ? data.artworkDescription
            : undefined,
        };
      } else {
        // Envia apenas o necessário para locação externa de forma limpa e simplificada
        finalPayload = {
          controlCode: `#LOC-${Math.floor(100000 + Math.random() * 900000)}`,
          requesterType: "locacao",
          requesterName: data.requesterName,
          requesterEmail: data.requesterEmail,
          requesterPhone: data.requesterPhone,
          eventDate: data.eventDate,
          startTime: data.startTime,
          endTime: data.endTime,
          selectedRoom: data.selectedRoom,
          roomNotes: data.roomNotes,
          supportTeams: data.supportTeams,
        };
      }

      console.log(
        `[Formulário ${formType.toUpperCase()}] Dados reais enviados:`,
        finalPayload,
      );

      setSubmittedData(finalPayload);
      toast.success("Solicitação enviada com sucesso!");
      setShowSuccessModal(true);
    } catch (err: any) {
      console.error("Erro ao enviar:", err);
      toast.error(
        `Erro ao enviar: ${err.message || "Problema no upload do arquivo"}`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Callback acionado quando a validação do formulário falha
  const onError = (errors: any) => {
    toast.error(
      "Por favor, preencha todos os campos obrigatórios corretamente.",
    );

    // Encontra o primeiro campo com erro
    const errorKeys = Object.keys(errors);
    if (errorKeys.length > 0) {
      const firstErrorKey = errorKeys[0];
      // Tenta achar o elemento pelo name do input
      const element = document.getElementsByName(firstErrorKey)[0];

      if (element) {
        // Rola até o elemento de erro de forma suave
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        // Se possível, foca no campo
        element.focus({ preventScroll: true });
      } else {
        // Fallback: se for um ToggleGroup ou Custom, procura pelo primeiro elemento com classe de erro
        const firstErrorEl = document.querySelector(
          ".text-red-600, .text-red-500",
        );
        if (firstErrorEl) {
          firstErrorEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    }
  };

  const handleResetForm = () => {
    reset();
    setShowSuccessModal(false);
    setSubmittedData(null);
  };

  return (
    <FormProvider {...methods}>
      <div className='w-full space-y-6'>
        {/* Seletor de Abas Premium */}
        <div className='flex justify-center p-1 bg-gray-100 rounded-2xl max-w-md mx-auto border border-gray-200/50 shadow-sm'>
          <button
            type='button'
            onClick={() => setFormType("interno")}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              formType === "interno"
                ? "bg-white text-brand shadow-sm"
                : "text-gray-500 hover:text-gray-800 hover:bg-white/40"
            }`}
          >
            <User className='h-4 w-4 text-primary' />
            <span>Comunidade Interna</span>
          </button>
          <button
            type='button'
            onClick={() => setFormType("locacao")}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              formType === "locacao"
                ? "bg-white text-brand shadow-sm"
                : "text-gray-500 hover:text-gray-800 hover:bg-white/40"
            }`}
          >
            <Key className='h-4 w-4 text-primary' />
            <span>Locação Externa</span>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit, onError)} className='space-y-6'>
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-start'>
            {/* LEFT COLUMN: Modularized cards */}
            <div className='lg:col-span-7 space-y-6'>
              <RequesterCard isLocationForm={formType === "locacao"} />

              {formType === "interno" && (
                <>
                  <EventDetailsCard />
                  <CopaCard />
                  <FurnitureSupportCard />
                </>
              )}

              <SupportTeamsCard />

              {formType === "interno" && <ExtraDocsCard />}
            </div>

            {/* RIGHT COLUMN: Modularized cards and submit footer */}
            <div className='lg:col-span-5 space-y-6'>
              <DateLocationCard isLocationForm={formType === "locacao"} />

              {formType === "interno" && (
                <>
                  <ArtworkCard />
                  <CoffeeBreakCard />
                  <TIEquipmentCard />
                  <PresentationMaterialCard />
                </>
              )}

              {/* Termos de Uso e Botão de Envio */}
              <div className='bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4'>
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
                      {errors.acceptTerms.message as string}
                    </span>
                  )}
                </div>

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

        {/* Modal de Sucesso */}
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
              ou escrever os termos de uso reais do ambiente...
            </p>
          </div>
        </InfoModal>
      </div>
    </FormProvider>
  );
}
