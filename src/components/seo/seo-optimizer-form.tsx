
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
import { optimizeContentSeo, type OptimizeContentSeoInput, type OptimizeContentSeoOutput } from '@/ai/flows/seo-optimize-content';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Copy } from 'lucide-react';
import { useGeneratedContentHistory } from '@/hooks/use-generated-content-history';
import type { NewSeoHistoryData } from '@/lib/history-types';

const formSchema = z.object({
  content: z.string().min(50, { message: "Content must be at least 50 characters." }).max(5000, { message: "Content must not exceed 5000 characters." }),
  focusKeyword: z.string().optional(),
});

type SeoFormValues = z.infer<typeof formSchema>;

export function SeoOptimizerForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [seoResult, setSeoResult] = useState<OptimizeContentSeoOutput | null>(null);
  const { toast } = useToast();
  const { addHistoryItem } = useGeneratedContentHistory();

  const form = useForm<SeoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
      focusKeyword: '',
    },
  });

  const onSubmit: SubmitHandler<SeoFormValues> = async (data) => {
    setIsLoading(true);
    setSeoResult(null);
    try {
      const result = await optimizeContentSeo(data as OptimizeContentSeoInput);
      setSeoResult(result);
      
      const historyEntry: NewSeoHistoryData = {
        type: 'SEO_OPTIMIZATION',
        primaryIdentifier: data.focusKeyword || `Content starting: "${data.content.substring(0, 30)}..."`,
        input: { content: data.content, focusKeyword: data.focusKeyword }, // Storing full input here, can be changed to snippet
        output: result,
      };
      addHistoryItem(historyEntry);

      toast({
        title: "SEO Optimization Complete",
        description: "Your content has been analyzed and suggestions are ready. Saved to history.",
      });
    } catch (error) {
      console.error("Error optimizing SEO:", error);
      toast({
        title: "Error",
        description: "Failed to optimize content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = (text: string, fieldName: string) => {
    if (!text) return;
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
              <CardTitle>AI-Powered SEO Optimizer</CardTitle>
              <CardDescription>
                Enter your content and an optional focus keyword. Our AI will suggest an optimized title, meta description, and relevant keywords.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="content">Content</FormLabel>
                    <FormControl>
                      <Textarea
                        id="content"
                        placeholder="Paste your article content here..."
                        className="min-h-[200px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The main body of your text content. Minimum 50 characters.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="focusKeyword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="focusKeyword">Focus Keyword (Optional)</FormLabel>
                    <FormControl>
                      <Input id="focusKeyword" placeholder="e.g., 'best coffee makers'" {...field} />
                    </FormControl>
                    <FormDescription>
                      The primary keyword you want to target.
                    </FormDescription>
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
                    Optimizing...
                  </>
                ) : (
                  'Optimize Content'
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {seoResult && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Optimization Results</CardTitle>
            <CardDescription>Here are the AI-generated suggestions for your content:</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="result-title" className="text-sm font-medium">Optimized Title</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input id="result-title" value={seoResult.title} readOnly className="bg-muted/50"/>
                <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(seoResult.title, "Optimized Title")}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="result-meta" className="text-sm font-medium">Meta Description</Label>
              <div className="flex items-center gap-2 mt-1">
                <Textarea id="result-meta" value={seoResult.metaDescription} readOnly className="mt-1 bg-muted/50 min-h-[80px]" />
                 <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(seoResult.metaDescription, "Meta Description")}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="result-keywords" className="text-sm font-medium">Suggested Keywords</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input id="result-keywords" value={seoResult.keywords} readOnly className="mt-1 bg-muted/50"/>
                 <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(seoResult.keywords, "Suggested Keywords")}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
             <Button variant="outline" onClick={() => handleCopyToClipboard(JSON.stringify(seoResult, null, 2), "All Results as JSON")}>
                <Copy className="mr-2 h-4 w-4" /> Copy Results as JSON
              </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
