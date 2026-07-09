export default async function handler(req, res) {

    try {

        const { command } = req.body;

        console.log("Received command:", command);

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

        console.log("ERLC Status:", response.status);
        console.log("ERLC Response:", text);

        return res.status(200).json({
            erlcStatus: response.status,
            erlcResponse: text
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: error.message
        });

    }

}
