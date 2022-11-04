export default async function handler(req, res) {
  const { body } = req;
  console.log(body.body);
  return res.status(200).send();
}
