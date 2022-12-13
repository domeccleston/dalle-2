import { NextApiHandler, NextApiRequest } from "next";

const QSTASH_PROXY = "https://qstash-proxy.vercel.app/api/queue"

type Task = {
    url: string,
    body?: Record<string, unknown>
    headers?: Record<string, string>
}

export type Handler = (req: NextApiRequest) => Task



export function wrapper(h: Handler): NextApiHandler {

    return async (req, res) => {
        try {

            const task = h(req)
            const proxyResponse = await fetch(QSTASH_PROXY, {
                method: 'POST',
                headers: {
                    ...task.headers,
                    "Content-Type": "application/json",
                    "x-url": task.url,
                },
                body: task.body ? JSON.stringify(task.body) : undefined,
            });
            if (!proxyResponse.ok) {
                throw new Error(await proxyResponse.text())
            }

            const { id } = await proxyResponse.json() as { id: string }


            res.json({ id })
            return

        } catch (err) {
            if (err instanceof Error) {
                res.status(500).send(err.message)
            } else {
                throw err
            }
        }

    }
}