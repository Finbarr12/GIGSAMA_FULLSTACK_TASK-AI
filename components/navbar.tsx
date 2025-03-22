import Link from "next/link"
import { Database, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Database className="h-6 w-6" />
          <span className="font-semibold">Schema Designer</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/new-project">
            <Button variant="ghost">New Project</Button>
          </Link>
          <Link href="/setup">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}

