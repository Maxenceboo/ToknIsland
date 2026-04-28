import { describe, expect, it } from "vitest";
import {
  activeConversation,
  attachExternalSession,
  agentWorkspaces,
  cockpitMetrics,
  conversationCount,
  detectPreviewExternalSessions,
  ensureImportedProject,
  importedProjectCount,
  initialCockpitState,
  openPreviewProject,
  previewProject,
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
    expect(importedProjectCount(state)).toBe(1);
    expect(state.activeAgentId).toBe("codex");
    expect(state.activeConversationId).toBe("codex-setup");
    expect(state.runnerStatus).toBe("ready");
    expect(projectLabel(state.project)).toContain("ToknIsland");
  });

  it("does not duplicate a project that was already imported", () => {
    const importedOnce = ensureImportedProject([], previewProject);
    const importedTwice = ensureImportedProject(importedOnce, previewProject);

    expect(importedTwice).toHaveLength(1);
  });

  it("supports multiple agents and conversations per imported project", () => {
    const state = openPreviewProject(initialCockpitState);

    expect(agentWorkspaces(state)).toHaveLength(3);
    expect(conversationCount(state)).toBe(4);
    expect(activeConversation(state)).toMatchObject({ title: "Scaffold setup", status: "Ready" });
    expect(cockpitMetrics(state)).toContainEqual({ label: "Active agents", value: "3" });
    expect(cockpitMetrics(state)).toContainEqual({ label: "Saved threads", value: "4" });
  });

  it("detects and attaches an external terminal agent session", () => {
    const detected = detectPreviewExternalSessions(initialCockpitState);

    expect(detected.externalSessions).toContainEqual(
      expect.objectContaining({
        agentName: "Codex",
        terminal: "PowerShell",
        status: "detected",
      }),
    );

    const attached = attachExternalSession(detected, "external-codex-terminal");

    expect(attached.runnerStatus).toBe("running");
    expect(attached.project?.path).toBe(previewProject.path);
    expect(attached.externalSessions[0]).toMatchObject({ status: "attached" });
  });
});
