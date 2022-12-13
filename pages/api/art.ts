import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "../../lib/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string | { id: string }>,
): Promise<void> {
  try {
    if (req.method !== "POST") {
      res
        .status(405)
        .send("Method not allowed");
      return;
    }
    const { prompt } = req.body;

    const task = new Client("https://api.openai.com/v1/images/generations", {
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: {
        prompt,
        n: 1,
        size: "1024x1024",
      },
    });

    const json = await task.enqueue();
    return res.status(202).json({ id: json.id });
  } catch (error) {
    res
      .status(500)
      .send(error.message);
  }
}
