import { ACT2_OPENING_BEATS } from "../../game/act2OpeningStory";
import { CABIN_CONTRIBUTION_BEATS } from "../../game/act2CabinStory";
import { JETTY_COMPLETION_REACTION, JETTY_CONTRIBUTION_BEATS, JETTY_LIFEBUOY_BEAT } from "../../game/act2JettyStory";
import { BOATHOUSE_CONTRIBUTION_BEATS, BOATHOUSE_STEERING_WHEEL_BEAT } from "../../game/act2BoathouseStory";
import { MOTORBOAT_CONTRIBUTION_BEATS } from "../../game/act2MotorboatStory";
import { ACT2_FINALE_BEATS } from "../../game/act2FinaleStory";
import type { Act2RuntimeState } from "../../game/act2RuntimeState";
import { createStoryRegistry, type StoryBeatDefinition } from "./storyRegistry";
import type { StoryHistoryProgress } from "./storyHistory";

export const ACT2_STORYLINE_IDS = {
  opening:"act2:opening", cabin:"act2:cabin", dock:"act2:dock",
  boathouse:"act2:boathouse", motorboat:"act2:motorboat", finale:"act2:finale",
} as const;

type SourceBeat = { title:string; image?:string; body:readonly string[] };

function asBeat(beat:SourceBeat, storylineId:string, id:string, mode:"after-storyline-complete"|"after-beat-complete"="after-storyline-complete"): StoryBeatDefinition {
  return { id, chapterId:"act2", storylineId, title:beat.title, image:beat.image, body:beat.body, history:{ mode } };
}
function numbered(source:readonly SourceBeat[], storylineId:string) {
  return source.map((beat,index)=>asBeat(beat,storylineId,`${storylineId}:${String(index+1).padStart(2,"0")}`));
}

export const ACT2_STORY_REGISTRY = createStoryRegistry([
  ...numbered(ACT2_OPENING_BEATS, ACT2_STORYLINE_IDS.opening),
  ...numbered(CABIN_CONTRIBUTION_BEATS, ACT2_STORYLINE_IDS.cabin),
  ...numbered(JETTY_CONTRIBUTION_BEATS, ACT2_STORYLINE_IDS.dock),
  ...numbered(BOATHOUSE_CONTRIBUTION_BEATS, ACT2_STORYLINE_IDS.boathouse),
  ...numbered(MOTORBOAT_CONTRIBUTION_BEATS, ACT2_STORYLINE_IDS.motorboat),
  asBeat(JETTY_LIFEBUOY_BEAT, ACT2_STORYLINE_IDS.dock, "act2:dock:lifebuoy", "after-beat-complete"),
  asBeat(BOATHOUSE_STEERING_WHEEL_BEAT, ACT2_STORYLINE_IDS.boathouse, "act2:boathouse:steering-wheel", "after-beat-complete"),
  asBeat(JETTY_COMPLETION_REACTION, ACT2_STORYLINE_IDS.dock, "act2:dock:completion-reaction", "after-beat-complete"),
  ...numbered(ACT2_FINALE_BEATS, ACT2_STORYLINE_IDS.finale),
]);

export function act2HistoryProgress(state:Act2RuntimeState): StoryHistoryProgress {
  const completedStorylineIds=new Set<string>();
  const completedBeatIds=new Set<string>();
  if(state.openingComplete) completedStorylineIds.add(ACT2_STORYLINE_IDS.opening);
  for(const project of ["cabin","dock","boathouse","motorboat"] as const) {
    if(state.projects[project].complete) completedStorylineIds.add(ACT2_STORYLINE_IDS[project]);
  }
  if(state.epilogueConsumed) completedStorylineIds.add(ACT2_STORYLINE_IDS.finale);
  if(state.projects.dock.complete && state.jettyLifebuoyOwned) completedBeatIds.add("act2:dock:lifebuoy");
  if(state.projects.dock.complete && state.consumedProjectCompletionIds.includes("dock:completion-reaction")) completedBeatIds.add("act2:dock:completion-reaction");
  if(state.projects.boathouse.complete && state.boathouseSteeringWheelOwned) completedBeatIds.add("act2:boathouse:steering-wheel");
  return { completedBeatIds, completedStorylineIds };
}
