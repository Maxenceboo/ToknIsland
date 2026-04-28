import { describe, expect, it } from "vitest";
import { metrics, sessions } from "./cockpitData";

describe("cockpit data", () => {
  it("starts with no active agent usage", () => {
    expect(metrics).toContainEqual({ label: "Active agents", value: "0" });
    expect(metrics).toContainEqual({ label: "Token cost", value: "$0.00" });
  });

  it("keeps session ids unique", () => {
    const ids = sessions.map((session) => session.id);

    expect(new Set(ids).size).toBe(ids.length);
  });
});
