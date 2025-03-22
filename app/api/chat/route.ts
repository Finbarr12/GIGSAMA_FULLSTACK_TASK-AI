import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

// Set timeout for long-running requests
export const maxDuration = 300

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Check if we need to generate a schema
  const userMessages = messages.filter((m:any) => m.role === "user")
  const shouldGenerateSchema = userMessages.length >= 3

  let systemPrompt = `You are a helpful MongoDB database design assistant. Help the user design their database schema by asking relevant questions about their project requirements.
Focus on understanding:
- The purpose of the database
- The main collections needed
- The document structure for each collection
- Relationships between collections
- Any specific indexes or constraints needed

Ask one question at a time and wait for the user's response before proceeding to the next question.`

  if (shouldGenerateSchema) {
    systemPrompt = `You are a helpful MongoDB database design assistant. Based on the conversation so far, generate a complete MongoDB schema.

Generate a MongoDB schema using JSON format showing the structure of documents and collections. Include:
1. Collection definitions
2. Sample documents with proper field types
3. Suggested indexes
4. Embedding vs referencing recommendations for relationships

Explain your design decisions based on MongoDB best practices and the requirements.
Format the schema in a code block using triple backticks with json as the language.`

  try {
    const response = await generateText({
      model: openai("gpt-4o"),
      messages: [{ role: "system", content: systemPrompt }, ...messages],
    })

    return new Response(response.text)
  } catch (error) {
    console.error("Error generating response:", error)
    return new Response("An error occurred while generating the response.", { status: 500 })
  }
}

}