// api/staff.js
export default async function handler(req, res) {

    const response = await fetch(
        "https://api.erlc.gg/v2/server?Staff=true",
        {
            headers: {
                "server-key": "uupNgrOZhpdCgwStivKZ-WiDezheWTtqIXLQIlLmoICWddCjlpumqMyjkJfaJ"
            }
        }
    );

    const data = await response.json();

    res.status(200).json(data);

}
