"use client";

import type React from "react";
import { useState } from "react";
import { useChat } from "ai/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Send, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Message } from "ai";

const API_URL = "http://localhost:5000";

export function SchemaDesigner() {
  const [projectName, setProjectName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [schema, setSchema] = useState<string | null>(null); // Store the schema locally

  const { messages, input, handleInputChange, setMessages, setInput } = useChat(
    {
      api: "/api/chat",
      initialMessages: [
        {
          id: "welcome",
          role: "assistant",
          content:
            "Hi there! I'll help you design your MongoDB database schema. Let's start with some basic information. What's the main purpose of your database? (e.g., e-commerce, blog, inventory management)",
        },
      ],
      onFinish: async (message) => {
        // Check if the message contains a schema
        if (message.content.includes("```json")) {
          setIsCreating(true);

          // Extract schema from the message
          const schemaMatch = message.content.match(/```json([\s\S]*?)```/);
          const extractedSchema = schemaMatch ? schemaMatch[1].trim() : "";

          if (extractedSchema) {
            setSchema(extractedSchema); // Store the schema locally
            setIsCreating(false);
          } else {
            setError("Failed to extract schema from the response.");
            setIsCreating(false);
          }
        }
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      // Send request to Express backend
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle API error
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `Error: ${
            data.error ||
            "Failed to get response from AI. Please check server configuration."
          }`,
        };
        setMessages((prev) => [...prev, errorMessage]);
        setError(data.error || "Failed to get response from AI.");
        setIsLoading(false);
        return;
      }

      // Add assistant message to chat
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Check if the message contains a schema
      if (data.content.includes("```json")) {
        setIsCreating(true);

        // Extract schema from the message
        const schemaMatch = data.content.match(/```json([\s\S]*?)```/);
        const extractedSchema = schemaMatch ? schemaMatch[1].trim() : "";

        if (extractedSchema) {
          setSchema(extractedSchema); // Store the schema locally
          setIsCreating(false);
        } else {
          setError("Failed to extract schema from the response.");
          setIsCreating(false);
        }
      }
      setIsLoading(false);
    } catch (error: any) {
      console.error("API request failed:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Error: ${error.message || "An unexpected error occurred."}`,
      };
      setMessages((prev) => [...prev, errorMessage]);
      setError(error.message || "An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center justify-between">
              <span>MongoDB Schema Designer</span>
              <Input
                placeholder="Project Name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="max-w-xs"
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex gap-3 max-w-[80%] ${
                    message.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {message.role === "user" ? "U" : "AI"}
                    </AvatarFallback>
                    {message.role === "assistant" && (
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    )}
                  </Avatar>
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <div className="prose prose-sm dark:prose-invert">
                      {message.content.split("```").map((part, i) => {
                        if (i % 2 === 0) {
                          return <p key={i}>{part}</p>;
                        } else {
                          const [language, ...codeParts] = part.split("\n");
                          const code = codeParts.join("\n");
                          return (
                            <pre
                              key={i}
                              className="bg-secondary p-2 rounded overflow-x-auto text-sm text-foreground" // Updated styling
                            >
                              <code>{code}</code>
                            </pre>
                          );
                        }
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-[80%]">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>AI</AvatarFallback>
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  </Avatar>
                  <div className="rounded-lg px-4 py-2 bg-muted">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <form
            onSubmit={handleSubmit}
            className="flex w-full items-center space-x-2"
          >
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={handleInputChange}
              disabled={isLoading || isCreating}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || isCreating || !input.trim()}
            >
              {isLoading || isCreating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </CardFooter>
      </Card>
      {isCreating && (
        <div className="flex justify-center items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Creating your project...</span>
        </div>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {schema && (
        <div className="mt-4 p-4 bg-secondary rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Generated Schema</h3>
          <pre className="bg-background p-4 rounded overflow-x-auto text-sm text-foreground">
            <code>{schema}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
