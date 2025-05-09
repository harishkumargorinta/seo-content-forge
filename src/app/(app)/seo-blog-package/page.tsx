
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PackageCheck, Construction } from "lucide-react";
import { getToolBySlug } from "@/lib/tool-definitions";

export default function SeoBlogPackagePage() {
  const tool = getToolBySlug('seo-blog-package');

  return (
    <Card className="shadow-lg">
      <CardHeader className="items-center text-center">
        {tool?.icon ? <tool.icon className="h-16 w-16 text-primary mb-4" /> : <Construction className="h-16 w-16 text-primary mb-4" />}
        <CardTitle className="text-3xl">{tool?.title || "SEO Blog Package"} - Coming Soon!</CardTitle>
        <CardDescription className="text-lg">
          {tool?.description || "This feature is currently under development. Stay tuned for updates!"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground">
          Generate a complete, SEO-optimized blog post package including a compelling title, meta description, structured outline, well-written content body, and an overall SEO assessment with keyword suggestions.
        </p>
      </CardContent>
    </Card>
  );
}
