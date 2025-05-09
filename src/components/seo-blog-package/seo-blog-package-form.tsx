
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
import { generateSeoBlogPackage, type SeoBlogPackageInput, type SeoBlogPackageOutput } from '@/ai/flows/seo-blog-package-flow';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Copy, PackageCheck, BarChart, ListOrdered } from 'lucide-react';
import { useGeneratedContentHistory } from '@/hooks/use-generated-content-history';
import type { NewSeoBlogPackageHistoryData } from '@/lib/history-types';

const contentTypes = ["article", "blog post"] as const;
const desiredTones = ["Informative", "Persuasive", "Casual", "Formal", "Humorous", "Professional", "Encouraging", "Authoritative", "Friendly"] as const;
const wordCounts = [500, 1000, 1500, 2000, 2500, 3000] as const;

const formSchema = z.object({
  topic: z.string().min(10, { message: "Topic must be at least 10 characters." }).max(200, { message: "Topic must not exceed 200 characters." }),
  contentType: z.enum(contentTypes).default('blog post'),
  focusKeywords: z.string().optional(),
  targetAudience: z.string().optional(),
  desiredTone: z.enum(desiredTones).optional(),
  approximateWordCount: z.coerce.number().optional(),
});

type SeoBlogPackageFormValues = z.infer<typeof formSchema>;

export function SeoBlogPackageForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPackage, setGeneratedPackage] = useState<SeoBlogPackageOutput | null>(null);
  const { toast } = useToast();
  const { addHistoryItem } = useGeneratedContentHistory();

  const form = useForm<SeoBlogPackageFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      contentType: 'blog post',
      focusKeywords: '',
      targetAudience: '',
    },
  });

  const onSubmit: SubmitHandler<SeoBlogPackageFormValues> = async (data) => {
    setIsLoading(true);
    setGeneratedPackage(null);
    try {
      const result = await generateSeoBlogPackage(data as SeoBlogPackageInput);
      setGeneratedPackage(result);

      const historyEntry: NewSeoBlogPackageHistoryData = {
        type: 'SEO_BLOG_PACKAGE',
        primaryIdentifier: result.title || data.topic,
        input: data as SeoBlogPackageInput,
        output: result,
      };
      addHistoryItem(historyEntry);

      toast({
        title: "SEO Blog Package Generated",
        description: "Your complete blog package has been generated and saved to history.",
      });
    } catch (error) {
      console.error("Error generating SEO blog package:", error);
      toast({
        title: "Error",
        description: "Failed to generate blog package. Please try again.",
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
              <CardTitle>SEO Blog Package Generator</CardTitle>
              <CardDescription>
                Provide details for your content. AI will generate a complete package: title, meta description, keywords, slug, structured outline, full content body, and an SEO score.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="topic">Main Topic</FormLabel>
                    <FormControl>
                      <Textarea
                        id="topic"
                        placeholder="e.g., The Ultimate Guide to Digital Marketing in 2024"
                        className="min-h-[100px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Clearly define the subject matter for the blog package.
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
                          <SelectTrigger>
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
                        <Input id="focusKeywords" placeholder="e.g., digital marketing, SEO strategies" {...field} />
                      </FormControl>
                      <FormDescription>Comma-separated keywords.</FormDescription>
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
                        <Input id="targetAudience" placeholder="e.g., small business owners, marketing managers" {...field} />
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
                          <SelectTrigger>
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
                        <SelectTrigger>
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
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Package...
                  </>
                ) : (
                  <>
                    <PackageCheck className="mr-2 h-4 w-4" />
                    Generate Blog Package
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {generatedPackage && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Generated SEO Blog Package</CardTitle>
            <CardDescription>Review the AI-generated content package below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                <Label htmlFor="result-title" className="text-sm font-medium">Generated Title</Label>
                <div className="flex items-center gap-2 mt-1">
                    <Input id="result-title" value={generatedPackage.title} readOnly className="bg-muted/50"/>
                    <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(generatedPackage.title, "Title")}>
                    <Copy className="h-4 w-4" />
                    </Button>
                </div>
                </div>
                <div>
                <Label htmlFor="result-slug" className="text-sm font-medium">Suggested Slug</Label>
                <div className="flex items-center gap-2 mt-1">
                    <Input id="result-slug" value={generatedPackage.slug} readOnly className="bg-muted/50"/>
                    <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(generatedPackage.slug, "Slug")}>
                    <Copy className="h-4 w-4" />
                    </Button>
                </div>
                </div>
            </div>
            
            <div>
              <Label htmlFor="result-meta" className="text-sm font-medium">Meta Description</Label>
               <div className="flex items-center gap-2 mt-1">
                <Textarea id="result-meta" value={generatedPackage.metaDescription} readOnly className="bg-muted/50 min-h-[80px]" />
                <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(generatedPackage.metaDescription, "Meta Description")}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                <Label htmlFor="result-keywords" className="text-sm font-medium">Suggested Keywords</Label>
                <div className="flex items-center gap-2 mt-1">
                    <Input id="result-keywords" value={generatedPackage.suggestedKeywords} readOnly className="bg-muted/50"/>
                    <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(generatedPackage.suggestedKeywords, "Keywords")}>
                    <Copy className="h-4 w-4" />
                    </Button>
                </div>
                </div>
                <div>
                <Label htmlFor="result-seo-score" className="text-sm font-medium">SEO Score</Label>
                <div className="flex items-center gap-2 mt-1">
                    <Input id="result-seo-score" value={generatedPackage.seoScore} readOnly className="bg-muted/50 font-semibold"/>
                    <BarChart className="h-5 w-5 text-primary" /> 
                </div>
                </div>
            </div>

            <div>
              <Label htmlFor="result-outline" className="text-sm font-medium">Structured Outline (Markdown)</Label>
               <div className="flex items-start gap-2 mt-1">
                <Textarea id="result-outline" value={generatedPackage.outline} readOnly className="mt-1 bg-muted/50 min-h-[200px] resize-y" />
                 <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(generatedPackage.outline, "Outline")}>
                  <Copy className="h-4 w-4" />
                  <ListOrdered className="h-4 w-4 ml-1 sr-only" /> {/* Icon for outline */}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="result-content" className="text-sm font-medium">Generated Content Body (Markdown)</Label>
               <div className="flex items-start gap-2 mt-1">
                <Textarea id="result-content" value={generatedPackage.contentBody} readOnly className="mt-1 bg-muted/50 min-h-[400px] resize-y" />
                 <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(generatedPackage.contentBody, "Content Body")}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
           <CardFooter>
             <Button variant="outline" onClick={() => handleCopyToClipboard(JSON.stringify(generatedPackage, null, 2), "All Package Results as JSON")}>
                <Copy className="mr-2 h-4 w-4" /> Copy Full Package as JSON
              </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
