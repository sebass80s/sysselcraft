export type StoryDebugEntry = {
  id: string;
  label: string;
  group?: string;
  index: number;
};

export type StoryDebugAct = {
  id: string;
  label: string;
  entries: StoryDebugEntry[];
};
