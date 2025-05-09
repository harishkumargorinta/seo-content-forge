
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from "@/components/ui/slider";
import { generateFacebookTitles, type GenerateFacebookTitlesInput, type GenerateFacebookTitlesOutput } from '@/ai/flows/facebook-title-generator-flow';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Copy, Facebook, Lightbulb, ListChecks } from 'lucide-react';
import { useGeneratedContentHistory } from '@/hooks/use-generated-content-history';
import type { NewFacebookTitleGeneratorHistoryData } from '@/lib/history-types';
import { Separator } from '@/components/ui/separator';

const desiredStyles = [
  "Engaging & Clickable",
  "Informative & Direct",
  "Question-Based",
  "Benefit-Oriented",
  "Urgency/FOMO Driven",
  "Storytelling Hook"
] as const;

const formSchema = z.object({
  postContent: z.string().min(10, "Post content/idea must be at least 10 characters.").max(5000, "Content too long."),
  keywords: z.string().optional(),
  targetAudience: z.string().optional(),
  desiredStyle: z.enum(desiredStyles).optional(),
  titleCount: z.number().min(1).max(10).default(5),
});

type FacebookTitleFormValues = z.infer<typeof formSchema>;

export function FacebookTitleGeneratorForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<GenerateFacebookTitlesOutput | null>(null);
  const { toast } = useToast();
  const { addHistoryItem } = useGeneratedContentHistory();

  const form = useForm<FacebookTitleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      postContent: '',
      keywords: '',
      targetAudience: '',
      titleCount: 5,
    },
  });

  const onSubmit: SubmitHandler<FacebookTitleFormValues> = async (data) => {
    setIsLoading(true);
    setGeneratedResult(null);
    try {
      const result = await generateFacebookTitles(data);
      setGeneratedResult(result);

      const historyEntry: NewFacebookTitleGeneratorHistoryData = {
        type: 'FACEBOOK_TITLE_GENERATION',
        primaryIdentifier: `FB Titles for: ${data.postContent.substring(0, 50)}...`,
        input: data,
        output: result,
      };
      addHistoryItem(historyEntry);

      toast({
        title: "Facebook Titles Generated",
        description: "Suggestions are ready and saved to history.",
      });
    } catch (error) {
      console.error("Error generating Facebook titles:", error);
      toast({
        title: "Error",
        description: `Failed to generate titles: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = (text: string | undefined, fieldName: string) => {
    if (!text) {
      toast({ title: "Nothing to copy", description: `${fieldName} is empty.`});
      return;
    }
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: `${fieldName} has been copied.`,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="flex items-center"><Facebook className="mr-2 h-6 w-6 text-blue-600" /> AI Facebook Title Generator</CardTitle>
              <CardDescription>
                Provide details about your Facebook post. Our AI will craft engaging and click-worthy titles/headlines to boost your post's performance.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="postContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="postContent">Post Content / Idea</FormLabel>
                    <FormControl>
                      <Textarea
                        id="postContent"
                        placeholder="e.g., Announcing our new product launch!, Sharing a quick tip about..., A special offer for our followers..."
                        className="min-h-[100px] resize-y"
                        suppressHydrationWarning
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Describe the main subject or content of your Facebook post.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="keywords">Keywords (Optional)</FormLabel>
                      <FormControl>
                        <Input id="keywords" placeholder="e.g., new product, special offer, gardening tip" suppressHydrationWarning {...field} />
                      </FormControl>
                      <FormDescription>Comma-separated relevant keywords.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="targetAudience">Target Audience (Optional)</FormLabel>
                      <FormControl>
                        <Input id="targetAudience" placeholder="e.g., local customers, new moms, tech hobbyists" suppressHydrationWarning {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="desiredStyle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desired Title Style (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger suppressHydrationWarning>
                          <SelectValue placeholder="Select a title style" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {desiredStyles.map(style => (
                          <SelectItem key={style} value={style}>
                            {style}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="titleCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="titleCount">Number of Titles to Generate: {field.value}</FormLabel>
                    <FormControl>
                       <Slider
                        id="titleCount"
                        min={1}
                        max={10}
                        step={1}
                        defaultValue={[field.value || 5]}
                        onValueChange={(value) => field.onChange(value[0])}
                        suppressHydrationWarning
                      />
                    </FormControl>
                    <FormDescription>Choose how many title suggestions you want (1-10).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto" suppressHydrationWarning>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Titles...
                  </>
                ) : (
                  <>
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Generate Facebook Titles
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {generatedResult && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center"><ListChecks className="mr-2 h-6 w-6 text-primary" />Generated Facebook Titles & Tips</CardTitle>
            <CardDescription>Review the AI-generated titles and general tips. Choose the best one for your post!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Suggested Titles:</h3>
              <div className="space-y-4">
                {generatedResult.suggestedTitles.map((item, index) => (
                  <Card key={index} className="p-4 bg-secondary/30">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-semibold text-primary-foreground bg-primary px-2 py-1 rounded-md inline-block mb-1">Title Option {index + 1}</p>
                            <p className="text-lg font-medium text-foreground">{item.title}</p>
                            <p className="text-xs text-muted-foreground mt-1"><span className="font-semibold">Reasoning:</span> {item.reasoning}</p>
                        </div>
                      <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(item.title, `Title ${index + 1}`)} title="Copy title">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            
            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">General Tips for Facebook Titles:</h3>
              <div className="prose prose-sm max-w-none text-muted-foreground p-3 border rounded-md bg-background">
                 {generatedResult.generalTips.split('\n').map((tip, i) => tip.trim() && <p key={i} className="leading-relaxed my-1">{tip.replace(/^\s*-\s*/, '• ')}</p>)}
              </div>
               <Button variant="outline" size="sm" className="mt-2" onClick={() => handleCopyToClipboard(generatedResult.generalTips, "General Tips")} suppressHydrationWarning>
                  <Copy className="mr-2 h-3 w-3" /> Copy Tips
                </Button>
            </div>
          </CardContent>
           <CardFooter>
             <Button variant="outline" onClick={() => handleCopyToClipboard(JSON.stringify(generatedResult, null, 2), "All Results as JSON")} suppressHydrationWarning>
                <Copy className="mr-2 h-4 w-4" /> Copy All Results as JSON
              </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
