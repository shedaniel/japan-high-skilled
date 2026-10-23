import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface BandOption {
  value: string;
  label: string;
}

export function BandSelect({
  id,
  ariaLabel,
  invalid = false,
  value,
  options,
  onValueChange,
}: {
  id?: string;
  ariaLabel?: string;
  invalid?: boolean;
  value: string;
  options: BandOption[];
  onValueChange: (value: string) => void;
}) {
  const items = Object.fromEntries(
    options.map((option) => [option.value, option.label]),
  );

  return (
    <Select
      items={items}
      onValueChange={(next) => {
        if (typeof next === "string") onValueChange(next);
      }}
      value={value}
    >
      <SelectTrigger
        aria-invalid={invalid || undefined}
        aria-label={ariaLabel}
        className="w-full min-w-0"
        id={id}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectPopup>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  );
}
