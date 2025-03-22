"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProject } from "@/lib/actions";
import {
  Loader2,
  Save,
  Code,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { Project } from "@/lib/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function ProjectView({ project }: { project: Project }) {
  const [name, setName] = useState(project.name);
  const [schema, setSchema] = useState(project.schema);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProject({
        id: project.id,
        name,
        schema,
      });
      toast({
        title: "Project saved",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Project Details</h1>
          <p className="text-muted-foreground">
            View and edit your database schema
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="gap-2">
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Changes
        </Button>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Project Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="schema">
        <TabsList>
          <TabsTrigger value="schema" className="gap-2">
            <Code className="h-4 w-4" />
            Schema
          </TabsTrigger>
          <TabsTrigger value="conversation" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Conversation
          </TabsTrigger>
        </TabsList>
        <TabsContent value="schema" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Database Schema ({project.schemaType})</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={schema}
                onChange={(e) => setSchema(e.target.value)}
                className="font-mono h-[500px]"
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="conversation">
          <Card>
            <CardHeader>
              <CardTitle>Design Conversation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.conversation.map((message, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg ${
                      message.role === "user"
                        ? "bg-primary/10 ml-12"
                        : "bg-secondary mr-12"
                    }`}
                  >
                    <p className="font-semibold mb-1">
                      {message.role === "user" ? "You" : "AI Assistant"}
                    </p>
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
                              className="bg-secondary p-2 rounded overflow-x-auto"
                            >
                              <code>{code}</code>
                            </pre>
                          );
                        }
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
