import { describe, expect, it } from "vitest";
import { healthcheck, isTauriRuntime } from "./tauri";

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
});
