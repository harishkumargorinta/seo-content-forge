
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PanelTopOpen, Construction } from "lucide-react";
import { getToolBySlug } from "@/lib/tool-definitions";

export default function HomepageCopyWriterPage() {
  const tool = getToolBySlug('homepage-copy-writer');

  return (
    <Card className="shadow-lg">
      <CardHeader className="items-center text-center">
        {tool?.icon ? <tool.icon className="h-16 w-16 text-primary mb-4" /> : <Construction className="h-16 w-16 text-primary mb-4" />}
        <CardTitle className="text-3xl">{tool?.title || "Perfect Homepage Copy"} - Coming Soon!</CardTitle>
        <CardDescription className="text-lg">
          {tool?.description || "This feature is currently under development. Stay tuned for updates!"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground">
          Craft compelling, engaging, and conversion-focused copy specifically for your website's homepage. This tool will help you articulate your value proposition and guide visitors towards desired actions.
        </p>
      </CardContent>
    </Card>
  );
}
