"use client";

import { useTutorialStore } from "@/tutorial";

export default function HomePage() {
  const { start } = useTutorialStore();

  return (
    <div style={{ padding: 40 }}>
      <h1>Home Page</h1>
      {/* Trigger tutorial manually for testing */}
      <button onClick={() => start("1", 0)}>Open Chat</button>

      <div id="open-chat">okay</div>
    </div>
  );
}
