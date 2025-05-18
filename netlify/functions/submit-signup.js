const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body);
    const weeks = data.weeks || [];

    if (!Array.isArray(weeks) || weeks.length === 0) {
      return { statusCode: 400, body: "No weeks selected." };
    }

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

    const csvBlock = lines.join("\n");

    const response = await fetch("https://api.github.com/repos/ipodpilot/ARC-shelter-standby-signup/dispatches", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        "Content-Type": "application/json",
        "Accept": "application/vnd.github.v3+json"
      },
      body: JSON.stringify({
        event_type: "add-signup",
        client_payload: { csv_line: csvBlock }
      })
    });

    const resultText = await response.text();

    return {
      statusCode: response.ok ? 200 : 500,
      body: response.ok ? "Success" : resultText
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: "Function error: " + err.message
    };
  }
};
