"use client";

import { useEffect, useRef } from "react";
import { DialogueCard } from "./DialogueCard";
import styles from "./ConfirmationDialog.module.css";

type ConfirmationDialogProps = {
  text: string;
  acceptLabel: string;
  cancelLabel: string;
  onAccept: () => void;
  onCancel: () => void;
};

/** Shared presentation only. Native modality owns focus, Escape and background inertness. */
export function ConfirmationDialog({ text, acceptLabel, cancelLabel, onAccept, onCancel }: ConfirmationDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const acceptedRef = useRef(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    dialog?.showModal();
    return () => {
      dialog?.close();
      // React can remove the dialog before passive cleanup; restore explicitly.
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className={styles.modal}
      aria-label={text}
      onCancel={(event) => { event.preventDefault(); onCancel(); }}
    >
      <DialogueCard
        embedded
        className={styles.card}
        previousLabel={cancelLabel}
        onPrevious={onCancel}
        nextLabel={acceptLabel}
        onNext={() => {
          if (acceptedRef.current) return;
          acceptedRef.current = true;
          onAccept();
        }}
      >
        <p>{text}</p>
      </DialogueCard>
    </dialog>
  );
}
