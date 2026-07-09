export default async function handler(req, res) {

    if(req.method !== "POST"){
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

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
                command
            })
        }
    );

    const data = await response.json();

    res.status(200).json(data);
}
