"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export function SetupGuide() {
  const [backendStatus, setBackendStatus] = useState<"checking" | "online" | "offline">("checking")
  const [openaiStatus, setOpenaiStatus] = useState<"checking" | "configured" | "missing">("checking")
  const [databaseStatus, setDatabaseStatus] = useState<"checking" | "connected" | "error">("checking")

  // API URL - change this to your Express server URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

  const checkServerStatus = async () => {
    setBackendStatus("checking")
    setOpenaiStatus("checking")
    setDatabaseStatus("checking")

    try {
      // Check if the server is online
      const response = await fetch(`${API_URL}/api/status`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) {
        setBackendStatus("offline")
        setOpenaiStatus("missing")
        setDatabaseStatus("error")
        return
      }

      const data = await response.json()
      setBackendStatus("online")

      // Check OpenAI status
      setOpenaiStatus(data.openai ? "configured" : "missing")

      // Check database status
      setDatabaseStatus(data.database ? "connected" : "error")
    } catch (error) {
      console.error("Error checking server status:", error)
      setBackendStatus("offline")
      setOpenaiStatus("missing")
      setDatabaseStatus("error")
    }
  }

  // Check status on component mount
  useState(() => {
    checkServerStatus()
  })

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Setup Guide</CardTitle>
        <CardDescription>Follow these steps to properly configure your AI MongoDB Schema Designer</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="backend">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="backend">Express Backend</TabsTrigger>
            <TabsTrigger value="openai">OpenAI API</TabsTrigger>
            <TabsTrigger value="database">MongoDB</TabsTrigger>
          </TabsList>

          <TabsContent value="backend" className="space-y-4">
            <div className="flex items-center gap-2 mt-4">
              <div
                className={`rounded-full p-1 ${
                  backendStatus === "online"
                    ? "bg-green-100 text-green-600"
                    : backendStatus === "offline"
                      ? "bg-red-100 text-red-600"
                      : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {backendStatus === "online" ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
              </div>
              <span className="font-medium">
                {backendStatus === "online"
                  ? "Express server is running"
                  : backendStatus === "offline"
                    ? "Express server is not reachable"
                    : "Checking server status..."}
              </span>
            </div>

            <div className="mt-4 space-y-2">
              <h3 className="font-semibold">Setup Instructions:</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Navigate to the <code className="bg-muted px-1 rounded">server</code> directory
                </li>
                <li>
                  Create a <code className="bg-muted px-1 rounded">.env</code> file based on{" "}
                  <code className="bg-muted px-1 rounded">.env.example</code>
                </li>
                <li>
                  Install dependencies with <code className="bg-muted px-1 rounded">npm install</code>
                </li>
                <li>
                  Start the server with <code className="bg-muted px-1 rounded">npm run dev</code>
                </li>
              </ol>
            </div>
          </TabsContent>

          <TabsContent value="openai" className="space-y-4">
            <div className="flex items-center gap-2 mt-4">
              <div
                className={`rounded-full p-1 ${
                  openaiStatus === "configured"
                    ? "bg-green-100 text-green-600"
                    : openaiStatus === "missing"
                      ? "bg-red-100 text-red-600"
                      : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {openaiStatus === "configured" ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
              </div>
              <span className="font-medium">
                {openaiStatus === "configured"
                  ? "OpenAI API key is configured"
                  : openaiStatus === "missing"
                    ? "OpenAI API key is missing"
                    : "Checking OpenAI configuration..."}
              </span>
            </div>

            <div className="mt-4 space-y-2">
              <h3 className="font-semibold">Setup Instructions:</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Get your API key from{" "}
                  <a
                    href="https://platform.openai.com/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    OpenAI Dashboard
                  </a>
                </li>
                <li>
                  Add your API key to the <code className="bg-muted px-1 rounded">.env</code> file in the server
                  directory:
                </li>
                <li>
                  <code className="bg-muted px-1 rounded block p-2">OPENAI_API_KEY=your_api_key_here</code>
                </li>
                <li>Restart the Express server</li>
              </ol>
            </div>
          </TabsContent>

          <TabsContent value="database" className="space-y-4">
            <div className="flex items-center gap-2 mt-4">
              <div
                className={`rounded-full p-1 ${
                  databaseStatus === "connected"
                    ? "bg-green-100 text-green-600"
                    : databaseStatus === "error"
                      ? "bg-red-100 text-red-600"
                      : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {databaseStatus === "connected" ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
              </div>
              <span className="font-medium">
                {databaseStatus === "connected"
                  ? "MongoDB is connected"
                  : databaseStatus === "error"
                    ? "MongoDB connection error"
                    : "Checking MongoDB connection..."}
              </span>
            </div>

            <div className="mt-4 space-y-2">
              <h3 className="font-semibold">Setup Instructions:</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Set up a MongoDB database (local or MongoDB Atlas)</li>
                <li>
                  Add your MongoDB connection string to the <code className="bg-muted px-1 rounded">.env</code> file:
                </li>
                <li>
                  <code className="bg-muted px-1 rounded block p-2">
                    MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
                  </code>
                </li>
                <li>
                  <code className="bg-muted px-1 rounded block p-2">MONGODB_DB_NAME=schema_designer</code>
                </li>
                <li>Restart the Express server</li>
              </ol>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button onClick={checkServerStatus} className="w-full">
          Check Configuration Status
        </Button>
      </CardFooter>
    </Card>
  )
}

