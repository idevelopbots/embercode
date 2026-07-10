export default async function handler(req, res) {
    const response = await fetch(
        "https://api.erlc.gg/v2/server?Players=true",
        {
            headers: {
                "server-key": "wMDKuHwQrVEWEvyCEynF-WiDezheWTtqIXLQIlLmoICWddCjlpumqMyjkJfaJ"
            }
        }
    );

    const data = await response.json();

    res.status(200).json(data.Players || []);
}
