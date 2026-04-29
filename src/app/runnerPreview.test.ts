import { describe, expect, it } from "vitest";
import { previewProject } from "./cockpitState";
import { runnerPreviewEvent, runnerPreviewOutput } from "./runnerPreview";

const agent = previewProject.agents[0];
const conversation = agent.conversations[1];

describe("runnerPreview", () => {
  it("formats runner output with context and events", () => {
    const output = runnerPreviewOutput({
      project: previewProject,
      agent,
      conversation,
      backend: "preview (ToknIsland, browser-preview)",
      status: "running",
      events: [runnerPreviewEvent("scan", conversation)],
    });

    expect(output).toContain("Project loaded: ToknIsland");
    expect(output).toContain("Agent folder: Codex");
    expect(output).toContain("Runner status: running");
    expect(output).toContain("event: agent_discovery target=Unit tests.jsonl");
  });

  it("formats empty cockpit output", () => {
    const output = runnerPreviewOutput({
      project: null,
      agent: null,
      conversation: null,
      backend: "checking...",
      status: "idle",
      events: [],
    });

    expect(output).toContain("Waiting for a project and agent command.");
    expect(output).toContain("No active conversation.");
  });
});
