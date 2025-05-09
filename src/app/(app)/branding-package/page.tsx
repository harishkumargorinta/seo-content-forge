
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Palette, Construction } from "lucide-react";
import { getToolBySlug } from "@/lib/tool-definitions";

export default function BrandingPackagePage() {
  const tool = getToolBySlug('branding-package');

  return (
    <Card className="shadow-lg">
      <CardHeader className="items-center text-center">
        {tool?.icon ? <tool.icon className="h-16 w-16 text-primary mb-4" /> : <Construction className="h-16 w-16 text-primary mb-4" />}
        <CardTitle className="text-3xl">{tool?.title || "Branding Package Generator"} - Coming Soon!</CardTitle>
        <CardDescription className="text-lg">
          {tool?.description || "This feature is currently under development. Stay tuned for updates!"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground">
          Develop key elements of your brand identity. This tool will help generate mission statements, vision statements, value propositions, brand voice guidelines, and taglines based on your input.
        </p>
      </CardContent>
    </Card>
  );
}
