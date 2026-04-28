import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "./App";

describe("App", () => {
  it("renders the cockpit shell", async () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "ToknIsland" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Cockpit" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open project" })).toBeInTheDocument();
    expect(screen.getByText("Runner output")).toBeInTheDocument();
    expect(await screen.findByText(/Backend: preview/)).toBeInTheDocument();
  });
});
