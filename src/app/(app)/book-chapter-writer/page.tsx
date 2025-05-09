
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookText, Construction } from "lucide-react";
import { getToolBySlug } from "@/lib/tool-definitions";

export default function BookChapterWriterPage() {
  const tool = getToolBySlug('book-chapter-writer');
  
  return (
    <Card className="shadow-lg">
      <CardHeader className="items-center text-center">
        {tool?.icon ? <tool.icon className="h-16 w-16 text-primary mb-4" /> : <Construction className="h-16 w-16 text-primary mb-4" />}
        <CardTitle className="text-3xl">{tool?.title || "Book Chapter Writer"} - Coming Soon!</CardTitle>
        <CardDescription className="text-lg">
          {tool?.description || "This feature is currently under development. Stay tuned for updates!"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground">
          Get AI-powered assistance in drafting chapters for your non-fiction books. This tool will help with structuring content, generating initial drafts, and ensuring a logical flow of information.
        </p>
      </CardContent>
    </Card>
  );
}
