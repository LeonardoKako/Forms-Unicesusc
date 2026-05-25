
export interface ToggleOption {
  value: string
  label: string
}

interface ToggleGroupProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: ToggleOption[]
  required?: boolean
  error?: string
}

export default function ToggleGroup({ label, value, onChange, options, required, error }: ToggleGroupProps) {
  return (
    <div className="w-full flex flex-col space-y-1.5">

      {/* Label */}
      <label className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500 flex items-center">
        <span>{label}</span>
        {required && <span className="text-primary ml-1 text-xs">*</span>}
      </label>

      {/* Button Segment Grid */}
      <div className="grid grid-cols-2 gap-3">
        {options.map((opt) => {
          const isSelected = value === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`
                h-[46px] rounded-xl px-4 text-sm font-semibold tracking-wide border-2 transition-all duration-200 outline-none
                ${isSelected
                  ? 'bg-red-50/50 border-primary text-primary shadow-sm ring-4 ring-primary/5'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-800'
                }
                ${error && !isSelected ? 'border-red-500/80 text-red-500' : ''}
              `}
            >
              {opt.label}
            </button>
          )
        })}
      </div>

      {/* Error validation details */}
      {error && (
        <span className="text-xs text-red-600 font-medium mt-1">
          {error}
        </span>
      )}
    </div>
  )
}
