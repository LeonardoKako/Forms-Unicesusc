import { useFormContext } from "react-hook-form";
import { OptionItem } from "../mockData";

interface CheckboxGridProps {
  name: string;
  label?: string;
  options: OptionItem[];
  columns?: 2 | 3;
  withCardWrapper?: boolean;
  children?: React.ReactNode;
}

export default function CheckboxGrid({
  name,
  label,
  options,
  columns = 2,
  withCardWrapper = true,
  children,
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
                onChange={(e) => handleCheckboxChange(option.id, e.target.checked)}
                className="h-4.5 w-4.5 rounded border-gray-300 text-primary focus:ring-primary/20 accent-primary transition-all cursor-pointer"
              />
              <span
                className={`text-sm transition-colors ${
                  isChecked
                    ? "text-brand font-medium"
                    : "text-gray-600 group-hover:text-gray-900"
                }`}
              >
                {option.label}
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
