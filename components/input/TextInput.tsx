"use client";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function TextInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Tell Ascandra about your business...",
  disabled = false,
}: TextInputProps) {
  function handleKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      if (value.trim() && onSubmit) {
        onSubmit();
      }
    }
  }

  return (
    <div className="text-input-container">
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={4}
        aria-label="Business message"
      />

      <div className="text-input-footer">
        <span className="input-hint">
          Press Enter to send · Shift + Enter for a new line
        </span>

        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled || !value.trim()}
          className="primary-button"
        >
          Send
        </button>
      </div>
    </div>
  );
}