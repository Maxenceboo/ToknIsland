import { describe, expect, it } from "vitest";
import {
  cockpitMetrics,
  initialCockpitState,
  openPreviewProject,
  projectLabel,
  sessionSummaries,
} from "./cockpitState";

describe("cockpit state", () => {
  it("starts without a selected project", () => {
    expect(projectLabel(initialCockpitState.project)).toBe("No project selected");
    expect(initialCockpitState.runnerStatus).toBe("idle");
  });

  it("opens the preview project in browser mode", () => {
    const state = openPreviewProject(initialCockpitState);

    expect(state.project?.name).toBe("ToknIsland");
    expect(state.runnerStatus).toBe("ready");
    expect(projectLabel(state.project)).toContain("ToknIsland");
  });

  it("derives session and metric data from selected project", () => {
    const state = openPreviewProject(initialCockpitState);

    expect(sessionSummaries(state)[0]).toMatchObject({ agent: "Codex", status: "Ready" });
    expect(cockpitMetrics(state)).toContainEqual({ label: "Saved threads", value: "3" });
  });
});
