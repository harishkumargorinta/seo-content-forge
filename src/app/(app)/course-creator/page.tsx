
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GraduationCap, Construction } from "lucide-react";
import { getToolBySlug } from "@/lib/tool-definitions";

export default function CourseCreatorPage() {
  const tool = getToolBySlug('course-creator');

  return (
    <Card className="shadow-lg">
      <CardHeader className="items-center text-center">
        {tool?.icon ? <tool.icon className="h-16 w-16 text-primary mb-4" /> : <Construction className="h-16 w-16 text-primary mb-4" />}
        <CardTitle className="text-3xl">{tool?.title || "Course Creator Assistant"} - Coming Soon!</CardTitle>
        <CardDescription className="text-lg">
          {tool?.description || "This feature is currently under development. Stay tuned for updates!"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground">
          Design and outline engaging online courses. This assistant will help generate module structures, learning objectives, content ideas for lessons, and even draft quiz questions or assignment prompts.
        </p>
      </CardContent>
    </Card>
  );
}
