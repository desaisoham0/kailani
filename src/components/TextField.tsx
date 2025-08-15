// components/TextField.tsx
import { Field, Input, Label, Description } from '@headlessui/react';

type Props = {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  description?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  pattern?: string;
  className?: string;
};

export default function TextField({
  id,
  name,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required,
  disabled,
  invalid,
  description,
  autoComplete,
  inputMode,
  pattern,
  className = '',
}: Props) {
  return (
    <Field disabled={disabled} className="group">
      <Label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-gray-700 data-disabled:opacity-50"
      >
        {label}
      </Label>

      {description ? (
        <Description
          id={`${id}-desc`}
          className="mb-2 text-xs text-gray-500 data-disabled:opacity-50"
        >
          {description}
        </Description>
      ) : null}

      <Input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        invalid={invalid}
        autoComplete={autoComplete}
        inputMode={inputMode}
        pattern={pattern}
        aria-describedby={description ? `${id}-desc` : undefined}
        className={[
          // base
          'w-full rounded-2xl border px-4 py-3 font-medium text-gray-800 placeholder-gray-400 transition duration-200',
          // default
          'border-gray-200 bg-white',
          // hover/focus states via Headless UI data-* attributes
          'data-hover:border-indigo-300',
          'data-focus:border-indigo-400 data-focus:bg-indigo-50 data-focus:shadow-lg data-focus:ring-4 data-focus:ring-indigo-100',
          // disabled
          'data-disabled:cursor-not-allowed data-disabled:bg-gray-100 data-disabled:opacity-60',
          // invalid
          'data-invalid:border-red-400 data-invalid:bg-red-50 data-invalid:ring-4 data-invalid:ring-red-100',
          // native outline off
          'focus:outline-none',
          className,
        ].join(' ')}
      />
    </Field>
  );
}
