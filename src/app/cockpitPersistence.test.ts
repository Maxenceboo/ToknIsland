import { describe, expect, it, beforeEach } from "vitest";
import { openPreviewProject, selectConversation, initialCockpitState } from "./cockpitState";
import { COCKPIT_STORAGE_KEY, loadCockpitState, saveCockpitState } from "./cockpitPersistence";

describe("cockpit persistence", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("loads the initial state when no local data exists", () => {
    expect(loadCockpitState()).toEqual(initialCockpitState);
  });

  it("persists imported projects and active thread selection", () => {
    const state = selectConversation(openPreviewProject(initialCockpitState), "codex", "codex-tests");

    saveCockpitState(state);

    const restored = loadCockpitState();

    expect(window.localStorage.getItem(COCKPIT_STORAGE_KEY)).toContain("ToknIsland");
    expect(restored.importedProjects).toHaveLength(1);
    expect(restored.project?.name).toBe("ToknIsland");
    expect(restored.activeAgentId).toBe("codex");
    expect(restored.activeConversationId).toBe("codex-tests");
    expect(restored.externalSessions).toEqual([]);
  });

  it("falls back safely when stored data is invalid", () => {
    window.localStorage.setItem(COCKPIT_STORAGE_KEY, "{broken");

    expect(loadCockpitState()).toEqual(initialCockpitState);
  });
});
