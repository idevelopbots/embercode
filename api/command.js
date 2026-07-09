export default async function handler(req, res) {

    console.log("REQUEST METHOD:", req.method);
    console.log("REQUEST BODY:", req.body);

    try {

        const command = req.body?.command;

        console.log("COMMAND:", command);

        const response = await fetch(
            "https://api.erlc.gg/v2/server/command",
            {
                method: "POST",
                headers: {
                    "server-key": "uupNgrOZhpdCgwStivKZ-WiDezheWTtqIXLQIlLmoICWddCjlpumqMyjkJfaJ",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    command
                })
            }
        );

        const responseText = await response.text();

        console.log("ERLC STATUS:", response.status);
        console.log("ERLC RESPONSE:", responseText);

        return res.status(200).json({
            status: response.status,
            response: responseText
        });

    } catch (err) {

        console.error("ERROR:", err);

        return res.status(500).json({
            error: err.message
        });

    }

}
