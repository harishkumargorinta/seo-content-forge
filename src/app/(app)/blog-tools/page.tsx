
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GanttChartSquare, Construction } from "lucide-react";
import { getToolBySlug } from "@/lib/tool-definitions";

export default function BlogToolsPage() {
  const tool = getToolBySlug('blog-tools');

  return (
    <Card className="shadow-lg">
      <CardHeader className="items-center text-center">
        {tool?.icon ? <tool.icon className="h-16 w-16 text-primary mb-4" /> : <Construction className="h-16 w-16 text-primary mb-4" />}
        <CardTitle className="text-3xl">{tool?.title || "Blog Tools"} - Coming Soon!</CardTitle>
        <CardDescription className="text-lg">
          {tool?.description || "This feature is currently under development. Stay tuned for updates!"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground">
          The Blog Tools suite will offer a variety of utilities such as headline generators/analyzers, readability scorers, keyword density checkers, and tools to help with content repurposing ideas.
        </p>
      </CardContent>
    </Card>
  );
}
