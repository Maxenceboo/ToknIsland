import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { App } from "./App";

describe("App", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the cockpit shell", async () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "ToknIsland" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Cockpit" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Import project" })).toBeInTheDocument();
    expect(screen.getByText("Runner output")).toBeInTheDocument();
    expect(await screen.findByText(/Backend: preview/)).toBeInTheDocument();
  });

  it("opens the preview project as a folder tree", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "Import project" }));

    expect(screen.getByText("C:\\Users\\maxen\\Documents\\ToknIsland")).toBeInTheDocument();
    expect(screen.getByText("Project tree")).toBeInTheDocument();
    expect(screen.getAllByText("Scaffold setup.jsonl").length).toBeGreaterThan(0);
    expect(screen.getByText(/Project loaded: ToknIsland/)).toBeInTheDocument();
    expect(screen.getByText("ready")).toBeInTheDocument();
  });

  it("selects a thread file from the project tree", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "Import project" }));
    await user.click(screen.getByRole("button", { name: "Select thread Unit tests.jsonl" }));

    expect(screen.getByText(/Active conversation: Unit tests/)).toBeInTheDocument();
    expect(screen.getByText("Selected thread")).toBeInTheDocument();
    expect(screen.getByText("IA folder")).toBeInTheDocument();
    expect(screen.getAllByText("Codex").length).toBeGreaterThan(0);
  });

  it("restores imported projects without reimport after reload", async () => {
    const user = userEvent.setup();

    const { unmount } = render(<App />);

    await user.click(screen.getByRole("button", { name: "Import project" }));
    await user.click(screen.getByRole("button", { name: "Select thread Unit tests.jsonl" }));

    unmount();
    render(<App />);

    expect(screen.getByText("Project tree")).toBeInTheDocument();
    expect(screen.getAllByText("Unit tests.jsonl").length).toBeGreaterThan(0);
    expect(screen.getByText(/Active conversation: Unit tests/)).toBeInTheDocument();
  });

  it("detects and attaches an external terminal session", async () => {
    const user = userEvent.setup();

    render(<App />);

    expect(screen.getByText("PowerShell | pid 4242 | detected")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Attach Codex session from PowerShell" }));

    expect(screen.getByText("PowerShell | pid 4242 | attached")).toBeInTheDocument();
    expect(screen.getByText("running")).toBeInTheDocument();
  });
});
