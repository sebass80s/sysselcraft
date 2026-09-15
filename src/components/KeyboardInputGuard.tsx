"use client";

import { useEffect } from "react";

function isTextControl(target: EventTarget | null): target is HTMLElement {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  );
}

export default function KeyboardInputGuard() {
  useEffect(() => {
    const stopGameKeyboardPropagation = (event: KeyboardEvent) => {
      if (!isTextControl(event.target)) return;
      event.stopPropagation();
    };

    document.addEventListener("keydown", stopGameKeyboardPropagation);
    document.addEventListener("keyup", stopGameKeyboardPropagation);

    return () => {
      document.removeEventListener("keydown", stopGameKeyboardPropagation);
      document.removeEventListener("keyup", stopGameKeyboardPropagation);
    };
  }, []);

  return null;
}
