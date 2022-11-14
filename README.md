Dall-E 2 AI art generator. This proxies calls to the OpenAI API via QStash in /api/image. QStash sends responses to /api/callback in the form of an image URL, which is persisted to Upstash Redis. The client polls /api/callback and loads the image URL from Redis once it's available.

Because API calls are handled by QStash rather than within the Vercel serverless function, they will not time out when deployed on Vercel's Hobby plan, which has a timeout limit of 10s. The same technique could be applied to a project deployed on the Pro plan to call an API that takes longer than 60s to respond.
