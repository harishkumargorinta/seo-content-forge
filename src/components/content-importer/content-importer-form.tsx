
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
import { rewriteImportedContent, type RewriteImportedContentInput, type RewriteImportedContentOutput } from '@/ai/flows/rewrite-imported-content-flow';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Copy, Link2, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const formSchema = z.object({
  articleUrl: z.string().url({ message: "Please enter a valid URL." }).min(1, "Article URL is required."),
  customInstructions: z.string().optional(),
});

type ContentImporterFormValues = z.infer<typeof formSchema>;

export function ContentImporterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [rewriteResult, setRewriteResult] = useState<RewriteImportedContentOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<ContentImporterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      articleUrl: '',
      customInstructions: '',
    },
  });

  const onSubmit: SubmitHandler<ContentImporterFormValues> = async (data) => {
    setIsLoading(true);
    setRewriteResult(null);
    try {
      const result = await rewriteImportedContent(data);
      setRewriteResult(result);
      if (result.detectedError) {
        toast({
          title: "Error during processing",
          description: result.detectedError,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Content Rewriting Complete",
          description: "The content has been fetched and rewritten.",
        });
      }
    } catch (error) {
      console.error("Error rewriting content:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({
        title: "Error",
        description: `Failed to rewrite content: ${errorMessage}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = (text: string | undefined, fieldName: string) => {
    if (!text) {
      toast({ title: "Nothing to copy", description: `${fieldName} is empty.`, variant: "default" });
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
              <CardTitle>Content Importer & Rewriter</CardTitle>
              <CardDescription>
                Enter the URL of an article. The system will attempt to fetch its main textual content and rewrite it to be unique and SEO-friendly based on your instructions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="articleUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="articleUrl">Article URL</FormLabel>
                    <FormControl>
                      <Input id="articleUrl" placeholder="https://example.com/article-to-rewrite" {...field} />
                    </FormControl>
                    <FormDescription>
                      The full URL of the article you want to import and rewrite.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customInstructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="customInstructions">Custom Instructions (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        id="customInstructions"
                        placeholder="e.g., Rewrite in a casual tone for young adults. Focus on sustainability aspects. Ensure keywords 'X', 'Y' are included."
                        className="min-h-[100px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide any specific guidelines for the rewriting process, such as tone, target audience, or keywords.
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
                    Fetching & Rewriting...
                  </>
                ) : (
                  <>
                    <Link2 className="mr-2 h-4 w-4" />
                    Import & Rewrite Content
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {rewriteResult && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Rewritten Content</CardTitle>
            <CardDescription>
              Review the AI-generated rewritten content and SEO elements below.
              {rewriteResult.originalUrl && <p className="text-xs mt-1">Original URL: <a href={rewriteResult.originalUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">{rewriteResult.originalUrl}</a></p>}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {rewriteResult.detectedError && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Processing Error</AlertTitle>
                  <AlertDescription>{rewriteResult.detectedError}</AlertDescription>
                </Alert>
            )}
            {!rewriteResult.detectedError && (
                <>
                    <div>
                    <Label htmlFor="result-title" className="text-sm font-medium">Rewritten Title</Label>
                    <div className="flex items-center gap-2 mt-1">
                        <Input id="result-title" value={rewriteResult.rewrittenTitle} readOnly className="bg-muted/50"/>
                        <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(rewriteResult.rewrittenTitle, "Rewritten Title")}>
                        <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                    </div>
                    <div>
                    <Label htmlFor="result-meta" className="text-sm font-medium">Rewritten Meta Description</Label>
                    <div className="flex items-center gap-2 mt-1">
                        <Textarea id="result-meta" value={rewriteResult.rewrittenMetaDescription} readOnly className="bg-muted/50 min-h-[80px]" />
                        <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(rewriteResult.rewrittenMetaDescription, "Rewritten Meta Description")}>
                        <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                    </div>
                    <div>
                    <Label htmlFor="result-content" className="text-sm font-medium">Rewritten Content (Markdown)</Label>
                    <div className="flex items-start gap-2 mt-1">
                        <Textarea id="result-content" value={rewriteResult.rewrittenContentBody} readOnly className="mt-1 bg-muted/50 min-h-[400px] resize-y" />
                        <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(rewriteResult.rewrittenContentBody, "Rewritten Content Body")}>
                        <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                    </div>
                </>
            )}
          </CardContent>
           {!rewriteResult.detectedError && (rewriteResult.rewrittenTitle || rewriteResult.rewrittenMetaDescription || rewriteResult.rewrittenContentBody) && (
            <CardFooter>
                <Button variant="outline" onClick={() => handleCopyToClipboard(JSON.stringify({ title: rewriteResult.rewrittenTitle, metaDescription: rewriteResult.rewrittenMetaDescription, contentBody: rewriteResult.rewrittenContentBody }, null, 2), "All Rewritten Results as JSON")}>
                    <Copy className="mr-2 h-4 w-4" /> Copy Rewritten Results as JSON
                </Button>
            </CardFooter>
           )}
        </Card>
      )}
    </div>
  );
}
