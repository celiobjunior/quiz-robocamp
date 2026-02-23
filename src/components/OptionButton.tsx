type OptionButtonProps = {
  prefix: string;
  label: string;
  disabled?: boolean;
  onClick: () => void;
};

export function OptionButton({ prefix, label, disabled = false, onClick }: OptionButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="option-button w-full border-brut border-brandBlack bg-brandWhite px-4 py-3 text-left text-sm font-medium text-brandBlack shadow-brutSoft transition active:translate-x-1 active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span className="mr-2 inline-flex h-6 w-6 items-center justify-center border-2 border-brandBlack bg-brandWine font-display text-xs text-brandWhite">
        {prefix}
      </span>
      <span>{label}</span>
    </button>
  );
}
