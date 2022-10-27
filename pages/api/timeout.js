export default async function handler(req, res) {
  await new Promise((resolve) => setTimeout(resolve, 6000));
  res.status(200).json({ message: 'responding after 6 seconds' });
}
