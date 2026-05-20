import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ChevronRight } from "lucide-react";

import { eventFormSchema, EventFormData } from "./schema";
import RequesterCard from "./components/RequesterCard";
import EventDetailsCard from "./components/EventDetailsCard";
import DateLocationCard from "./components/DateLocationCard";
import CoffeeBreakCard from "./components/CoffeeBreakCard";
import TIEquipmentCard from "./components/TIEquipmentCard";
import FurnitureSupportCard from "./components/FurnitureSupportCard";
import SupportTeamsCard from "./components/SupportTeamsCard";
import SuccessModal from "./components/SuccessModal";

export default function EventForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedData, setSubmittedData] = useState<EventFormData | null>(
    null,
  );

  // Initialize form methods
  const methods = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      requesterType: "interno",
      acceptTerms: false,
      needsBudget: undefined,
      budgetDescription: "",
      budgetEmail: "financeiro@unicesusc.edu.br",
      targetAudience: [],
      coffeeBreak: [],
      tiEquipment: [],
      furnitureSupport: [],
      supportTeams: [],
    },
  });

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = methods;

  // Simulated request submit logic
  const onSubmit = (data: EventFormData) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedData(data);
      setShowSuccessModal(true);
    }, 1500);
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
              <SupportTeamsCard />
            </div>

            {/* RIGHT COLUMN: Modularized cards and submit footer */}
            <div className='lg:col-span-5 space-y-6'>
              <DateLocationCard />
              <CoffeeBreakCard />
              <TIEquipmentCard />
              <FurnitureSupportCard />

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
                      <a
                        href='#'
                        className='text-primary hover:underline font-semibold'
                      >
                        Termos de Uso
                      </a>{" "}
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
      </div>
    </FormProvider>
  );
}
