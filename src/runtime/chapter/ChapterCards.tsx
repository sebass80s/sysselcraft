"use client";

import { useState } from "react";

type ChapterIntroCardProps = {
  chapterLabel: string;
  title: string;
  ariaLabel?: string;
  continueLabel?: string;
  revealTitleBeforeContinue?: boolean;
  onContinue: () => void;
};

export function ChapterIntroCard({
  chapterLabel,
  title,
  ariaLabel,
  continueLabel = "Fortsätt",
  revealTitleBeforeContinue = true,
  onContinue,
}: ChapterIntroCardProps) {
  const [titleVisible, setTitleVisible] = useState(!revealTitleBeforeContinue);

  function advance() {
    if (!titleVisible) {
      setTitleVisible(true);
      return;
    }
    onContinue();
  }

  return (
    <section
      className="shared-chapter-card shared-chapter-intro"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel ?? `${chapterLabel} · ${title}`}
    >
      <div className="shared-chapter-card-content">
        <span className="shared-chapter-label">{chapterLabel}</span>
        <strong className={titleVisible ? "shared-chapter-title is-visible" : "shared-chapter-title"}>
          {title}
        </strong>
        <button
          className="primary-button shared-chapter-card-action"
          type="button"
          onClick={advance}
        >
          {continueLabel}
        </button>
      </div>
    </section>
  );
}

type ChapterEndCardProps = {
  title: string;
  ariaLabel?: string;
  continueLabel: string;
  onContinue: () => void | Promise<void>;
};

export function ChapterEndCard({
  title,
  ariaLabel,
  continueLabel,
  onContinue,
}: ChapterEndCardProps) {
  return (
    <section
      className="shared-chapter-card shared-chapter-end"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel ?? title}
    >
      <div className="shared-chapter-card-content">
        <h1 className="shared-chapter-end-title">{title}</h1>
        <button
          className="primary-button shared-chapter-card-action"
          type="button"
          onClick={() => void onContinue()}
        >
          {continueLabel}
        </button>
      </div>
    </section>
  );
}
