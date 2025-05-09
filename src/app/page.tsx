
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Zap, Settings2, PenSquare, LayoutList, Users, Brain, Sparkles, CheckCircle2, Lightbulb, Rocket } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/components/icons/logo";
import { allTools, toolCategories, type ToolCategory, BenefitIcons } from "@/lib/tool-definitions";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <>
      {/* Header */}
      <header className="py-4 px-4 md:px-8 border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" aria-label="SEO Content Forge Home">
            <Logo />
          </Link>
          <nav className="space-x-2 sm:space-x-4 flex items-center">
            <Link href="#why-us" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors">Why Us?</Link>
            <Link href="#tools" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors">Tools</Link>
            <Link href="#how-it-works" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors">How it Works</Link>
            <Button asChild size="sm" className="sm:size-default">
              <Link href="/dashboard">Get Started Free</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-background via-secondary/10 to-background text-center">
          <div className="container mx-auto px-4">
             <Badge variant="secondary" className="mb-4 text-sm py-1 px-3 rounded-full">
              ✨ New Tools Added Weekly!
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
              Create SEO-Optimized Content That Ranks, <span className="text-primary">Faster Than Ever</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              Leverage the power of AI with SEO Content Forge to generate high-quality articles, social media posts, marketing copy, and more. Streamline your workflow and boost your online presence.
            </p>
            <Button size="lg" asChild className="shadow-lg hover:shadow-xl transition-shadow duration-300 group">
              <Link href="/dashboard">
                Start Creating for Free <Zap className="ml-2 h-5 w-5 group-hover:animate-ping" />
              </Link>
            </Button>
            <div className="mt-12 md:mt-16">
              <Image
                src="https://picsum.photos/seed/landinghero/1200/600"
                alt="SEO Content Forge Dashboard Mockup showing charts and content tools"
                width={1000}
                height={500}
                className="rounded-lg shadow-2xl mx-auto object-cover border"
                data-ai-hint="dashboard mockup"
                priority
              />
            </div>
          </div>
        </section>

        {/* Trusted By Section */}
        <section className="py-12 md:py-16 bg-secondary/30">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">
              Trusted by Content Creators & Marketers Worldwide
            </h3>
            {/* Placeholder for logos - using text for now */}
            <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 text-muted-foreground">
              <span className="text-lg font-medium">Bloggers</span>
              <span className="text-lg font-medium">SEO Agencies</span>
              <span className="text-lg font-medium">Startups</span>
              <span className="text-lg font-medium">Marketing Teams</span>
              <span className="text-lg font-medium">Freelancers</span>
            </div>
          </div>
        </section>

        {/* Why SEO Content Forge? Section */}
        <section id="why-us" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">Unlock Your Content Superpowers</h2>
            <p className="text-center text-muted-foreground mb-12 md:mb-16 max-w-2xl mx-auto">
              Discover how SEO Content Forge empowers you to create exceptional content with less effort and greater impact.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <BenefitCard
                icon={<BenefitIcons.Zap className="h-10 w-10 text-primary" />}
                title="AI-Powered Efficiency"
                description="Generate diverse content formats in minutes, not hours. Save time and scale your production."
              />
              <BenefitCard
                icon={<Settings2 className="h-10 w-10 text-primary" />}
                title="SEO-Focused Output"
                description="Craft content optimized for search engines, helping you rank higher and attract organic traffic."
              />
              <BenefitCard
                icon={<BenefitIcons.Brain className="h-10 w-10 text-primary" />}
                title="Versatile Toolkit"
                description="From blog posts to social media captions and ad copy, find the right tool for every content need."
              />
               <BenefitCard
                icon={<BenefitIcons.Sparkles className="h-10 w-10 text-primary" />}
                title="Human-Centric Quality"
                description="Our AI assists, not replaces. Create authentic, engaging content that resonates with your audience."
              />
            </div>
          </div>
        </section>
        
        {/* Tool Showcase Section */}
        <section id="tools" className="py-16 md:py-24 bg-secondary/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">One Platform, Endless Content Possibilities</h2>
            <p className="text-center text-muted-foreground mb-12 md:mb-16 max-w-2xl mx-auto">
              Explore our comprehensive suite of AI tools, categorized to help you find exactly what you need to elevate your content game.
            </p>
            {toolCategories.map(category => {
              const toolsInCategory = allTools.filter(tool => tool.category === category);
              if (toolsInCategory.length === 0) return null;
              return (
                <div key={category} className="mb-12">
                  <h3 className="text-2xl md:text-3xl font-semibold text-center mb-8 text-foreground">{category}</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {toolsInCategory.map(tool => (
                      <ToolCard
                        key={tool.slug}
                        icon={<tool.icon className="h-8 w-8 text-primary" />}
                        title={tool.title}
                        description={tool.description}
                        isComingSoon={tool.isComingSoon}
                        link={tool.link}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">Get Started in 3 Simple Steps</h2>
            <p className="text-center text-muted-foreground mb-12 md:mb-16 max-w-2xl mx-auto">
              Creating amazing content with SEO Content Forge is quick and intuitive.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <StepCard
                stepNumber="1"
                icon={<CheckCircle2 className="h-10 w-10 text-primary" />}
                title="Choose Your Tool"
                description="Select from our wide range of specialized AI content generation and optimization tools."
              />
              <StepCard
                stepNumber="2"
                icon={<Lightbulb className="h-10 w-10 text-primary" />}
                title="Provide Your Input"
                description="Enter your topic, keywords, desired tone, or any other relevant information for the AI."
              />
              <StepCard
                stepNumber="3"
                icon={<Rocket className="h-10 w-10 text-primary" />}
                title="Generate & Refine"
                description="Let our AI work its magic! Review, edit, and refine the generated content to perfection."
              />
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 md:py-24 bg-gradient-to-tr from-primary/10 via-secondary/5 to-primary/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Ready to Revolutionize Your Content Strategy?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of creators and marketers who are saving time and achieving better results with SEO Content Forge. No credit card required to start.
            </p>
            <Button size="lg" asChild className="shadow-md hover:shadow-lg transition-shadow duration-300 group">
              <Link href="/dashboard">
                Sign Up and Start Forging Today <Sparkles className="ml-2 h-5 w-5 group-hover:animate-pulse" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t bg-secondary/50">
          <div className="container mx-auto px-4 text-center text-muted-foreground">
            <div className="mb-4">
              <Logo />
            </div>
            <p>&copy; {new Date().getFullYear()} SEO Content Forge. All rights reserved.</p>
            <p className="text-sm mt-2">Powered by AI, Crafted for Humans.</p>
            <div className="mt-4 space-x-4 text-sm">
                <Link href="/privacy-policy" className="hover:text-primary">Privacy Policy</Link>
                <Link href="/terms-of-service" className="hover:text-primary">Terms of Service</Link>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function BenefitCard({ icon, title, description }: BenefitCardProps) {
  return (
    <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card flex flex-col">
      <CardHeader className="items-center pb-4">
        <div className="p-3 bg-primary/10 rounded-full mb-3 inline-block">
          {icon}
        </div>
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardContent>
    </Card>
  );
}

interface ToolCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isComingSoon?: boolean;
  link: string;
}

function ToolCard({ icon, title, description, isComingSoon, link }: ToolCardProps) {
  return (
    <Card className="flex flex-col shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-3">
        <div className="rounded-full bg-primary/10 p-2 flex items-center justify-center">
          {icon}
        </div>
        <CardTitle className="text-lg font-semibold pt-1">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow pb-4">
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="pt-0">
        {isComingSoon ? (
          <Badge variant="outline" className="w-full justify-center py-2">Coming Soon</Badge>
        ) : (
          <Button asChild className="w-full mt-auto" size="sm" variant="outline">
            <Link href={link}>
              Open Tool
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

interface StepCardProps {
  stepNumber: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

function StepCard({ stepNumber, icon, title, description }: StepCardProps) {
  return (
    <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card flex flex-col p-6">
      <div className="flex justify-center items-center mb-4">
        <div className="relative">
          <div className="p-3 bg-primary/10 rounded-full inline-block">
            {icon}
          </div>
          <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">
            {stepNumber}
          </div>
        </div>
      </div>
      <CardTitle className="text-xl font-semibold mb-2">{title}</CardTitle>
      <p className="text-muted-foreground text-sm flex-grow">{description}</p>
    </Card>
  );
}
