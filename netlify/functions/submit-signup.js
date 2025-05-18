const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body);

    const csvLine = [
      new Date().toISOString(),
      data.firstName,
      data.lastName,
      data.email,
      data.phone,
      data.backup,
      data.role,
      data.role === "Associate" ? data.interest : "",
      data.week
    ]
    .map(v => `"${(v || "").replace(/"/g, '""')}"`)
    .join(",");
console.log("Dispatching with CSV line:", csvLine);
    const response = await fetch("https://api.github.com/repos/ipodpilot/ARC-shelter-standby-signup/dispatches", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        "Content-Type": "application/json",
        "Accept": "application/vnd.github.v3+json"
      },
      body: JSON.stringify({
        event_type: "add-signup",
        client_payload: { csv_line: csvLine }
      })
    });

    return {
      statusCode: response.ok ? 200 : 500,
      body: response.ok ? "Success" : "GitHub dispatch failed"
    };
  } catch (err) {
    console.error("Function error:", err);
    return {
      statusCode: 500,
      body: "Function error: " + err.message
    };
  }
};
