
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LibraryBig, Construction } from "lucide-react";
import { getToolBySlug } from "@/lib/tool-definitions";

export default function CompleteBrandContentPage() {
  const tool = getToolBySlug('complete-brand-content');

  return (
    <Card className="shadow-lg">
      <CardHeader className="items-center text-center">
        {tool?.icon ? <tool.icon className="h-16 w-16 text-primary mb-4" /> : <Construction className="h-16 w-16 text-primary mb-4" />}
        <CardTitle className="text-3xl">{tool?.title || "Complete Brand Content"} - Coming Soon!</CardTitle>
        <CardDescription className="text-lg">
          {tool?.description || "This feature is currently under development. Stay tuned for updates!"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground">
          Generate a comprehensive suite of content aligned with your brand. This includes website copy (About Us, Services), social media post ideas, email marketing templates, and company bios.
        </p>
      </CardContent>
    </Card>
  );
}
