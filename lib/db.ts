import { sql } from "@vercel/postgres"
import type { Project, Message } from "./types"

// Check if database connection is available
const isDatabaseAvailable = () => {
  return process.env.POSTGRES_URL !== undefined
}

// In-memory store as fallback when database is not available
const projectStore: Record<string, Project> = {}

export async function getProjectById(id: string): Promise<Project | null> {
  try {
    if (!isDatabaseAvailable()) {
      return projectStore[id] || null
    }

    const result = await sql`
      SELECT * FROM projects WHERE id = ${id}
    `

    if (result.rows.length === 0) {
      return null
    }

    const project = result.rows[0]
    return {
      id: project.id,
      name: project.name,
      schema: project.schema,
      schemaType: project.schema_type,
      conversation: JSON.parse(project.conversation),
      createdAt: new Date(project.created_at),
      updatedAt: new Date(project.updated_at),
    }
  } catch (error) {
    console.error("Database error:", error)
    // Check if the project exists in the fallback store
    return projectStore[id] || null
  }
}

export async function createProjectInDb({
  id,
  name,
  schema,
  schemaType,
  conversation,
}: {
  id: string
  name: string
  schema: string
  schemaType: string
  conversation: Message[]
}): Promise<string> {
  try {
    if (!isDatabaseAvailable()) {
      // Use in-memory store as fallback
      const now = new Date()
      projectStore[id] = {
        id,
        name,
        schema,
        schemaType: schemaType as "SQL" | "NoSQL",
        conversation,
        createdAt: now,
        updatedAt: now,
      }
      return id
    }

    const result = await sql`
      INSERT INTO projects (id, name, schema, schema_type, conversation)
      VALUES (${id}, ${name}, ${schema}, ${schemaType}, ${JSON.stringify(conversation)})
      RETURNING id
    `
    return result.rows[0].id
  } catch (error) {
    console.error("Database error:", error)

    // Use in-memory store as fallback
    const now = new Date()
    projectStore[id] = {
      id,
      name,
      schema,
      schemaType: schemaType as "SQL" | "NoSQL",
      conversation,
      createdAt: now,
      updatedAt: now,
    }
    return id
  }
}

export async function updateProjectInDb({
  id,
  name,
  schema,
}: {
  id: string
  name: string
  schema: string
}): Promise<void> {
  try {
    if (!isDatabaseAvailable()) {
      // Update in-memory store
      if (projectStore[id]) {
        projectStore[id] = {
          ...projectStore[id],
          name,
          schema,
          updatedAt: new Date(),
        }
      }
      return
    }

    await sql`
      UPDATE projects
      SET name = ${name}, schema = ${schema}, updated_at = NOW()
      WHERE id = ${id}
    `
  } catch (error) {
    console.error("Database error:", error)

    // Update in-memory store as fallback
    if (projectStore[id]) {
      projectStore[id] = {
        ...projectStore[id],
        name,
        schema,
        updatedAt: new Date(),
      }
    }
  }
}

export async function setupDatabase() {
  // Skip setup if database is not available
  if (!isDatabaseAvailable()) {
    console.log("Database not available, using in-memory storage")
    return
  }

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        schema TEXT NOT NULL,
        schema_type TEXT NOT NULL,
        conversation JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log("Database setup complete")
  } catch (error) {
    console.error("Database setup error:", error)
  }
}

