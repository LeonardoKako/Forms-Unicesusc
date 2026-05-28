import { Box } from "lucide-react";
import { useFormContext } from "react-hook-form";
import CheckboxGrid from "./CheckboxGrid";
import { FURNITURE_SUPPORT_OPTIONS } from "../mockData";

export default function FurnitureSupportCard() {
  const {
    watch,
    register,
    formState: { errors },
  } = useFormContext();
  const selectedFurniture = watch("furnitureSupport") || [];
  const showOtherInput = selectedFurniture.includes("outro");

  return (
    <div className='bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md animate-fadeIn'>
      {/* Header do Card */}
      <div className='flex items-center space-x-3 mb-6 pb-3 border-b border-gray-100'>
        <div className='p-2 bg-brand/5 rounded-xl text-brand'>
          <Box className='h-5 w-5' />
        </div>
        <div>
          <h2 className='text-base font-extrabold uppercase tracking-wide text-brand'>
            Móveis e Apoio
          </h2>
          <p className='text-xs text-gray-400'>
            Cadeiras, mesas e estruturas extras
          </p>
        </div>
      </div>

      <CheckboxGrid
        name='furnitureSupport'
        options={FURNITURE_SUPPORT_OPTIONS}
        withCardWrapper={false}
      >
        {showOtherInput && (
          <div className='mt-4 p-4 bg-gray-50 border border-gray-100 rounded-xl space-y-2 animate-slideDown'>
            <label className='block text-xs font-bold uppercase tracking-wider text-brand'>
              Descreva os outros móveis e quantidades:
            </label>
            <input
              type='text'
              {...register("otherFurnitureDescription")}
              placeholder='Ex: 5 Toalhas pretas, 10 cadeiras adicionais...'
              className='w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all'
            />
            {errors.otherFurnitureDescription && (
              <p className='text-xs text-red-600 font-medium'>
                {errors.otherFurnitureDescription.message as string}
              </p>
            )}
          </div>
        )}
      </CheckboxGrid>
    </div>
  );
}
