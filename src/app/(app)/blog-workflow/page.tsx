
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Workflow, Construction } from "lucide-react";
import { getToolBySlug } from "@/lib/tool-definitions";

export default function BlogWorkflowPage() {
  const tool = getToolBySlug('blog-workflow');

  return (
    <Card className="shadow-lg">
      <CardHeader className="items-center text-center">
        {tool?.icon ? <tool.icon className="h-16 w-16 text-primary mb-4" /> : <Construction className="h-16 w-16 text-primary mb-4" />}
        <CardTitle className="text-3xl">{tool?.title || "Blog Workflow"} - Coming Soon!</CardTitle>
        <CardDescription className="text-lg">
          {tool?.description || "This feature is currently under development. Stay tuned for updates!"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground">
          We are working hard to bring you this exciting new tool to enhance your content creation and SEO efforts.
          The Blog Workflow tool will help you manage your blogging process from idea generation, research, outlining, drafting, SEO optimization, to publishing and promotion.
        </p>
      </CardContent>
    </Card>
  );
}
