// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  await new Promise((resolve) => setTimeout(resolve, 70000));
  res.status(200).json({ message: 'this will not occur' })
}
