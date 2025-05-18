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

    const payload = {
      event_type: "add-signup",
      client_payload: { csv_line: csvLine }
    };

    const dispatchResponse = await fetch("https://api.github.com/repos/ipodpilot/ARC-shelter-standby-signup/dispatches", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        "Content-Type": "application/json",
        "Accept": "application/vnd.github.v3+json"
      },
      body: JSON.stringify(payload)
    });

    const resultText = await dispatchResponse.text();

return {
  statusCode: 200,
  body: "Success"
};

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message, stack: err.stack })
    };
  }
};
