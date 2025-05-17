exports.handler = async (event) => {
  const data = JSON.parse(event.body);
  const token = process.env.GITHUB_TOKEN;

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

  const response = await fetch("https://api.github.com/repos/ipodpilot/ARC-shelter-standby-signup/dispatches", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
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
    body: response.ok ? "Success" : "GitHub API Error"
  };
};
