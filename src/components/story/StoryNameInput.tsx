"use client";

import {
  forwardRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";

type StoryNameInputProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onCanSubmitChange?: (canSubmit: boolean) => void;
  onSubmit: () => void | Promise<void>;
  maxLength?: number;
  placeholder: string;
  ariaLabel: string;
  submitLabel: string;
  disabled?: boolean;
  autoFocus?: boolean;
};

export const StoryNameInput = forwardRef<HTMLInputElement, StoryNameInputProps>(
  function StoryNameInput(
    {
      value,
      defaultValue,
      onValueChange,
      onCanSubmitChange,
      onSubmit,
      maxLength = 24,
      placeholder,
      ariaLabel,
      submitLabel,
      disabled = false,
      autoFocus = true,
    },
    ref,
  ) {
    const [internalValue, setInternalValue] = useState(defaultValue ?? "");
    const currentValue = value ?? internalValue;
    const canSubmit = currentValue.trim().length > 0 && !disabled;

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
      const next = event.currentTarget.value;
      if (value === undefined) setInternalValue(next);
      onValueChange?.(next);
      onCanSubmitChange?.(next.trim().length > 0);
    }

    function submit() {
      if (!canSubmit) return;
      void onSubmit();
    }

    function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
      if (event.key !== "Enter") return;
      event.preventDefault();
      submit();
    }

    return (
      <div className="shared-story-name-input">
        <input
          ref={ref}
          className="shared-story-text-input"
          value={value}
          defaultValue={value === undefined ? defaultValue : undefined}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          maxLength={maxLength}
          autoFocus={autoFocus}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="words"
          spellCheck={false}
          inputMode="text"
          enterKeyHint="done"
          placeholder={placeholder}
          aria-label={ariaLabel}
          disabled={disabled}
        />
        <button
          className="primary-button dialogue-next"
          type="button"
          disabled={!canSubmit}
          onClick={submit}
        >
          {submitLabel}
        </button>
      </div>
    );
  },
);
