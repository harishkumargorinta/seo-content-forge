
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
import { generateYouTubeDescriptionAndTags, type GenerateYouTubeDescriptionAndTagsInput, type GenerateYouTubeDescriptionAndTagsOutput } from '@/ai/flows/youtube-description-tags-flow';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Copy, Tags as TagsIcon, FileText as FileTextIcon } from 'lucide-react'; // Renamed Tags to TagsIcon
import { useGeneratedContentHistory } from '@/hooks/use-generated-content-history';
import type { NewYouTubeDescriptionTagsHistoryData } from '@/lib/history-types'; // Will create this type
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  videoContent: z.string().min(10, "Video content (script, title, or summary) must be at least 10 characters.").max(10000, "Content too long. Please use a shorter script, summary, or title (max 10,000 chars)."),
  focusKeywords: z.string().optional(),
});

type YouTubeDescriptionTagsFormValues = z.infer<typeof formSchema>;

export function YouTubeDescriptionTagsForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<GenerateYouTubeDescriptionAndTagsOutput | null>(null);
  const { toast } = useToast();
  const { addHistoryItem } = useGeneratedContentHistory();

  const form = useForm<YouTubeDescriptionTagsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoContent: '',
      focusKeywords: '',
    },
  });

  const onSubmit: SubmitHandler<YouTubeDescriptionTagsFormValues> = async (data) => {
    setIsLoading(true);
    setGeneratedResult(null);
    try {
      const result = await generateYouTubeDescriptionAndTags(data);
      setGeneratedResult(result);

      const historyEntry: NewYouTubeDescriptionTagsHistoryData = { // Ensure this type matches
        type: 'YOUTUBE_DESCRIPTION_TAGS',
        primaryIdentifier: `Desc/Tags for: ${data.videoContent.substring(0, 50)}...`,
        input: data,
        output: result,
      };
      addHistoryItem(historyEntry);

      toast({
        title: "YouTube Description & Tags Generated",
        description: "Suggestions are ready and saved to history.",
      });
    } catch (error) {
      console.error("Error generating YouTube description & tags:", error);
      toast({
        title: "Error",
        description: `Failed to generate content: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
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
              <CardTitle className="flex items-center"><TagsIcon className="mr-2 h-6 w-6 text-primary" /> AI YouTube Description & Tags Generator</CardTitle>
              <CardDescription>
                Paste your video script, a detailed summary, or just the title. Our AI will generate an engaging description and relevant tags for your YouTube video.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="videoContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="videoContent">Video Content (Script, Summary, or Title)</FormLabel>
                    <FormControl>
                      <Textarea
                        id="videoContent"
                        placeholder="e.g., Full video script, a detailed summary of key points, or your main video title..."
                        className="min-h-[150px] resize-y"
                        suppressHydrationWarning
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide as much detail as possible for the best results.
                    </FormDescription>
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
                      <Input id="focusKeywords" placeholder="e.g., DIY home decor, budget travel tips, React tutorial" suppressHydrationWarning {...field} />
                    </FormControl>
                    <FormDescription>Comma-separated keywords you want to emphasize.</FormDescription>
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
                    Generating...
                  </>
                ) : (
                  <>
                    <TagsIcon className="mr-2 h-4 w-4" />
                    Generate Description & Tags
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
            <CardTitle className="flex items-center"><FileTextIcon className="mr-2 h-6 w-6 text-primary" />Generated YouTube Content</CardTitle>
            <CardDescription>Review the AI-generated description and tags below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="result-description" className="text-sm font-medium">Generated Video Description</Label>
              <div className="flex items-start gap-2 mt-1">
                <Textarea
                  id="result-description"
                  value={generatedResult.videoDescription}
                  readOnly
                  className="bg-muted/50 min-h-[200px] resize-y whitespace-pre-wrap"
                  suppressHydrationWarning
                />
                <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(generatedResult.videoDescription, "Video Description")} title="Copy description">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Separator />

            <div>
              <Label htmlFor="result-tags" className="text-sm font-medium">Generated Video Tags</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  id="result-tags"
                  value={generatedResult.videoTags}
                  readOnly
                  className="bg-muted/50"
                  suppressHydrationWarning
                />
                <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(generatedResult.videoTags, "Video Tags")} title="Copy tags">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Comma-separated list of suggested tags.
              </p>
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
