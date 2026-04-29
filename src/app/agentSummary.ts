import { parseTokenCount } from "./cockpitAnalytics";
import type { AgentWorkspace } from "./cockpitState";

export type AgentSummary = {
  threadCount: number;
  tokenCount: number;
  tokenLabel: string;
};

export function summarizeAgent(agent: AgentWorkspace): AgentSummary {
  const tokenCount = agent.conversations.reduce(
    (total, conversation) => total + parseTokenCount(conversation.tokens),
    0,
  );

  return {
    threadCount: agent.conversations.length,
    tokenCount,
    tokenLabel: formatTokenCount(tokenCount),
  };
}

export function formatTokenCount(tokens: number) {
  if (tokens >= 1000) {
    return `${Number((tokens / 1000).toFixed(1))}k`;
  }

  return String(tokens);
}
