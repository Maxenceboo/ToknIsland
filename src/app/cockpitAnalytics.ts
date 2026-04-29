import type { CockpitMetric } from "./cockpitData";
import type { CockpitState, ImportedProject } from "./cockpitState";

export type HeatmapCell = {
  id: string;
  level: 0 | 1 | 2 | 3;
};

const PREVIEW_COST_PER_1K_TOKENS = 0.006;

export function parseTokenCount(value: string) {
  const normalized = value.trim().toLowerCase();

  if (normalized.endsWith("k")) {
    return Math.round(Number(normalized.slice(0, -1)) * 1000);
  }

  return Number(normalized.replaceAll(",", "")) || 0;
}

export function projectTokenTotal(project: ImportedProject | null) {
  if (!project) {
    return 0;
  }

  return project.agents.reduce(
    (projectTotal, agent) =>
      projectTotal +
      agent.conversations.reduce((agentTotal, conversation) => agentTotal + parseTokenCount(conversation.tokens), 0),
    0,
  );
}

export function estimatePreviewCost(tokens: number) {
  return `$${((tokens / 1000) * PREVIEW_COST_PER_1K_TOKENS).toFixed(2)}`;
}

export function analyticsMetrics(state: CockpitState, baseMetrics: CockpitMetric[]) {
  const tokens = projectTokenTotal(state.project);

  return baseMetrics.map((metric) => {
    if (metric.label === "Token cost") {
      return { ...metric, value: estimatePreviewCost(tokens) };
    }

    return metric;
  });
}

export function heatmapCells(state: CockpitState, runnerEvents: string[]): HeatmapCell[] {
  const tokens = projectTokenTotal(state.project);
  const signal = Math.min(3, Math.ceil(tokens / 1000));

  return Array.from({ length: 35 }).map((_, index) => {
    const eventBoost = runnerEvents.length > 0 && index >= 35 - Math.min(runnerEvents.length, 7) ? 1 : 0;
    const cadence = index % 7 === 0 ? signal : index % 5 === 0 ? Math.max(1, signal - 1) : 0;
    const level = Math.min(3, Math.max(cadence, eventBoost)) as HeatmapCell["level"];

    return {
      id: `cell-${index}`,
      level,
    };
  });
}
