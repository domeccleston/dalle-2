import { Client } from "../../lib/client";

export default async function handler(req, res): Promise<{ id: string}> {
  const { prompt } = req.query;

  const task = new Client("https://api.openai.com/v1/images/generations", {
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: {
      prompt,
      n: 1,
      size: "1024x1024",
    }
  })

  try {
    const json = await task.enqueue();
    return res.status(202).json({ id: json.id });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message, type: "Internal server error" });
  }
}