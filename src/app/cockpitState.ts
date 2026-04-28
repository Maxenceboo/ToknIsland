import { metrics as defaultMetrics, sessions as defaultSessions } from "./cockpitData";

export type ProjectSummary = {
  name: string;
  path: string;
};

export type RunnerStatus = "idle" | "ready" | "running" | "stopped";

export type CockpitState = {
  project: ProjectSummary | null;
  runnerStatus: RunnerStatus;
};

export const initialCockpitState: CockpitState = {
  project: null,
  runnerStatus: "idle",
};

export const previewProject: ProjectSummary = {
  name: "ToknIsland",
  path: "C:\\Users\\maxen\\Documents\\ToknIsland",
};

export function openPreviewProject(state: CockpitState): CockpitState {
  return {
    ...state,
    project: previewProject,
    runnerStatus: "ready",
  };
}

export function projectLabel(project: ProjectSummary | null) {
  return project ? project.path : "No project selected";
}

export function sessionSummaries(state: CockpitState) {
  if (!state.project) {
    return defaultSessions;
  }

  return defaultSessions.map((session, index) =>
    index === 0
      ? {
          ...session,
          status: "Ready",
        }
      : session,
  );
}

export function cockpitMetrics(state: CockpitState) {
  if (!state.project) {
    return defaultMetrics;
  }

  return defaultMetrics.map((metric) => {
    if (metric.label === "Saved threads") {
      return { ...metric, value: "3" };
    }

    return metric;
  });
}
