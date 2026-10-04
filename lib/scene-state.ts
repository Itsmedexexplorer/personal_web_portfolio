import type { Shape } from "./content/types";

export type SceneMode = "hero" | "activity" | "work" | "after";

// Shared between the scroll director (writes) and the WebGL scene (reads every frame).
// A plain mutable object on purpose: it changes on every scroll tick and must not re-render React.
export const scene = {
  /** 0 = on the ground, 1 = in orbit */
  altitude: 0,
  mode: "hero" as SceneMode,
  /** fractional index of the project in front of the camera */
  progress: 0,
  /** the particle shape for each project, in order */
  shapes: [] as Shape[],
};
