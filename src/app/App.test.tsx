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
    expect(screen.getByLabelText("Active context")).toBeInTheDocument();
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
    expect(screen.getByText("browser-preview")).toBeInTheDocument();
    expect(screen.getByText(/Project loaded: ToknIsland/)).toBeInTheDocument();
    expect(screen.getAllByText("ready").length).toBeGreaterThan(0);
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

  it("shows preview feedback for thread actions", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "Import project" }));
    await user.click(screen.getByRole("button", { name: "Select thread Unit tests.jsonl" }));

    expect(screen.getByLabelText("Thread actions")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Open in IDE" }));

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Would open C:\\Users\\maxen\\Documents\\ToknIsland\\.toknisland\\threads\\codex-tests.jsonl in VS Code",
    );
  });

  it("resumes a selected thread into the runner view", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "Import project" }));
    await user.click(screen.getByRole("button", { name: "Select thread Unit tests.jsonl" }));
    await user.click(screen.getByRole("button", { name: "Resume" }));

    expect(screen.getAllByText("running").length).toBeGreaterThan(0);
    expect(screen.getByRole("status")).toHaveTextContent(
      "Would resume Unit tests.jsonl from .toknisland/threads/codex-tests.jsonl",
    );
  });

  it("shows a raw JSONL preview for the selected thread", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "Import project" }));
    await user.click(screen.getByRole("button", { name: "Select thread Unit tests.jsonl" }));
    await user.click(screen.getByRole("button", { name: "Raw JSONL" }));

    expect(screen.getByText("Raw JSONL", { selector: ".panel-header span" })).toBeInTheDocument();
    expect(screen.getByText(/"type":"session_resumed"/)).toBeInTheDocument();
    expect(screen.getByText(/"thread_id":"codex-tests"/)).toBeInTheDocument();
  });

  it("starts and stops the preview runner from the topbar", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "Start agent" }));

    expect(screen.getByText(/Project loaded: ToknIsland/)).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Started preview runner for the active thread.");
    expect(screen.getAllByText("running").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: "Stop agent" }));

    expect(screen.getByRole("status")).toHaveTextContent("Stopped preview runner.");
    expect(screen.getAllByText("stopped").length).toBeGreaterThan(0);
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
    expect(screen.getAllByText("running").length).toBeGreaterThan(0);
  });
});
