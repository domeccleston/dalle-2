import { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  organization: process.env.OPENAI_API_ORG,
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

function generatePrompt(place: string) {
  const capitalizedPlace = place[0].toUpperCase() + place.slice(1).toLowerCase()
  return `Actúa como un experto guía de turista y dame una breve descripción basada en datos reales del lugar, palabras clave para SEO y puntos a destacar de este lugar: ${capitalizedPlace} en México
  
  Ejemplo:
  Lugar: Ciudad de México
  Descripción: "Explora el corazón de México a través de viajar a la Ciudad de México. Sumérgete en una cultura vibrante y disfruta de la comida tradicional, mientras experimentas la historia y la belleza de esta ciudad dinámica."
  Palabras clave para SEO: "Ciudad de México", "Cultura vibrante", "Comida tradicional"
  Puntos a destacar: Cultura vibrante y colorida", "Mercados y tiendas bulliciosos", "Historia y arquitectura ricas"
  `
}

async function generateContent(req: NextApiRequest, res: NextApiResponse) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: 'OpenAI API key not configured, please follow instructions in README.md',
      },
    })
    return
  }

  const place = req.body.place || ''
  if (place.trim().length === 0) {
    res.status(400).json({
      error: {
        message: 'Please enter a valid place',
      },
    })
    return
  }

  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: generatePrompt(place),
      temperature: Number(process.env.OPENAI_API_TEMP) || 0.3,
      max_tokens: Number(process.env.OPENAI_API_MAX_TOKENS) || 2048,
    })
    res.status(200).json({ result: completion.data.choices[0].text })
  } catch (error) {
    // console.error(`Error with OpenAI API request: ${error}`);
    // res.status(500).json({
    //   error: {
    //     message: 'An error occurred during your request.',
    //   },
    // })
    if (error.response) {
      console.error(error.response.status, error.response.data)
      res.status(error.response.status).json(error.response.data)
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`)
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        },
      })
    }
  }
}

export default generateContent
