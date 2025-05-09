
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
import { generateContent, type GenerateContentInput, type GenerateContentOutput } from '@/ai/flows/content-writer-flow';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Copy, BarChart } from 'lucide-react';
import { useGeneratedContentHistory } from '@/hooks/use-generated-content-history';
import type { NewContentWriterHistoryData } from '@/lib/history-types';

const contentTypes = ["article", "blog post"] as const;
const desiredTones = ["Informative", "Persuasive", "Casual", "Formal", "Humorous", "Professional", "Encouraging"] as const;
const wordCounts = [500, 1000, 1500, 2000] as const;


const formSchema = z.object({
  topic: z.string().min(10, { message: "Topic must be at least 10 characters." }).max(200, { message: "Topic must not exceed 200 characters." }),
  contentType: z.enum(contentTypes).default('article'),
  focusKeywords: z.string().optional(),
  targetAudience: z.string().optional(),
  desiredTone: z.enum(desiredTones).optional(),
  approximateWordCount: z.coerce.number().optional(),
});

type ContentWriterFormValues = z.infer<typeof formSchema>;

export function ContentWriterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GenerateContentOutput | null>(null);
  const { toast } = useToast();
  const { addHistoryItem } = useGeneratedContentHistory();

  const form = useForm<ContentWriterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      contentType: 'article',
      focusKeywords: '',
      targetAudience: '',
    },
  });

  const onSubmit: SubmitHandler<ContentWriterFormValues> = async (data) => {
    setIsLoading(true);
    setGeneratedContent(null);
    try {
      const result = await generateContent(data as GenerateContentInput);
      setGeneratedContent(result);

      const historyEntry: NewContentWriterHistoryData = {
        type: 'CONTENT_WRITING',
        primaryIdentifier: result.title || data.topic,
        input: data as GenerateContentInput,
        output: result,
      };
      addHistoryItem(historyEntry);

      toast({
        title: "Content Generation Complete",
        description: "Your content has been generated and suggestions are ready. Saved to history.",
      });
    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = (text: string, fieldName: string) => {
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
              <CardTitle>AI Content Writer</CardTitle>
              <CardDescription>
                Provide details about the content you need. Our AI will generate an article or blog post tailored to your requirements, along with SEO suggestions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="topic">Topic</FormLabel>
                    <FormControl>
                      <Textarea
                        id="topic"
                        placeholder="Enter the main topic for your content..."
                        className="min-h-[100px] resize-y"
                        suppressHydrationWarning
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Clearly define the subject matter. Minimum 10 characters.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger suppressHydrationWarning>
                            <SelectValue placeholder="Select content type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {contentTypes.map(type => (
                            <SelectItem key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
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
                  name="focusKeywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="focusKeywords">Focus Keywords (Optional)</FormLabel>
                      <FormControl>
                        <Input id="focusKeywords" placeholder="e.g., healthy recipes, vegan diet" suppressHydrationWarning {...field} />
                      </FormControl>
                      <FormDescription>
                        Comma-separated keywords.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="targetAudience">Target Audience (Optional)</FormLabel>
                      <FormControl>
                        <Input id="targetAudience" placeholder="e.g., busy professionals, new parents" suppressHydrationWarning {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="desiredTone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Desired Tone (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger suppressHydrationWarning>
                            <SelectValue placeholder="Select desired tone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {desiredTones.map(tone => (
                            <SelectItem key={tone} value={tone}>
                              {tone}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="approximateWordCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Approximate Word Count (Optional)</FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger suppressHydrationWarning>
                          <SelectValue placeholder="Select approximate word count" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {wordCounts.map(count => (
                          <SelectItem key={count} value={count.toString()}>
                            {count} words
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    Generating Content...
                  </>
                ) : (
                  'Generate Content'
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {generatedContent && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Generated Content & SEO Suggestions</CardTitle>
            <CardDescription>Review the AI-generated content and SEO elements below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="result-title" className="text-sm font-medium">Generated Title</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input id="result-title" value={generatedContent.title} readOnly className="bg-muted/50" suppressHydrationWarning/>
                <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(generatedContent.title, "Title")}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="result-meta" className="text-sm font-medium">Meta Description</Label>
               <div className="flex items-center gap-2 mt-1">
                <Textarea id="result-meta" value={generatedContent.metaDescription} readOnly className="bg-muted/50 min-h-[80px]" suppressHydrationWarning/>
                <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(generatedContent.metaDescription, "Meta Description")}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
             <div>
              <Label htmlFor="result-slug" className="text-sm font-medium">Suggested Slug</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input id="result-slug" value={generatedContent.slug} readOnly className="bg-muted/50" suppressHydrationWarning/>
                 <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(generatedContent.slug, "Slug")}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="result-keywords" className="text-sm font-medium">Suggested Keywords</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input id="result-keywords" value={generatedContent.suggestedKeywords} readOnly className="bg-muted/50" suppressHydrationWarning/>
                <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(generatedContent.suggestedKeywords, "Keywords")}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="result-seo-score" className="text-sm font-medium">SEO Score</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input id="result-seo-score" value={generatedContent.seoScore} readOnly className="bg-muted/50 font-semibold" suppressHydrationWarning/>
                <BarChart className="h-5 w-5 text-primary" /> 
              </div>
            </div>
            <div>
              <Label htmlFor="result-content" className="text-sm font-medium">Generated Content (Markdown)</Label>
               <div className="flex items-start gap-2 mt-1">
                <Textarea id="result-content" value={generatedContent.contentBody} readOnly className="mt-1 bg-muted/50 min-h-[400px] resize-y" suppressHydrationWarning/>
                 <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(generatedContent.contentBody, "Content Body")}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
           <CardFooter>
             <Button variant="outline" onClick={() => handleCopyToClipboard(JSON.stringify(generatedContent, null, 2), "All Results as JSON")} suppressHydrationWarning>
                <Copy className="mr-2 h-4 w-4" /> Copy All Results as JSON
              </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

    
