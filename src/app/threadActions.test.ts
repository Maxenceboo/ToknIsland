import { describe, expect, it } from "vitest";
import { previewProject } from "./cockpitState";
import {
  threadActionFeedback,
  threadJsonlAbsolutePath,
  threadJsonlRelativePath,
  previewThreadJsonl,
  vscodeThreadUri,
} from "./threadActions";

const agent = previewProject.agents[0];
const conversation = previewProject.agents[0].conversations[1];

describe("threadActions", () => {
  it("builds stable JSONL paths for selected threads", () => {
    expect(threadJsonlRelativePath(conversation)).toBe(".toknisland/threads/codex-tests.jsonl");
    expect(threadJsonlAbsolutePath(previewProject, conversation)).toBe(
      "C:\\Users\\maxen\\Documents\\ToknIsland\\.toknisland\\threads\\codex-tests.jsonl",
    );
  });

  it("builds the VS Code file URI used by the native interop command", () => {
    expect(vscodeThreadUri(previewProject, conversation)).toBe(
      "vscode://file/C:/Users/maxen/Documents/ToknIsland/.toknisland/threads/codex-tests.jsonl",
    );
  });

  it("describes preview thread actions without touching the filesystem", () => {
    expect(threadActionFeedback("open-ide", previewProject, conversation)).toBe(
      "Would open .toknisland/threads/codex-tests.jsonl in VS Code",
    );
    expect(threadActionFeedback("raw-jsonl", previewProject, conversation)).toBe(
      "Would inspect raw JSONL at .toknisland/threads/codex-tests.jsonl",
    );
  });

  it("builds a safe preview JSONL payload for the raw thread view", () => {
    const lines = previewThreadJsonl(previewProject, agent, conversation).split("\n");

    expect(lines).toHaveLength(3);
    expect(JSON.parse(lines[0])).toMatchObject({
      type: "session_resumed",
      thread_id: "codex-tests",
    });
    expect(JSON.parse(lines[1])).toMatchObject({
      storage: ".toknisland/threads/codex-tests.jsonl",
    });
  });
});
