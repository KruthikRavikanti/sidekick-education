"use client";

import { useEffect, useRef, useState } from "react";

export type GameFrameMessage = {
  type: string;
  height?: number;
  result?: unknown;
  message?: string;
};

/**
 * The only place generated game code runs. The frame is sandboxed with scripts
 * and nothing else, so it has its own empty origin: no cookies, no storage, no
 * access to this page. The server adds a policy that blocks every network
 * request from inside it.
 *
 * Messages are accepted only from this frame's window. When `token` is given,
 * they must also carry it; the kit keeps that token where game code cannot read it.
 */
export function GameFrame({
  src,
  title,
  kit,
  token,
  onMessage,
  onStopped,
}: {
  src: string;
  title: string;
  kit: string;
  token?: string;
  onMessage?: (message: GameFrameMessage) => void;
  onStopped: (reason: "error" | "stalled" | "left") => void;
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(560);
  const loads = useRef(0);
  const lastBeat = useRef(0);
  const fitRef = useRef<() => void>(() => undefined);
  const handlers = useRef({ onMessage, onStopped });
  useEffect(() => {
    handlers.current = { onMessage, onStopped };
  });

  useEffect(() => {
    function receive(event: MessageEvent) {
      // A sandboxed frame has an opaque origin, which the browser reports as "null".
      if (event.source !== frame.current?.contentWindow || event.origin !== "null")
        return;
      const data = event.data as Record<string, unknown> | null;
      if (!data || typeof data !== "object" || data.sidekick !== kit) return;
      if (token && data.token !== token) return;
      if (typeof data.type !== "string") return;
      lastBeat.current = Date.now();
      if (data.type === "resize") {
        const next = Number(data.height);
        if (Number.isFinite(next))
          setHeight(Math.min(1500, Math.max(320, Math.round(next))));
        return;
      }
      if (data.type === "error") {
        handlers.current.onStopped("error");
        return;
      }
      if (data.type === "event") {
        // When play starts, bring the whole game into view.
        const kind = (data.event as { kind?: unknown } | null)?.kind;
        if (kind === "start")
          frame.current?.scrollIntoView({ block: "start", behavior: "smooth" });
        return;
      }
      handlers.current.onMessage?.({
        type: data.type,
        result: data.result,
      });
    }
    window.addEventListener("message", receive);
    // Tell the game how tall it may be, so a whole round fits on a short screen.
    const fit = () =>
      frame.current?.contentWindow?.postMessage(
        { sidekick: kit, type: "fit", height: window.innerHeight - 20 },
        "*",
      );
    fitRef.current = fit;
    window.addEventListener("resize", fit);
    // The kit sends a heartbeat every second. Silence means the game froze.
    // Browsers slow timers in hidden tabs, so only judge while the tab is in view.
    const visible = () => {
      if (document.visibilityState === "visible" && lastBeat.current)
        lastBeat.current = Date.now();
    };
    document.addEventListener("visibilitychange", visible);
    const watch = setInterval(() => {
      if (
        document.visibilityState === "visible" &&
        lastBeat.current &&
        Date.now() - lastBeat.current > 9000
      )
        handlers.current.onStopped("stalled");
    }, 2000);
    return () => {
      window.removeEventListener("message", receive);
      window.removeEventListener("resize", fit);
      document.removeEventListener("visibilitychange", visible);
      clearInterval(watch);
    };
  }, [kit, token]);

  return (
    <iframe
      ref={frame}
      className="game-frame"
      title={title}
      src={src}
      sandbox="allow-scripts"
      referrerPolicy="no-referrer"
      allow=""
      loading="eager"
      style={{ height }}
      onLoad={() => {
        loads.current += 1;
        lastBeat.current = Date.now();
        fitRef.current();
        // A second load means the game tried to go somewhere else. Take it away.
        if (loads.current > 1) handlers.current.onStopped("left");
      }}
    />
  );
}
