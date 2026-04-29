import { type CockpitState, initialCockpitState } from "./cockpitState";

export const COCKPIT_STORAGE_KEY = "toknisland.cockpit.v1";
export const COCKPIT_UI_STORAGE_KEY = "toknisland.cockpit-ui.v1";

export type PersistedCockpitUiState = {
  terminalMode: "runner" | "raw-jsonl";
  runnerEvents: string[];
};

export const initialCockpitUiState: PersistedCockpitUiState = {
  terminalMode: "runner",
  runnerEvents: [],
};

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

export function loadCockpitUiState(): PersistedCockpitUiState {
  if (!canUseLocalStorage()) {
    return initialCockpitUiState;
  }

  const rawValue = window.localStorage.getItem(COCKPIT_UI_STORAGE_KEY);

  if (!rawValue) {
    return initialCockpitUiState;
  }

  try {
    const persisted = JSON.parse(rawValue) as Partial<PersistedCockpitUiState>;

    return {
      terminalMode: persisted.terminalMode === "raw-jsonl" ? "raw-jsonl" : "runner",
      runnerEvents: Array.isArray(persisted.runnerEvents)
        ? persisted.runnerEvents.filter((event): event is string => typeof event === "string").slice(-25)
        : [],
    };
  } catch {
    return initialCockpitUiState;
  }
}

export function saveCockpitUiState(state: PersistedCockpitUiState) {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(
    COCKPIT_UI_STORAGE_KEY,
    JSON.stringify({
      terminalMode: state.terminalMode,
      runnerEvents: state.runnerEvents.slice(-25),
    }),
  );
}

function canUseLocalStorage() {
  return typeof window !== "undefined" && "localStorage" in window;
}
