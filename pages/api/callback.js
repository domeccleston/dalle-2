export default async function handler(req, res) {
  const { body } = req;
  const decoded = atob(body.body);
  console.log(decoded);
  return res.status(200).send(decoded);
}
