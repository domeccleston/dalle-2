const PRODUCTION_URL = "https://vercel-serverless-timeout.vercel.app";
const MY_SLOW_API = `${PRODUCTION_URL}/api/timeout`;
const QSTASH_URL = `https://http-nodejs-production-9269.up.railway.app/`;

export default async function handler(req, res) {
  try {
    const qstashRequest = await fetch(QSTASH_URL + MY_SLOW_API, {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${process.env.QSTASH_TOKEN}`,
      },
      method: "POST",
    });
    const response = await qstashRequest.json();
    console.log(response);
    res.status(202).json({ message: `Enqueued new task with ID ${response?.messageId}` });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}
