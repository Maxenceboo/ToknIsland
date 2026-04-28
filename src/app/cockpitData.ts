export type SessionSummary = {
  id: string;
  agent: string;
  status: string;
  tokens: string;
};

export type CockpitMetric = {
  label: string;
  value: string;
};

export const sessions: SessionSummary[] = [
  { id: "local-draft", agent: "Codex", status: "Idle", tokens: "0" },
  { id: "runner-plan", agent: "Claude", status: "Planned", tokens: "0" },
  { id: "analytics", agent: "Custom", status: "Backlog", tokens: "0" },
];

export const metrics: CockpitMetric[] = [
  { label: "Active agents", value: "0" },
  { label: "Saved threads", value: "0" },
  { label: "Token cost", value: "$0.00" },
];
