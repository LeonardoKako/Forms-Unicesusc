interface InfoFieldProps {
  label: string;
  value: any;
  placeholder?: string;
  highlight?: boolean;
  className?: string;
}

export default function InfoField({
  label,
  value,
  placeholder = "Não se aplica",
  highlight = false,
  className = "",
}: InfoFieldProps) {
  const isValueEmpty =
    value === undefined ||
    value === null ||
    (typeof value === "string" && value.trim() === "") ||
    (Array.isArray(value) && value.length === 0);

  return (
    <div className={`space-y-1 ${className}`}>
      <span className='font-semibold text-gray-400 block text-[10px] uppercase tracking-wider'>
        {label}
      </span>
      {isValueEmpty ? (
        <span className='text-xs text-gray-400 italic font-normal bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md inline-block'>
          {placeholder}
        </span>
      ) : highlight ? (
        <span className='text-sm font-extrabold text-brand block leading-tight break-all sm:wrap-break-word whitespace-normal'>
          {Array.isArray(value) ? value.join(", ") : String(value)}
        </span>
      ) : (
        <span className='text-xs font-bold text-gray-700 block leading-relaxed break-all sm:wrap-break-word whitespace-normal'>
          {Array.isArray(value) ? value.join(", ") : String(value)}
        </span>
      )}
    </div>
  );
}
