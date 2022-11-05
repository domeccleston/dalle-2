import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  const { body } = req;
  const decoded = atob(body.body);
  console.log(decoded);
  console.log(body);
  console.log(redis);
  return res.status(200).send(decoded);
}
