import { describe, expect, it } from "vitest";
import { previewProject } from "./cockpitState";
import { formatTokenCount, summarizeAgent } from "./agentSummary";

describe("agentSummary", () => {
  it("summarizes thread and token totals for an agent folder", () => {
    expect(summarizeAgent(previewProject.agents[0])).toEqual({
      threadCount: 2,
      tokenCount: 2040,
      tokenLabel: "2k",
    });
  });

  it("formats small and compact token counts", () => {
    expect(formatTokenCount(840)).toBe("840");
    expect(formatTokenCount(1200)).toBe("1.2k");
    expect(formatTokenCount(2040)).toBe("2k");
  });
});
