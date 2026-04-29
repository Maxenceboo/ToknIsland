import { describe, expect, it } from "vitest";
import { initialCockpitState, openPreviewProject } from "./cockpitState";
import { analyticsMetrics, estimatePreviewCost, heatmapCells, parseTokenCount, projectTokenTotal } from "./cockpitAnalytics";

describe("cockpitAnalytics", () => {
  it("parses compact token strings", () => {
    expect(parseTokenCount("1.2k")).toBe(1200);
    expect(parseTokenCount("840")).toBe(840);
    expect(parseTokenCount("0")).toBe(0);
  });

  it("calculates project token totals and preview cost", () => {
    const state = openPreviewProject(initialCockpitState);

    expect(projectTokenTotal(state.project)).toBe(2040);
    expect(estimatePreviewCost(2040)).toBe("$0.01");
  });

  it("updates token cost metrics", () => {
    const state = openPreviewProject(initialCockpitState);
    const metrics = analyticsMetrics(state, [{ label: "Token cost", value: "$0.00" }]);

    expect(metrics).toContainEqual({ label: "Token cost", value: "$0.01" });
  });

  it("builds heatmap cells from tokens and runner events", () => {
    const state = openPreviewProject(initialCockpitState);
    const cells = heatmapCells(state, ["session_started target=Scaffold setup.jsonl"]);

    expect(cells).toHaveLength(35);
    expect(cells.some((cell) => cell.level > 0)).toBe(true);
    expect(cells.at(-1)).toMatchObject({ level: 1 });
  });
});
