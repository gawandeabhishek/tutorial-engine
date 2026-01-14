"use client";

import { useState } from "react";

export default function UploadPage() {
  const [uploaded, setUploaded] = useState(false);

  return (
    <div style={{ padding: 40 }}>
      <h1>Upload Page</h1>

      {/* Step 4 */}
      <input
        id="upload-input"
        type="file"
        style={{ display: "block", marginBottom: 16 }}
      />

      {/* Step 5 */}
      <button id="upload-submit-btn" onClick={() => setUploaded(true)}>
        Upload
      </button>

      {/* Step 6 */}
      {uploaded && (
        <div id="upload-success" style={{ marginTop: 20, color: "green" }}>
          ✅ Upload Successful
        </div>
      )}
    </div>
  );
}
