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
                    "server-key": "uupNgrOZhpdCgwStivKZ-WiDezheWTtqIXLQIlLmoICWddCjlpumqMyjkJfaJ",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    Command: command
                })
            }
        );

        const text = await response.text();

        console.log("ERLC Response:", text);

        return res.status(response.status).send(text);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            error: error.message
        });

    }

}
