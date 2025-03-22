import { SchemaDesigner } from "@/components/schema-designer"
import { Navbar } from "@/components/navbar"

export default function NewProjectPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container max-w-4xl mx-auto p-4 md:p-8">
        <SchemaDesigner />
      </main>
    </div>
  )
}

