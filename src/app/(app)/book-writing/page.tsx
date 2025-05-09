
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, Construction } from "lucide-react";
import { getToolBySlug } from "@/lib/tool-definitions";

export default function BookWritingPage() {
  const tool = getToolBySlug('book-writing');

  return (
    <Card className="shadow-lg">
      <CardHeader className="items-center text-center">
        {tool?.icon ? <tool.icon className="h-16 w-16 text-primary mb-4" /> : <Construction className="h-16 w-16 text-primary mb-4" />}
        <CardTitle className="text-3xl">{tool?.title || "Book Writing Suite"} - Coming Soon!</CardTitle>
        <CardDescription className="text-lg">
          {tool?.description || "This feature is currently under development. Stay tuned for updates!"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground">
          This comprehensive suite will offer tools for outlining, character development (for fiction), plot structuring, and managing your manuscript from start to finish.
        </p>
      </CardContent>
    </Card>
  );
}
