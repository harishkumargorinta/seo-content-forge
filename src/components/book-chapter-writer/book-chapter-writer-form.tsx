
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
import { generateBookChapter, type GenerateBookChapterInput, type GenerateBookChapterOutput } from '@/ai/flows/book-chapter-writer-flow';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Copy, BookText, ListTree } from 'lucide-react';
import { useGeneratedContentHistory } from '@/hooks/use-generated-content-history';
import type { NewBookChapterWriterHistoryData } from '@/lib/history-types';
import { Separator } from '@/components/ui/separator';

const desiredTones = ["Academic", "Conversational", "Instructional", "Inspirational", "Formal", "Informal", "Persuasive", "Objective"] as const;
const wordCounts = [1000, 1500, 2000, 2500, 3000, 4000, 5000] as const;

const formSchema = z.object({
  chapterTopic: z.string().min(5, "Chapter topic is required and must be at least 5 characters.").max(200, "Chapter topic too long."),
  overallBookTopic: z.string().min(5, "Overall book topic is required.").max(300, "Overall book topic too long."),
  keyPointsToCover: z.string().min(10, "Key points are required.").max(2000, "Key points description too long."),
  targetAudience: z.string().optional(),
  desiredTone: z.enum(desiredTones).optional(),
  approximateWordCount: z.coerce.number().optional(),
});

type BookChapterFormValues = z.infer<typeof formSchema>;

export function BookChapterWriterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedChapter, setGeneratedChapter] = useState<GenerateBookChapterOutput | null>(null);
  const { toast } = useToast();
  const { addHistoryItem } = useGeneratedContentHistory();

  const form = useForm<BookChapterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chapterTopic: '',
      overallBookTopic: '',
      keyPointsToCover: '',
      targetAudience: '',
    },
  });

  const onSubmit: SubmitHandler<BookChapterFormValues> = async (data) => {
    setIsLoading(true);
    setGeneratedChapter(null);
    try {
      const result = await generateBookChapter(data);
      setGeneratedChapter(result);

      const historyEntry: NewBookChapterWriterHistoryData = {
        type: 'BOOK_CHAPTER_WRITER',
        primaryIdentifier: result.generatedChapterTitle || data.chapterTopic,
        input: data,
        output: result,
      };
      addHistoryItem(historyEntry);

      toast({
        title: "Book Chapter Generated",
        description: "Your chapter content is ready and saved to history.",
      });
    } catch (error) {
      console.error("Error generating book chapter:", error);
      toast({
        title: "Error",
        description: `Failed to generate chapter: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
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
              <CardTitle className="flex items-center"><BookText className="mr-2 h-6 w-6 text-primary" /> AI Book Chapter Writer (Non-Fiction)</CardTitle>
              <CardDescription>
                Provide details about your chapter and book. AI will help draft a well-structured non-fiction chapter.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="chapterTopic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="chapterTopic">Chapter Topic / Title Idea</FormLabel>
                    <FormControl>
                      <Input id="chapterTopic" placeholder="e.g., The Basics of Quantum Physics, Chapter 1: Introduction to SEO" suppressHydrationWarning {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="overallBookTopic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="overallBookTopic">Overall Book Topic / Theme</FormLabel>
                    <FormControl>
                      <Input id="overallBookTopic" placeholder="e.g., A Beginner's Guide to the Universe, Mastering Digital Marketing" suppressHydrationWarning {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="keyPointsToCover"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="keyPointsToCover">Key Points to Cover in this Chapter</FormLabel>
                    <FormControl>
                      <Textarea
                        id="keyPointsToCover"
                        placeholder="List the main arguments, information, or sections to include. e.g., - Definition of X\n- Importance of Y\n- Common misconceptions about Z\n- Case study of A"
                        className="min-h-[120px] resize-y"
                        suppressHydrationWarning
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Provide a detailed outline or comma-separated list of key topics.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="targetAudience">Target Audience (Optional)</FormLabel>
                      <FormControl>
                        <Input id="targetAudience" placeholder="e.g., university students, entrepreneurs, general readers" suppressHydrationWarning {...field} />
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
                    Writing Chapter...
                  </>
                ) : (
                  <>
                    <BookText className="mr-2 h-4 w-4" />
                    Generate Chapter
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {generatedChapter && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center"><ListTree className="mr-2 h-6 w-6 text-primary" />Generated Chapter Content</CardTitle>
            <CardDescription>Review the AI-generated chapter title, content, and suggested subheadings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="result-chapter-title" className="text-sm font-medium">Generated Chapter Title</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input id="result-chapter-title" value={generatedChapter.generatedChapterTitle} readOnly className="bg-muted/50" suppressHydrationWarning/>
                <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(generatedChapter.generatedChapterTitle, "Chapter Title")} title="Copy title">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {generatedChapter.suggestedSubheadings && (
              <div>
                <Label htmlFor="result-subheadings" className="text-sm font-medium">Suggested Subheadings</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input id="result-subheadings" value={generatedChapter.suggestedSubheadings} readOnly className="bg-muted/50" suppressHydrationWarning/>
                  <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(generatedChapter.suggestedSubheadings, "Suggested Subheadings")} title="Copy subheadings">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            
            <Separator />

            <div>
              <Label htmlFor="result-chapter-content" className="text-sm font-medium">Chapter Content (Markdown)</Label>
              <div className="flex items-start gap-2 mt-1">
                <Textarea
                  id="result-chapter-content"
                  value={generatedChapter.chapterContent}
                  readOnly
                  className="bg-muted/50 min-h-[400px] resize-y whitespace-pre-wrap"
                  suppressHydrationWarning
                />
                <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(generatedChapter.chapterContent, "Chapter Content")} title="Copy content">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
           <CardFooter>
             <Button variant="outline" onClick={() => handleCopyToClipboard(JSON.stringify(generatedChapter, null, 2), "All Chapter Results as JSON")} suppressHydrationWarning>
                <Copy className="mr-2 h-4 w-4" /> Copy All Results as JSON
              </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
