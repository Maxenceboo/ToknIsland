import { describe, expect, it } from "vitest";
import { healthcheck, isTauriRuntime, threadIdeTarget } from "./tauri";

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
});
