export default async function handler(req, res) {
  console.log(process.env.VERCEL_URL);
  res.status(200).send("test");
}
