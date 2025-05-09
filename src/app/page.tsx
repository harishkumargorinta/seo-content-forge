
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, PenSquare, Settings2, FileCode2, LayoutList, BarChart, BotMessageSquare, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/components/icons/logo";
import { allTools } from "@/lib/tool-definitions";

const existingToolsForLanding = allTools.filter(tool => tool.isExisting).slice(0, 3); // Show a few existing key tools
const newToolsForLanding = allTools.filter(tool => tool.isComingSoon);


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
            <Link href="#features" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors">Features</Link>
            <Link href="#toolkit" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors">Toolkit</Link>
            {/* <Link href="#pricing" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors">Pricing</Link> */}
            <Button asChild size="sm" sm-size="default">
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-background via-secondary/20 to-background text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
              Forge High-Ranking Content with AI
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              SEO Content Forge is your human-centric platform for explosive SEO growth, streamlined content creation, and enhanced online visibility.
            </p>
            <Button size="lg" asChild className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Link href="/dashboard">
                Start Forging Free <Zap className="ml-2 h-5 w-5" />
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

        {/* Core Features Section */}
        <section id="features" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">Core Platform Features</h2>
            <p className="text-center text-muted-foreground mb-12 md:mb-16 max-w-2xl mx-auto">
              Powerful, intuitive tools designed to elevate your content strategy and search engine performance.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {existingToolsForLanding.map(tool => (
                <FeatureHighlight
                  key={tool.slug}
                  icon={<tool.icon className="h-10 w-10 text-primary" />}
                  title={tool.title}
                  description={tool.description}
                />
              ))}
               <FeatureHighlight
                icon={<BarChart className="h-10 w-10 text-primary" />}
                title="Human-Centric Approach"
                description="We focus on AI-enhanced, human-quality content to ensure AdSense compliance and genuine audience engagement."
              />
              <FeatureHighlight
                icon={<BotMessageSquare className="h-10 w-10 text-primary" />}
                title="Intuitive & Easy to Use"
                description="A clean, user-friendly interface makes powerful content tools accessible to everyone, regardless of technical skill."
              />
               <FeatureHighlight
                icon={<Sparkles className="h-10 w-10 text-primary" />}
                title="More Tools Coming Soon!"
                description="We're constantly expanding our toolkit. Check out our upcoming features below!"
              />
            </div>
          </div>
        </section>
        
        {/* Expanded Toolkit Section */}
        <section id="toolkit" className="py-16 md:py-24 bg-secondary/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">Explore Our Expanding Toolkit</h2>
            <p className="text-center text-muted-foreground mb-12 md:mb-16 max-w-2xl mx-auto">
              Discover specialized AI tools to tackle every aspect of your content and branding needs. Many more coming soon!
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newToolsForLanding.map(tool => (
                <FeatureHighlight
                  key={tool.slug}
                  icon={<tool.icon className="h-10 w-10 text-primary" />}
                  title={tool.title + (tool.isComingSoon ? " (Coming Soon)" : "")}
                  description={tool.description}
                />
              ))}
            </div>
          </div>
        </section>


        {/* Call to Action Section */}
        <section className="py-16 md:py-24 bg-gradient-to-tr from-primary/5 via-secondary/10 to-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Ready to Dominate the SERPs?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Join SEO Content Forge today and transform your content strategy. No credit card required to start.
            </p>
            <Button size="lg" asChild className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <Link href="/dashboard">
                Unlock Your Content Potential
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

interface FeatureHighlightProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureHighlight({ icon, title, description }: FeatureHighlightProps) {
  return (
    <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card flex flex-col">
      <CardHeader className="items-center">
        <div className="p-4 bg-primary/10 rounded-full mb-4 inline-block">
          {icon}
        </div>
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
