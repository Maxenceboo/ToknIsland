import { useEffect, useRef } from "react";
import { Terminal as XTerm } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";

export type LocalIaTerminalProps = {
  output: string;
  onInput: (data: string) => void;
};

export function LocalIaTerminal({ output, onInput }: LocalIaTerminalProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const terminalRef = useRef<XTerm | null>(null);
  const isTestRuntime = import.meta.env.MODE === "test";

  useEffect(() => {
    if (isTestRuntime) {
      return;
    }

    if (!hostRef.current || terminalRef.current) {
      return;
    }

    const terminal = new XTerm({
      convertEol: true,
      cursorBlink: true,
      fontFamily: '"JetBrains Mono", "Cascadia Mono", monospace',
      fontSize: 13,
      rows: 18,
      theme: {
        background: "#030609",
        foreground: "#c8d0d9",
        cursor: "#8ff0c2",
        selectionBackground: "#244238",
      },
    });

    terminal.open(hostRef.current);
    terminal.onData(onInput);
    terminalRef.current = terminal;

    return () => {
      terminal.dispose();
      terminalRef.current = null;
    };
  }, [isTestRuntime, onInput]);

  useEffect(() => {
    if (isTestRuntime) {
      return;
    }

    const terminal = terminalRef.current;

    if (!terminal) {
      return;
    }

    terminal.reset();
    terminal.write(output.replaceAll("\n", "\r\n"));
  }, [isTestRuntime, output]);

  if (isTestRuntime) {
    return (
      <pre className="local-terminal-test" aria-label="Local IA terminal">
        {output}
      </pre>
    );
  }

  return (
    <div className="local-terminal-shell">
      <div ref={hostRef} className="local-terminal" aria-label="Local IA terminal" />
      <pre className="terminal-transcript">{output}</pre>
    </div>
  );
}
