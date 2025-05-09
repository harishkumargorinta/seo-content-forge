
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookUser, Construction } from "lucide-react";
import { getToolBySlug } from "@/lib/tool-definitions";

export default function EmployeeHandbookPage() {
  const tool = getToolBySlug('employee-handbook');

  return (
    <Card className="shadow-lg">
      <CardHeader className="items-center text-center">
        {tool?.icon ? <tool.icon className="h-16 w-16 text-primary mb-4" /> : <Construction className="h-16 w-16 text-primary mb-4" />}
        <CardTitle className="text-3xl">{tool?.title || "Employee Handbook"} - Coming Soon!</CardTitle>
        <CardDescription className="text-lg">
          {tool?.description || "This feature is currently under development. Stay tuned for updates!"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground">
          Quickly generate a comprehensive employee handbook based on standard templates and best practices. Customize sections to fit your company's specific policies and culture.
        </p>
      </CardContent>
    </Card>
  );
}
