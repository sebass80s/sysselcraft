export const STORY_OVERLAY_VISIBILITY_EVENT = "sysselcraft:story-overlay-visibility";

const activeStoryOverlays = new Set<symbol>();

function publishStoryOverlayVisibility() {
  if (typeof window === "undefined") return;
  const active = activeStoryOverlays.size > 0;
  document.body.dataset.storyOverlayActive = active ? "true" : "false";
  window.dispatchEvent(new CustomEvent(STORY_OVERLAY_VISIBILITY_EVENT, {
    detail: { active },
  }));
}

export function beginStoryOverlay() {
  const token = Symbol("story-overlay");
  activeStoryOverlays.add(token);
  publishStoryOverlayVisibility();
  let ended = false;

  return () => {
    if (ended) return;
    ended = true;
    activeStoryOverlays.delete(token);
    publishStoryOverlayVisibility();
  };
}

export function isStoryOverlayActive() {
  return activeStoryOverlays.size > 0;
}
