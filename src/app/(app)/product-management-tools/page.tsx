
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Blocks, Construction } from "lucide-react";
import { getToolBySlug } from "@/lib/tool-definitions";

export default function ProductManagementToolsPage() {
  const tool = getToolBySlug('product-management-tools');

  return (
    <Card className="shadow-lg">
      <CardHeader className="items-center text-center">
        {tool?.icon ? <tool.icon className="h-16 w-16 text-primary mb-4" /> : <Construction className="h-16 w-16 text-primary mb-4" />}
        <CardTitle className="text-3xl">{tool?.title || "Product Management Toolkit"} - Coming Soon!</CardTitle>
        <CardDescription className="text-lg">
          {tool?.description || "This feature is currently under development. Stay tuned for updates!"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground">
          A suite of tools for product managers, including AI-powered user story generation, feature prioritization frameworks (e.g., RICE, MoSCoW), and tools to brainstorm roadmap items and product specifications.
        </p>
      </CardContent>
    </Card>
  );
}
