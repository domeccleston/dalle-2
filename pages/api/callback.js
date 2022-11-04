export default async function handler(req, res) {
  const { body } = req;
  console.log(body)
  const response = atob(body);
  console.log(response);
  return res.status(200).send();
}
