"use server"

import { nanoid } from "nanoid"
import { createProjectInDb, updateProjectInDb, setupDatabase } from "./db"
import type { Message } from "./types"
import { revalidatePath } from "next/cache"

// Ensure database is set up
setupDatabase()

export async function createProject({
  name,
  schema,
  schemaType,
  conversation,
}: {
  name: string
  schema: string
  schemaType: string
  conversation: Message[]
}): Promise<string> {
  const id = nanoid()
  await createProjectInDb({
    id,
    name,
    schema,
    schemaType,
    conversation,
  })
  revalidatePath(`/project/${id}`)
  return id
}

export async function updateProject({
  id,
  name,
  schema,
}: {
  id: string
  name: string
  schema: string
}): Promise<void> {
  await updateProjectInDb({
    id,
    name,
    schema,
  })
  revalidatePath(`/project/${id}`)
}

