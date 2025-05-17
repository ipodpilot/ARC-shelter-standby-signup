const fetch = require("node-fetch");

const GITHUB_TOKEN = "ghp_your_token_here"; // Replace with your real token
const REPO = "ipodpilot/ARC-shelter-standby-signup";

const signup = {
  timestamp: new Date().toISOString(),
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phone: "123-456",
  backup: "321-654",
  role: "Associate",
  interest: "Yes",
  week: "2025-06-09"
};

const csvLine = Object.values(signup)
  .map(v => `"${(v || "").replace(/"/g, '""')}"`)
  .join(",");

fetch(`https://api.github.com/repos/${REPO}/dispatches`, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${GITHUB_TOKEN}`,
    "Accept": "application/vnd.github.v3+json",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    event_type: "add-signup",
    client_payload: {
      csv_line: csvLine
    }
  })
})
  .then(res => res.text())
  .then(data => console.log("GitHub API response:", data))
  .catch(err => console.error("Error:", err));
