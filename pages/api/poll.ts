import { NextApiRequest, NextApiResponse } from "next";
import redis from "../../utils/redis";
import rateLimit from "../../utils/rate-limit";

const limiter = rateLimit({
  uniqueTokenPerInterval: 500, // 500 unique tokens per interval
  interval: 60000, // 1 minute
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id }: any = req.query;

  try {
    // Check if the user has exceeded maximum number of requests per minute
    await limiter.check(res, 60, "CACHE_TOKEN").catch((e) => {
      // 60 requests per minute (polling every second)
      return res.status(429).json({
        message:
          "You have exceeded the maximum number of requests. Please try again in a minute.",
        description: "The user has exceeded the maximum number of requests",
      });
    });
    const data = await redis.get(id);
    if (!data) return res.status(404).json({ message: "No data found" });
    else return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
