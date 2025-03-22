import { Navbar } from "@/components/navbar"
import { SetupGuide } from "@/components/setup-guide"

export default function SetupPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Setup Guide</h1>
            <p className="text-muted-foreground">Configure your AI Database Schema Designer application</p>
          </div>

          <SetupGuide />
        </div>
      </main>
    </div>
  )
}

