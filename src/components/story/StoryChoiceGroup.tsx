"use client";

export type StoryChoiceOption<TValue extends string> = {
  value: TValue;
  label: string;
  disabled?: boolean;
};

type StoryChoiceGroupProps<TValue extends string> = {
  options: readonly StoryChoiceOption<TValue>[];
  selected: TValue | null;
  onSelect: (value: TValue) => void;
  confirmLabel?: string;
  onConfirm?: (value: TValue) => void | Promise<void>;
  canConfirm?: (value: TValue) => boolean;
};

export function StoryChoiceGroup<TValue extends string>({
  options,
  selected,
  onSelect,
  confirmLabel,
  onConfirm,
  canConfirm,
}: StoryChoiceGroupProps<TValue>) {
  const confirmable = selected !== null
    && Boolean(onConfirm)
    && (canConfirm?.(selected) ?? true);

  return (
    <div className="shared-story-choice-group">
      <div className="shared-story-choice-options">
        {options.map((option) => (
          <button
            key={option.value}
            className="secondary-button shared-story-choice-option"
            type="button"
            disabled={option.disabled}
            aria-pressed={selected === option.value}
            onClick={() => onSelect(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
      {confirmLabel && onConfirm && selected && confirmable && (
        <button
          className="primary-button dialogue-next shared-story-choice-confirm"
          type="button"
          onClick={() => void onConfirm(selected)}
        >
          {confirmLabel}
        </button>
      )}
    </div>
  );
}
