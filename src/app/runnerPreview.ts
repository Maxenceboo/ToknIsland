import type { AgentWorkspace, ConversationSummary, ImportedProject, RunnerStatus } from "./cockpitState";

export type RunnerPreviewContext = {
  project: ImportedProject | null;
  agent: AgentWorkspace | null;
  conversation: ConversationSummary | null;
  backend: string;
  status: RunnerStatus;
  events: string[];
};

export function runnerPreviewEvent(action: "start" | "stop" | "resume", conversation: ConversationSummary | null) {
  const target = conversation ? `${conversation.title}.jsonl` : "pending thread";

  if (action === "start") {
    return `session_started target=${target}`;
  }

  if (action === "stop") {
    return `session_interrupted target=${target}`;
  }

  return `session_resumed target=${target}`;
}

export function runnerPreviewOutput(context: RunnerPreviewContext) {
  const lines = [
    "$ ToknIsland runner",
    context.project ? `Project loaded: ${context.project.name}` : "Waiting for a project and agent command.",
    context.agent ? `Agent folder: ${context.agent.name}` : "No IA selected.",
    context.conversation ? `Active conversation: ${context.conversation.title}` : "No active conversation.",
    `Runner status: ${context.status}`,
    `Backend: ${context.backend}`,
  ];

  if (context.events.length > 0) {
    lines.push("", ...context.events.map((event) => `event: ${event}`));
  }

  return lines.join("\n");
}
