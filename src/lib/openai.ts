import OpenAI from 'openai'

/**
 * Singleton OpenAI client instance.
 * API key is read from OPENAI_API_KEY environment variable.
 */
const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set in environment variables')
  }

  return new OpenAI({ apiKey })
}

export const openai = getOpenAIClient()
