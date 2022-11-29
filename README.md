Dall-E 2 AI art generator. This proxies calls to the OpenAI API via QStash in /api/image. QStash sends responses to /api/callback in the form of an image URL, which is persisted to Upstash Redis. After calling the OpenAI API, the client polls Redis and loads the image URL once it's available.

Because API calls are handled by QStash rather than within the Vercel serverless function, they will not time out when deployed on Vercel's Hobby plan, which has a timeout limit of 10s. The same technique could be applied to a project deployed on the Pro plan to call an API that takes longer than 60s to respond.

To run this locally, you'll need to sign up to https://openai.com and create a new API key ($18 of free credit is available for new users) and set OPENAI_API_KEY accordingly. You'll also need to set environment variables to connect to Upstash: you can do this by [installing the Vercel Upstash integration](https://vercel.com/integrations/upstash).
