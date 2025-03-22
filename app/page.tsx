import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Database, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="max-w-3xl w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="bg-primary/10 p-3 rounded-full">
            <Database className="h-10 w-10 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          AI MongoDB Schema Designer
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Create professional MongoDB schemas through an interactive AI-powered
          experience. Answer a few questions and get a complete schema for your
          project.
        </p>

        <div className="flex justify-center pt-4">
          <Link href="/new-project">
            <Button size="lg" className="gap-2">
              Create New Schema
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
