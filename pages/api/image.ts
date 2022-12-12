const QSTASH_PROXY = `https://qstash.upstash.io/v1/publish/`;

export default async function handler(req, res) {
  const { prompt } = req.query;
  try {
    const response = await fetch(`https://qstash-proxy.vercel.app/api/queue`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "x-url": "https://api.openai.com/v1/images/generations",
      },
      body: JSON.stringify({
        prompt,
        n: 1,
        size: "1024x1024",
      }),
    });
    const json = await response.json();
    console.log(json);
    return res.status(202).json({ id: json.messageId });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message, type: "Internal server error" });
  }
}
