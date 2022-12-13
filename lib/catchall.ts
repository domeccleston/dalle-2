import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const QSTASH_PROXY = "https://qstash-proxy.vercel.app/api/queue"

type TaskConfig = {
    url: string,
    body?: Record<string, unknown>
    headers?: Record<string, string>
}

export type Handler = (req: NextApiRequest) => TaskConfig


export type Task = {
    name: string
    handler: Handler

}


export function queue(config: { tasks: Task[] }): NextApiHandler {

    return async (req: NextApiRequest, res: NextApiResponse) => {
        try {

            const catchall = req.query["tasks"]
            let taskName = typeof catchall === "string" ? catchall : catchall.at(0)

            console.log({ taskName })
            const task = config.tasks.find(t => t.name === taskName)
            if (!task) {
                res.status(404)
                return
            }

            const taskConfig = task.handler(req)
            const proxyResponse = await fetch(QSTASH_PROXY, {
                method: 'POST',
                headers: {
                    ...taskConfig.headers,
                    "Content-Type": "application/json",
                    "x-url": taskConfig.url,
                },
                body: taskConfig.body ? JSON.stringify(taskConfig.body) : undefined,
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