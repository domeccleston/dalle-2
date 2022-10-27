export default async function handler(req, res) {
  await new Promise((resolve) => setTimeout(resolve, 11000));
  res.status(200).json({ message: 'responding after 11 seconds' });
}
