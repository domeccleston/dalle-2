const PRODUCTION_URL = "https://vercel-serverless-timeout-one.vercel.app";
const MY_SLOW_API = `${PRODUCTION_URL}/api/timeout`;

export default async function handler(req, res) {
  try {
    const qstashRequest = await fetch(
      `${process.env.QSTASH_URL + MY_SLOW_API}`,
      {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${process.env.QSTASH_TOKEN}`,
        },
        method: "POST",
      }
    );
    const { messageId } = await qstashRequest.json();
    res.status(202).json({ message: `Enqueued new task with ID ${messageId}` });
  } catch (error) {
    res.status(500).json({ error });
  }
}
