export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {

        const { command } = req.body;

        const response = await fetch(
            "https://api.erlc.gg/v2/server/command",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "server-key": "uupNgrOZhpdCgwStivKZ-WiDezheWTtqIXLQIlLmoICWddCjlpumqMyjkJfaJ"
                },
                body: JSON.stringify({
                    command: command
                })
            }
        );

        const data = await response.json();

        return res.status(200).json(data);

    } catch (error) {

        return res.status(500).json({
            success: false,
            error: error.message
        });

    }
}
