"use client";

interface InputFieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "number" | "email";
  required?: boolean;
  disabled?: boolean;
}

export default function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  disabled = false,
}: InputFieldProps) {
  return (
    <div className="input-field">
      <label htmlFor={name}>
        {label}
        {required && <span className="required">*</span>}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
      />
    </div>
  );
}