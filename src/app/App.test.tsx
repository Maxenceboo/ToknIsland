import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("opens the preview project from the cockpit", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "Open project" }));

    expect(screen.getByText("C:\\Users\\maxen\\Documents\\ToknIsland")).toBeInTheDocument();
    expect(screen.getByText(/Project loaded: ToknIsland/)).toBeInTheDocument();
    expect(screen.getByText("ready")).toBeInTheDocument();
  });
});
