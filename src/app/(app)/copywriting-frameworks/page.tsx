
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Quote, Construction } from "lucide-react";
import { getToolBySlug } from "@/lib/tool-definitions";

export default function CopywritingFrameworksPage() {
  const tool = getToolBySlug('copywriting-frameworks');

  return (
    <Card className="shadow-lg">
      <CardHeader className="items-center text-center">
       {tool?.icon ? <tool.icon className="h-16 w-16 text-primary mb-4" /> : <Construction className="h-16 w-16 text-primary mb-4" />}
        <CardTitle className="text-3xl">{tool?.title || "Copywriting Frameworks"} - Coming Soon!</CardTitle>
        <CardDescription className="text-lg">
          {tool?.description || "This feature is currently under development. Stay tuned for updates!"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground">
          Utilize classic copywriting formulas like AIDA (Attention, Interest, Desire, Action), PAS (Problem, Agitate, Solve), and FAB (Features, Advantages, Benefits) to generate compelling copy for various marketing needs.
        </p>
      </CardContent>
    </Card>
  );
}
