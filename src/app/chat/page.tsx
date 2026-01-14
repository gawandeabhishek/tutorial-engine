"use client";

import { useTutorialStore } from "@/tutorial";
import { useEffect } from "react";

export default function ChatPage() {
  const { active, tutorialId, step, tours, setTours, start } =
    useTutorialStore();

  return (
    <div style={{ padding: 40 }}>
      <h1>Chat Page</h1>
      <input
        id="send-message-btn"
        placeholder="Type your message..."
        style={{ display: "block", marginBottom: 16 }}
      />
      <button
        id="message-input"
        onClick={() => {
          console.log("active", active);
          console.log("tutorialId", tutorialId);
          console.log("step", step);
        }}
      >
        Send Message
      </button>
      <hr style={{ margin: "24px 0" }} />
      <button onClick={() => start("1", 0)}>▶ Start Upload Tutorial</button>
    </div>
  );
}
