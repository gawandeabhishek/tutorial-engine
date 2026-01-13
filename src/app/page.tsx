"use client";

import { useState } from "react";
import { useTutorialStore } from "@/tutorial";
import { TutorialEngine } from "@/tutorial/TutorialEngine";

export default function HomePage() {
  const { active, tutorialId, step, start, goTo, stop } = useTutorialStore();
  const [manualId, setManualId] = useState("");
  const [manualStep, setManualStep] = useState(0);

  return (
    <TutorialEngine>
      <main
        style={{
          padding: 40,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <h1>Manual Tutorial Test (Multiple Flows)</h1>

        <pre>{JSON.stringify({ active, tutorialId, step }, null, 2)}</pre>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => start("upload-flow")}>
            Start Upload Flow
          </button>
          <button onClick={() => start("chat-flow")}>Start Chat Flow</button>
          <button onClick={() => start("settings-flow")}>
            Start Settings Flow
          </button>
          <button onClick={stop}>Stop Tutorial</button>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input
            type="text"
            placeholder="Tutorial ID"
            value={manualId}
            onChange={(e) => setManualId(e.target.value)}
          />
          <input
            type="number"
            placeholder="Step"
            value={manualStep}
            onChange={(e) => setManualStep(Number(e.target.value))}
          />
          <button onClick={() => start(manualId, manualStep)}>Start</button>
          <button onClick={() => goTo(manualStep)}>Go To Step</button>
        </div>

        {/* Dummy elements for Upload Flow */}
        <button id="upload-btn">Upload Button</button>
        <input id="file-input" type="file" />
        <button id="confirm-upload-btn">Confirm Upload</button>
        <div id="upload-success" style={{ padding: 20, background: "#e0ffe0" }}>
          Upload Success!
        </div>

        {/* Dummy elements for Chat Flow */}
        <button id="open-chat">Open Chat</button>
        <input id="message-input" placeholder="Type message" />
        <button id="send-message-btn">Send Message</button>
        <div id="chat-success" style={{ padding: 20, background: "#e0f0ff" }}>
          Chat Success!
        </div>

        {/* Dummy elements for Settings Flow */}
        <button id="open-settings">Open Settings</button>
        <button id="toggle-darkmode">Toggle Dark Mode</button>
        <button id="save-settings-btn">Save Settings</button>
        <div
          id="settings-success"
          style={{ padding: 20, background: "#fff0e0" }}
        >
          Settings Saved!
        </div>
      </main>
    </TutorialEngine>
  );
}
