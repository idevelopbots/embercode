// api/vehicles.js

export default async function handler(req, res) {

    try {

        const response = await fetch(
            "https://api.erlc.gg/v2/server?Vehicles=true",
            {
                headers: {
                    "server-key": "wMDKuHwQrVEWEvyCEynF-WiDezheWTtqIXLQIlLmoICWddCjlpumqMyjkJfaJ"
                }
            }
        );

        const data = await response.json();

        res.status(200).json(data.Vehicles || []);

    } catch(error) {

        res.status(500).json({
            error: error.message
        });

    }

}
