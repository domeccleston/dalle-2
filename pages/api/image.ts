const QSTASH_PROXY = `https://qstash-proxy.vercel.app/api/queue`;

class Task {
  url: string;
  headers: { [key: string]: string };
  body: any;

  constructor(url: string, config) {
    this.url = url;
    this.headers = config.headers;
    this.body = config.body;
  }

  async enqueue() {
    const res = await fetch(QSTASH_PROXY, {
      method: 'POST',
      headers: {
        ...this.headers,
        "Content-Type": "application/json",
        "x-url": this.url,
      },
      body: JSON.stringify(this.body),
    });
    return res.json();
  }
}

export default async function handler(req, res) {
  const { prompt } = req.query;

  const task = new Task("https://api.openai.com/v1/images/generations", {
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: {
      prompt,
      n: 1,
      size: "1024x1024",
    }
  })

  try {
    const json = await task.enqueue();
    return res.status(202).json({ id: json.id });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message, type: "Internal server error" });
  }
}
