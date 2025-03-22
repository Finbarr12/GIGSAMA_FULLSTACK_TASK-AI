export interface Message {
  id?: string
  role: "user" | "assistant" | "system"
  content: string
}

export interface Project {
  id: string
  name: string
  schema: string
  schemaType: "SQL" | "NoSQL"
  conversation: Message[]
  createdAt: Date
  updatedAt: Date
}

