export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {

        const command = req.body.command;

        const response = await fetch(
            "https://api.erlc.gg/v2/server/command",
            {
                method: "POST",
                headers: {
                    "server-key": "uupNgrOZhpdCgwStivKZ-WiDezheWTtqIXLQIlLmoICWddCjlpumqMyjkJfaJ",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    command: command
                })
            }
        );

        const text = await response.text();

        return res.status(200).json({
            status: response.status,
            response: text
        });

    } catch (error) {

        return res.status(500).json({
            error: error.message
        });

    }

}
