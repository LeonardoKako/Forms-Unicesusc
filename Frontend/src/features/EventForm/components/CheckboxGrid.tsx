import { useFormContext } from "react-hook-form";
import { Eye } from "lucide-react";
import { OptionItem } from "../mockData";

interface CheckboxGridProps {
  name: string;
  label?: string;
  options: OptionItem[];
  columns?: 2 | 3;
  withCardWrapper?: boolean;
  children?: React.ReactNode;
  disabledOptions?: string[];
  onInfoClick?: (optionId: string) => void;
}

export default function CheckboxGrid({
  name,
  label,
  options,
  columns = 2,
  withCardWrapper = true,
  children,
  disabledOptions = [],
  onInfoClick,
}: CheckboxGridProps) {
  const { watch, setValue, formState: { errors } } = useFormContext();
  const selectedValues: string[] = watch(name) || [];
  const error = errors[name]?.message as string | undefined;

  const handleCheckboxChange = (optionId: string, checked: boolean) => {
    let newValues = [...selectedValues];

    if (checked) {
      if (optionId === "nao_se_aplica") {
        newValues = ["nao_se_aplica"];
      } else {
        newValues = newValues.filter((id) => id !== "nao_se_aplica");
        newValues.push(optionId);
      }
    } else {
      newValues = newValues.filter((id) => id !== optionId);
    }

    setValue(name, newValues, { shouldValidate: true, shouldDirty: true });
  };

  const content = (
    <>
      {label && (
        <>
          <h3 className="text-[13px] font-extrabold uppercase tracking-wide text-brand mb-4">
            {label}
          </h3>
          <div className="border-t border-gray-100/80 mb-5"></div>
        </>
      )}
      <div
        className={`grid gap-y-4 gap-x-6 grid-cols-1 ${
          columns === 3 ? "md:grid-cols-3" : "sm:grid-cols-2"
        }`}
      >
        {options.map((option) => {
          const isChecked = selectedValues.includes(option.id);
          return (
            <label
              key={option.id}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                value={option.id}
                checked={isChecked}
                disabled={disabledOptions.includes(option.id)}
                onChange={(e) => handleCheckboxChange(option.id, e.target.checked)}
                className={`h-4.5 w-4.5 rounded border-gray-300 focus:ring-primary/20 accent-primary transition-all cursor-pointer ${
                  disabledOptions.includes(option.id) ? "opacity-50 cursor-not-allowed" : "text-primary"
                }`}
              />
              <span
                className={`text-sm transition-colors flex items-center ${
                  isChecked
                    ? "text-brand font-medium"
                    : "text-gray-600 group-hover:text-gray-900"
                }`}
              >
                {option.label}
                {option.hasInfo && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (onInfoClick) onInfoClick(option.id);
                    }}
                    className="ml-2 text-gray-400 hover:text-brand transition-colors focus:outline-none"
                    title="Ver mais informações"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                )}
              </span>
            </label>
          );
        })}
      </div>
      {error && (
        <p className="mt-3 text-xs text-red-500 font-medium animate-fadeIn">
          {error}
        </p>
      )}
      {children && <div className="mt-6">{children}</div>}
    </>
  );

  if (withCardWrapper) {
    return (
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md">
        {content}
      </div>
    );
  }

  return <div>{content}</div>;
}
