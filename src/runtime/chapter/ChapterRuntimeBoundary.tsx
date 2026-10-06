import type { ChapterRuntimeShellStatus } from "./chapterRuntimeShell";

type ChapterRuntimeBoundaryProps = {
  status: ChapterRuntimeShellStatus;
  loadingText: string;
  lockedTitle: string;
  lockedBody: string;
  returnHref: string;
  returnLabel: string;
};

export function ChapterRuntimeBoundary({
  status,
  loadingText,
  lockedTitle,
  lockedBody,
  returnHref,
  returnLabel,
}: ChapterRuntimeBoundaryProps) {
  if (status === "active") return null;

  if (status === "loading") {
    return <main className="parent-page"><p>{loadingText}</p></main>;
  }

  return <main className="parent-page">
    <h1>{lockedTitle}</h1>
    <p>{lockedBody}</p>
    <a className="primary-button" href={returnHref}>{returnLabel}</a>
  </main>;
}
