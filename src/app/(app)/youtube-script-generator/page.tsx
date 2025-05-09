
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Film, Construction } from "lucide-react"; // Using Film as the primary icon
import { getToolBySlug } from "@/lib/tool-definitions";

export default function YouTubeScriptGeneratorPage() {
  const tool = getToolBySlug('youtube-script-generator');

  return (
    <Card className="shadow-lg">
      <CardHeader className="items-center text-center">
        {tool?.icon ? <tool.icon className="h-16 w-16 text-primary mb-4" /> : <Construction className="h-16 w-16 text-primary mb-4" />}
        <CardTitle className="text-3xl">{tool?.title || "YouTube Script Generator"} - Coming Soon!</CardTitle>
        <CardDescription className="text-lg">
          {tool?.description || "This feature is currently under development. Stay tuned for updates!"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground">
          This tool will help you generate engaging and well-structured scripts for your YouTube videos. Features will include outlining, hook generation, content suggestions, and call-to-action phrasing.
        </p>
      </CardContent>
    </Card>
  );
}
