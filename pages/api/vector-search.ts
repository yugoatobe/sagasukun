import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { codeBlock, oneLine } from 'common-tags'
import GPT3Tokenizer from 'gpt3-tokenizer'
import {
  Configuration,
  OpenAIApi,
  CreateModerationResponse,
  CreateEmbeddingResponse,
  ChatCompletionRequestMessage,
} from 'openai-edge'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { ApplicationError, UserError } from '@/lib/errors'

const openAiKey = process.env.OPENAI_KEY
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const config = new Configuration({
  apiKey: openAiKey,
})
const openai = new OpenAIApi(config)

export const runtime = 'edge'

export default async function handler(req: NextRequest) {
  try {
    if (!openAiKey) {
      throw new ApplicationError('Missing environment variable OPENAI_KEY')
    }

    if (!supabaseUrl) {
      throw new ApplicationError('Missing environment variable SUPABASE_URL')
    }

    if (!supabaseServiceKey) {
      throw new ApplicationError('Missing environment variable SUPABASE_SERVICE_ROLE_KEY')
    }

    const requestData = await req.json()

    if (!requestData) {
      throw new UserError('Missing request data')
    }

    const { prompt: query } = requestData

    if (!query) {
      throw new UserError('Missing query in request data')
    }

    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey)

    // Moderate the content to comply with OpenAI T&C
    const sanitizedQuery = query.trim()
    const moderationResponse: CreateModerationResponse = await openai
      .createModeration({ input: sanitizedQuery })
      .then((res) => res.json())

    const [results] = moderationResponse.results

    if (results.flagged) {
      throw new UserError('Flagged content', {
        flagged: true,
        categories: results.categories,
      })
    }

    // Create embedding from query
    const embeddingResponse = await openai.createEmbedding({
      model: 'text-embedding-ada-002',
      input: sanitizedQuery.replaceAll('\n', ' '),
    })

    if (embeddingResponse.status !== 200) {
      throw new ApplicationError('Failed to create embedding for question', embeddingResponse)
    }

    const {
      data: [{ embedding }],
    }: CreateEmbeddingResponse = await embeddingResponse.json()

    const { error: matchError, data: pageSections } = await supabaseClient.rpc(
      'match_page_sections',
      {
        embedding,
        match_threshold: 0.78,
        match_count: 10,
        min_content_length: 50,
      }
    )

    if (matchError) {
      console.error('Error matching page sections:', matchError);
      throw new ApplicationError('Failed to match page sections', matchError)
    }

    console.log('RPC call to match_page_sections returned:', pageSections);

    const tokenizer = new GPT3Tokenizer({ type: 'gpt3' })
    let tokenCount = 0
    let contextText = ''

    console.log('Page Sections:', pageSections);

    for (let i = 0; i < pageSections.length; i++) {
      const pageSection = pageSections[i]
      console.log(`Content of section ${i}:`, pageSection.content);
      const content = pageSection.content
      const encoded = tokenizer.encode(content)
      tokenCount += encoded.text.length

      if (tokenCount >= 1500) {
        break
      }

      contextText += `${content.trim()}\n---\n`

    }

    console.log('Final Context Text:', contextText);


    const prompt = codeBlock`
      ${oneLine`
        あなたは、人々を助けることが大好きな、とても熱心なAIアシスタントです。
        与えられたドキュメントをもとにして、その情報のみを使って質問に答えてください。
        // 答えがドキュメントに明確に書かれていない場合は、次のように言ってください。
        // "申し訳ありませんが、どのようにお答えしたらよいかわかりません。"
      `}

      Context sections:
      ${contextText}

      Question: """
      ${sanitizedQuery}
      """
    `

    const chatMessage: ChatCompletionRequestMessage = {
      role: 'user',
      content: prompt,
    }

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      // model: 'gpt-4-0125-preview',
      messages: [chatMessage],
      max_tokens: 512,
      temperature: 0,
      stream: true,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new ApplicationError('Failed to generate completion', error)
    }

    // Transform the response into a readable stream
    const stream = OpenAIStream(response)

    // Return a StreamingTextResponse, which can be consumed by the client
    return new StreamingTextResponse(stream)
  } catch (err: unknown) {
    if (err instanceof UserError) {
      return new Response(
        JSON.stringify({
          error: err.message,
          data: err.data,
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    } else if (err instanceof ApplicationError) {
      // Print out application errors with their additional data
      console.error(`${err.message}: ${JSON.stringify(err.data)}`)
    } else {
      // Print out unexpected errors as is to help with debugging
      console.error(err)
    }

    // TODO: include more response info in debug environments
    return new Response(
      JSON.stringify({
        error: 'There was an error processing your request',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
