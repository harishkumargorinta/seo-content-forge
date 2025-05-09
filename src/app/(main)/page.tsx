import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, BotMessageSquare, LayoutList, Settings2 } from "lucide-react";
import Image from "next/image";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight">Welcome to SEO Content Forge!</CardTitle>
          <CardDescription className="text-lg">
            Your human-centric platform for explosive SEO growth and streamlined content creation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-muted-foreground">
            Leverage AI-powered tools, build engaging comparisons, and optimize your content for maximum visibility and AdSense success. Let's get started!
          </p>
          <Image 
            src="https://picsum.photos/1200/400" 
            alt="Abstract representation of SEO and content creation"
            width={1200}
            height={400}
            className="w-full h-auto rounded-lg object-cover mb-6"
            data-ai-hint="abstract tech"
          />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          icon={<Settings2 className="h-8 w-8 text-primary" />}
          title="SEO Optimizer"
          description="Refine titles, meta descriptions, and keywords with our AI-powered analysis tool. Boost your organic reach effortlessly."
          link="/seo-optimizer"
          linkText="Optimize Now"
        />
        <FeatureCard
          icon={<LayoutList className="h-8 w-8 text-primary" />}
          title="Comparison Builder"
          description="Create engaging side-by-side comparisons of products or services. Attract high-intent traffic and provide value to your audience."
          link="/comparison-builder"
          linkText="Build Comparison"
        />
        <FeatureCard
          icon={<BotMessageSquare className="h-8 w-8 text-primary" />}
          title="Content Quality Focus"
          description="Our platform prioritizes human-crafted articles, enhanced by AI, for better search rankings and AdSense approval."
          link="#" // Placeholder link
          linkText="Learn More"
          isActionable={false}
        />
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  linkText: string;
  isActionable?: boolean;
}

function FeatureCard({ icon, title, description, link, linkText, isActionable = true }: FeatureCardProps) {
  return (
    <Card className="flex flex-col shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-4">
        <div className="rounded-full bg-secondary p-3 flex items-center justify-center">
          {icon}
        </div>
        <CardTitle className="text-xl font-semibold pt-2">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
      {isActionable && (
        <CardContent className="pt-0">
          <Button asChild className="w-full mt-auto">
            <Link href={link}>
              {linkText} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      )}
    </Card>
  );
}
