const PRODUCTION_URL = "https://vercel-serverless-timeout.vercel.app";
const MY_SLOW_API = `https://http-nodejs-production-9269.up.railway.app/`;
const QSTASH_URL = `https://qstash.upstash.io/v1/publish/`;

export default async function handler(req, res) {
  try {
    const qstashRequest = await fetch(QSTASH_URL + MY_SLOW_API, {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${process.env.QSTASH_TOKEN}`,
        "Upstash-Callback": `${process.env.VERCEL_URL}/api/callback`
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
