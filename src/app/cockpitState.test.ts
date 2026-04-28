import { describe, expect, it } from "vitest";
import {
  activeConversation,
  agentWorkspaces,
  cockpitMetrics,
  conversationCount,
  initialCockpitState,
  openPreviewProject,
  projectLabel,
} from "./cockpitState";

describe("cockpit state", () => {
  it("starts without a selected project", () => {
    expect(projectLabel(initialCockpitState.project)).toBe("No project selected");
    expect(initialCockpitState.runnerStatus).toBe("idle");
  });

  it("opens the preview project in browser mode", () => {
    const state = openPreviewProject(initialCockpitState);

    expect(state.project?.name).toBe("ToknIsland");
    expect(state.activeAgentId).toBe("codex");
    expect(state.activeConversationId).toBe("codex-setup");
    expect(state.runnerStatus).toBe("ready");
    expect(projectLabel(state.project)).toContain("ToknIsland");
  });

  it("supports multiple agents and conversations per imported project", () => {
    const state = openPreviewProject(initialCockpitState);

    expect(agentWorkspaces(state)).toHaveLength(3);
    expect(conversationCount(state)).toBe(4);
    expect(activeConversation(state)).toMatchObject({ title: "Scaffold setup", status: "Ready" });
    expect(cockpitMetrics(state)).toContainEqual({ label: "Active agents", value: "3" });
    expect(cockpitMetrics(state)).toContainEqual({ label: "Saved threads", value: "4" });
  });
});
