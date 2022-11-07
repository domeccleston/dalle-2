async function callSlowAPI() {
	// mock a call to a slow external service
	await new Promise((resolve) => setTimeout(resolve, 11000));
}

export default async function handler(req, res) {
	// block main thread for 11 seconds
  const response = await callSlowAPI();

	// not sent: function will throw before reaching this code
  res.status(200).json({ message: 'responding after 11 seconds!' })
}