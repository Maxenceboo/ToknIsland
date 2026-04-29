import { describe, expect, it } from "vitest";
import { healthcheck, isTauriRuntime, terminalStart, terminalStop, terminalWrite, threadIdeTarget } from "./tauri";

describe("tauri bridge", () => {
  it("detects browser preview outside of Tauri", () => {
    expect(isTauriRuntime()).toBe(false);
  });

  it("returns a browser preview healthcheck outside of Tauri", async () => {
    await expect(healthcheck()).resolves.toEqual({
      status: "preview",
      app: "ToknIsland",
      localFirst: true,
      runtime: "browser-preview",
    });
  });

  it("builds preview thread IDE targets outside of Tauri", async () => {
    const target = await threadIdeTarget("C:\\Users\\maxen\\Documents\\ToknIsland", "codex-tests");

    expect(target.path).toBe("C:\\Users\\maxen\\Documents\\ToknIsland\\.toknisland\\threads\\codex-tests.jsonl");
    expect(target.uri).toBe(
      "vscode://file/C:/Users/maxen/Documents/ToknIsland/.toknisland/threads/codex-tests.jsonl",
    );
  });

  it("provides browser-preview terminal bridge fallbacks", async () => {
    await expect(
      terminalStart({
        projectPath: "C:\\Users\\maxen\\Documents\\ToknIsland",
        agentId: "codex",
        threadId: "codex-tests",
      }),
    ).resolves.toEqual({
      sessionId: "codex-tests",
      runtime: "browser-preview",
    });
    await expect(terminalWrite({ sessionId: "codex-tests", data: "hello" })).resolves.toBeUndefined();
    await expect(terminalStop({ sessionId: "codex-tests" })).resolves.toBeUndefined();
  });
});
