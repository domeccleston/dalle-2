const QSTASH_PROXY = `https://qstash-proxy.vercel.app/api/queue`;

export class Client {
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
