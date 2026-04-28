import { type CockpitState, initialCockpitState } from "./cockpitState";

export const COCKPIT_STORAGE_KEY = "toknisland.cockpit.v1";

type PersistedCockpitState = {
  importedProjects: CockpitState["importedProjects"];
  selectedProjectPath: string | null;
  activeAgentId: string | null;
  activeConversationId: string | null;
};

export function loadCockpitState(): CockpitState {
  if (!canUseLocalStorage()) {
    return initialCockpitState;
  }

  const rawValue = window.localStorage.getItem(COCKPIT_STORAGE_KEY);

  if (!rawValue) {
    return initialCockpitState;
  }

  try {
    const persisted = JSON.parse(rawValue) as PersistedCockpitState;
    const selectedProject =
      persisted.importedProjects.find((project) => project.path === persisted.selectedProjectPath) ??
      persisted.importedProjects[0] ??
      null;

    return {
      ...initialCockpitState,
      importedProjects: persisted.importedProjects,
      project: selectedProject,
      activeAgentId: persisted.activeAgentId,
      activeConversationId: persisted.activeConversationId,
      runnerStatus: selectedProject ? "ready" : "idle",
    };
  } catch {
    return initialCockpitState;
  }
}

export function saveCockpitState(state: CockpitState) {
  if (!canUseLocalStorage()) {
    return;
  }

  const persisted: PersistedCockpitState = {
    importedProjects: state.importedProjects,
    selectedProjectPath: state.project?.path ?? null,
    activeAgentId: state.activeAgentId,
    activeConversationId: state.activeConversationId,
  };

  window.localStorage.setItem(COCKPIT_STORAGE_KEY, JSON.stringify(persisted));
}

function canUseLocalStorage() {
  return typeof window !== "undefined" && "localStorage" in window;
}
