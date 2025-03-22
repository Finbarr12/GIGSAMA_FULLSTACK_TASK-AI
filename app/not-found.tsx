import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Database } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-primary/10 p-3 rounded-full">
            <Database className="h-10 w-10 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">404</h1>
        <h2 className="text-2xl font-semibold">Project Not Found</h2>
        <p className="text-muted-foreground">The project you're looking for doesn't exist or has been removed.</p>
        <div className="flex justify-center pt-4">
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

