import { ERLC_KEY } from "../config.js";

export default async function handler(req, res) {
    try {

        const response = await fetch(
            "https://api.erlc.gg/v2/server?Staff=true",
            {
                headers: {
                    "server-key": ERLC_KEY
                }
            }
        );

        const data = await response.json();

        res.status(200).json(data);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }
}
