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

export type RunnerStatus = "idle" | "ready" | "running" | "stopped";

export type CockpitState = {
  project: ImportedProject | null;
  activeAgentId: string | null;
  activeConversationId: string | null;
  runnerStatus: RunnerStatus;
};

export const initialCockpitState: CockpitState = {
  project: null,
  activeAgentId: null,
  activeConversationId: null,
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

export function openPreviewProject(state: CockpitState): CockpitState {
  const firstAgent = previewProject.agents[0];
  const firstConversation = firstAgent?.conversations[0];

  return {
    ...state,
    project: previewProject,
    activeAgentId: firstAgent?.id ?? null,
    activeConversationId: firstConversation?.id ?? null,
    runnerStatus: "ready",
  };
}

export function projectLabel(project: ImportedProject | null) {
  return project ? project.path : "No project selected";
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
