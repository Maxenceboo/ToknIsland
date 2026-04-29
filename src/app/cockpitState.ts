import { metrics as defaultMetrics } from "./cockpitData";

export type ConversationSummary = {
  id: string;
  title: string;
  status: string;
  tokens: string;
};

export type AgentWorkspace = {
  id: string;
  name: string;
  accent: string;
  conversations: ConversationSummary[];
};

export type ImportedProject = {
  name: string;
  path: string;
  agents: AgentWorkspace[];
};

export type ExternalAgentSession = {
  id: string;
  projectPath: string;
  agentName: string;
  terminal: string;
  pid: number;
  status: "detected" | "attached";
};

export type RunnerStatus = "idle" | "ready" | "running" | "stopped";

export type CockpitState = {
  importedProjects: ImportedProject[];
  project: ImportedProject | null;
  activeAgentId: string | null;
  activeConversationId: string | null;
  externalSessions: ExternalAgentSession[];
  runnerStatus: RunnerStatus;
};

export const initialCockpitState: CockpitState = {
  importedProjects: [],
  project: null,
  activeAgentId: null,
  activeConversationId: null,
  externalSessions: [],
  runnerStatus: "idle",
};

export const previewProject: ImportedProject = {
  name: "ToknIsland",
  path: "C:\\Users\\maxen\\Documents\\ToknIsland",
  agents: [
    {
      id: "codex",
      name: "Codex",
      accent: "teal",
      conversations: [
        { id: "codex-setup", title: "Scaffold setup", status: "Ready", tokens: "1.2k" },
        { id: "codex-tests", title: "Unit tests", status: "Completed", tokens: "840" },
      ],
    },
    {
      id: "claude",
      name: "Claude",
      accent: "violet",
      conversations: [{ id: "claude-arch", title: "Architecture review", status: "Planned", tokens: "0" }],
    },
    {
      id: "gemini",
      name: "Gemini",
      accent: "blue",
      conversations: [{ id: "gemini-research", title: "Model pricing research", status: "Backlog", tokens: "0" }],
    },
  ],
};

export const previewExternalSession: ExternalAgentSession = {
  id: "external-codex-terminal",
  projectPath: previewProject.path,
  agentName: "Codex",
  terminal: "PowerShell",
  pid: 4242,
  status: "detected",
};

export function openPreviewProject(state: CockpitState): CockpitState {
  const importedProjects = ensureImportedProject(state.importedProjects, previewProject);
  const firstAgent = previewProject.agents[0];
  const firstConversation = firstAgent?.conversations[0];

  return {
    ...state,
    importedProjects,
    project: previewProject,
    activeAgentId: firstAgent?.id ?? null,
    activeConversationId: firstConversation?.id ?? null,
    runnerStatus: "ready",
  };
}

export function ensureImportedProject(projects: ImportedProject[], project: ImportedProject) {
  if (projects.some((importedProject) => importedProject.path === project.path)) {
    return projects;
  }

  return [...projects, project];
}

export function detectPreviewExternalSessions(state: CockpitState): CockpitState {
  if (state.externalSessions.some((session) => session.id === previewExternalSession.id)) {
    return state;
  }

  return {
    ...state,
    externalSessions: [...state.externalSessions, previewExternalSession],
  };
}

export function attachExternalSession(state: CockpitState, sessionId: string): CockpitState {
  const session = state.externalSessions.find((externalSession) => externalSession.id === sessionId);

  if (!session) {
    return state;
  }

  const nextState = openPreviewProject(state);

  return {
    ...nextState,
    externalSessions: nextState.externalSessions.map((externalSession) =>
      externalSession.id === sessionId ? { ...externalSession, status: "attached" } : externalSession,
    ),
    runnerStatus: "running",
  };
}

export function selectConversation(state: CockpitState, agentId: string, conversationId: string): CockpitState {
  const agent = state.project?.agents.find((candidate) => candidate.id === agentId);
  const conversation = agent?.conversations.find((candidate) => candidate.id === conversationId);

  if (!agent || !conversation) {
    return state;
  }

  return {
    ...state,
    activeAgentId: agent.id,
    activeConversationId: conversation.id,
    runnerStatus: conversation.status === "Ready" ? "ready" : state.runnerStatus,
  };
}

export function resumeConversation(state: CockpitState): CockpitState {
  if (!state.project || !state.activeAgentId || !state.activeConversationId) {
    return state;
  }

  return {
    ...state,
    runnerStatus: "running",
  };
}

export function projectLabel(project: ImportedProject | null) {
  return project ? project.path : "No project selected";
}

export function activeAgent(state: CockpitState) {
  if (!state.project || !state.activeAgentId) {
    return null;
  }

  return state.project.agents.find((agent) => agent.id === state.activeAgentId) ?? null;
}

export function importedProjectCount(state: CockpitState) {
  return state.importedProjects.length;
}

export function agentWorkspaces(state: CockpitState) {
  if (!state.project) {
    return [];
  }

  return state.project.agents;
}

export function activeConversation(state: CockpitState) {
  if (!state.project || !state.activeAgentId || !state.activeConversationId) {
    return null;
  }

  return (
    state.project.agents
      .find((agent) => agent.id === state.activeAgentId)
      ?.conversations.find((conversation) => conversation.id === state.activeConversationId) ?? null
  );
}

export function conversationCount(state: CockpitState) {
  return state.project?.agents.reduce((total, agent) => total + agent.conversations.length, 0) ?? 0;
}

export function cockpitMetrics(state: CockpitState) {
  const project = state.project;

  if (!project) {
    return defaultMetrics;
  }

  return defaultMetrics.map((metric) => {
    if (metric.label === "Saved threads") {
      return { ...metric, value: String(conversationCount(state)) };
    }

    if (metric.label === "Active agents") {
      return { ...metric, value: String(project.agents.length) };
    }

    return metric;
  });
}
