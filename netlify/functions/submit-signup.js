const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body);
    const weeks = data.weeks || [];

    const lines = weeks.map(week => {
      return [
        new Date().toISOString(),
        data.firstName,
        data.lastName,
        data.email,
        data.phone,
        data.backup,
        data.role,
        data.role === "Associate" ? data.interest : "",
        week
      ]
      .map(v => `"${(v || "").replace(/"/g, '""')}"`)
      .join(",");
    });

    const fullCsvBlock = lines.join("\\n");

    const response = await fetch("https://api.github.com/repos/ipodpilot/ARC-shelter-standby-signup/dispatches", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        "Content-Type": "application/json",
        "Accept": "application/vnd.github.v3+json"
      },
      body: JSON.stringify({
        event_type: "add-signup",
        client_payload: { csv_line: fullCsvBlock }
      })
    });

    return {
      statusCode: 200,
      body: "Success"
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: "Function error: " + err.message
    };
  }
};
