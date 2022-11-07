import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  const { body } = req;
  console.log(body)
  try {
    const decoded = atob(body.body);
    console.log(decoded)
    const data = await redis.set(body.sourceMessageId, decoded);
    console.log(data);
    return res.status(200).send(decoded);
  } catch (error) {
    console.error(error);
  }
}
