export default async function handler(req, res) {
  const response = atob(req.body);
  console.log(response);
  return res.status(200).send();
}
