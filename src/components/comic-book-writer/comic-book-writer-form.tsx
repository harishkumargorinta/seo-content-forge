
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
import { generateComicBook, type GenerateComicBookInput, type GenerateComicBookOutput, type ComicPanelSchema as PanelOutput } from '@/ai/flows/comic-book-writer-flow';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Copy, Sparkles, FileText, MessageSquare } from 'lucide-react';
import { useGeneratedContentHistory } from '@/hooks/use-generated-content-history';
import type { NewComicBookWriterHistoryData } from '@/lib/history-types';
import { Separator } from '@/components/ui/separator';

const targetAgeGroups = ['3-5 years', '6-8 years', '9-11 years'] as const;
const storyTones = ['Funny', 'Adventurous', 'Educational', 'Heartwarming', 'Silly'] as const;

const formSchema = z.object({
  storyTheme: z.string().min(5, "Story theme/idea is required.").max(300, "Theme too long."),
  mainCharacters: z.string().min(5, "Character descriptions are required.").max(500, "Character descriptions too long."),
  targetAgeGroup: z.enum(targetAgeGroups).default('6-8 years'),
  approximatePanels: z.number().min(3).max(20).default(6),
  storyTone: z.enum(storyTones).default('Funny'),
});

type ComicBookFormValues = z.infer<typeof formSchema>;

export function ComicBookWriterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedComic, setGeneratedComic] = useState<GenerateComicBookOutput | null>(null);
  const { toast } = useToast();
  const { addHistoryItem } = useGeneratedContentHistory();

  const form = useForm<ComicBookFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      storyTheme: '',
      mainCharacters: '',
      targetAgeGroup: '6-8 years',
      approximatePanels: 6,
      storyTone: 'Funny',
    },
  });

  const onSubmit: SubmitHandler<ComicBookFormValues> = async (data) => {
    setIsLoading(true);
    setGeneratedComic(null);
    try {
      const result = await generateComicBook(data);
      setGeneratedComic(result);

      const historyEntry: NewComicBookWriterHistoryData = {
        type: 'COMIC_BOOK_WRITER',
        primaryIdentifier: result.comicTitle || data.storyTheme.substring(0,50),
        input: data,
        output: result,
      };
      addHistoryItem(historyEntry);

      toast({
        title: "Kids' Comic Book Script Generated!",
        description: "Your comic script is ready and saved to history.",
      });
    } catch (error) {
      console.error("Error generating comic book script:", error);
      toast({
        title: "Error",
        description: `Failed to generate comic script: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
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
              <CardTitle className="flex items-center"><Sparkles className="mr-2 h-6 w-6 text-yellow-500" /> AI Kids' Comic Book Writer</CardTitle>
              <CardDescription>
                Create a fun and engaging comic book script for children. Provide the theme, characters, and desired style!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="storyTheme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="storyTheme">Story Theme / Idea</FormLabel>
                    <FormControl>
                      <Textarea
                        id="storyTheme"
                        placeholder="e.g., A brave little squirrel searches for a giant acorn, Two best friends build a magical treehouse."
                        className="min-h-[80px] resize-y"
                        suppressHydrationWarning
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mainCharacters"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="mainCharacters">Main Characters</FormLabel>
                    <FormControl>
                      <Textarea
                        id="mainCharacters"
                        placeholder="e.g., Pip: a small, adventurous mouse; Rosie: a kind and clever fox; Barnaby: a grumpy but lovable bear."
                        className="min-h-[80px] resize-y"
                        suppressHydrationWarning
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Describe 1-3 main characters with their names and a key trait.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="targetAgeGroup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Age Group</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger suppressHydrationWarning>
                            <SelectValue placeholder="Select age group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {targetAgeGroups.map(age => (
                            <SelectItem key={age} value={age}>
                              {age}
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
                  name="storyTone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Story Tone</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger suppressHydrationWarning>
                            <SelectValue placeholder="Select story tone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {storyTones.map(tone => (
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
                name="approximatePanels"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="approximatePanels">Approximate Number of Panels: {field.value}</FormLabel>
                    <FormControl>
                       <Slider
                        id="approximatePanels"
                        min={3}
                        max={20}
                        step={1}
                        defaultValue={[field.value || 6]}
                        onValueChange={(value) => field.onChange(value[0])}
                        suppressHydrationWarning
                      />
                    </FormControl>
                    <FormDescription>Choose how many comic panels you want (3-20).</FormDescription>
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
                    Drawing up Ideas...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Comic Script
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {generatedComic && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center"><FileText className="mr-2 h-6 w-6 text-primary" />Generated Comic Script</CardTitle>
            <CardDescription>Review the AI-generated comic title, characters, story summary, and panels.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="result-comic-title" className="text-sm font-medium">Comic Title</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input id="result-comic-title" value={generatedComic.comicTitle} readOnly className="bg-muted/50" suppressHydrationWarning/>
                <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(generatedComic.comicTitle, "Comic Title")} title="Copy title">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="result-character-summary" className="text-sm font-medium">Character Summary</Label>
               <Textarea id="result-character-summary" value={generatedComic.characterSummary} readOnly className="bg-muted/50 mt-1 min-h-[60px]" suppressHydrationWarning/>
            </div>
            <div>
              <Label htmlFor="result-story-summary" className="text-sm font-medium">Story Summary</Label>
               <Textarea id="result-story-summary" value={generatedComic.storySummary} readOnly className="bg-muted/50 mt-1 min-h-[60px]" suppressHydrationWarning/>
            </div>
            
            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Comic Panels:</h3>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {generatedComic.panels.map((panel, index) => (
                  <Card key={index} className="p-4 bg-secondary/20 border">
                    <CardHeader className="p-0 pb-2">
                      <CardTitle className="text-md font-semibold">Panel {panel.panelNumber}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 space-y-2 text-sm">
                       <div>
                        <p className="font-medium text-muted-foreground">Scene Description:</p>
                        <p className="pl-2 whitespace-pre-wrap">{panel.sceneDescription}</p>
                       </div>
                       <div>
                        <p className="font-medium text-muted-foreground flex items-center"><MessageSquare className="h-4 w-4 mr-1"/>Dialogue/Caption:</p>
                        <p className="pl-2 whitespace-pre-wrap">{panel.dialogueOrCaption}</p>
                       </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
           <CardFooter>
             <Button variant="outline" onClick={() => handleCopyToClipboard(JSON.stringify(generatedComic, null, 2), "Full Comic Script as JSON")} suppressHydrationWarning>
                <Copy className="mr-2 h-4 w-4" /> Copy Full Script as JSON
              </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
