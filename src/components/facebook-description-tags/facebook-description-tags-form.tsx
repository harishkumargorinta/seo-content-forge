
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
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { generateFacebookDescriptionAndTags, type GenerateFacebookDescriptionTagsInput, type GenerateFacebookDescriptionTagsOutput } from '@/ai/flows/facebook-description-tags-flow';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Copy, Hash, MessageSquareText, Info } from 'lucide-react';
import { useGeneratedContentHistory } from '@/hooks/use-generated-content-history';
import type { NewFacebookDescriptionTagsHistoryData } from '@/lib/history-types';
import { Separator } from '@/components/ui/separator';

const desiredStyles = [
  "Engaging & Playful",
  "Informative & Direct",
  "Storytelling / Anecdotal",
  "Benefit-Oriented & Persuasive",
  "Urgency/FOMO Driven",
  "Community-Focused"
] as const;

const formSchema = z.object({
  postContent: z.string().min(10, "Post content/idea must be at least 10 characters.").max(5000, "Content too long."),
  keywords: z.string().optional(),
  targetAudience: z.string().optional(),
  desiredStyle: z.enum(desiredStyles).optional(),
  includeEmojis: z.boolean().default(false),
  callToAction: z.string().optional(),
  hashtagCount: z.number().min(0).max(10).default(5),
});

type FacebookDescTagsFormValues = z.infer<typeof formSchema>;

export function FacebookDescriptionTagsForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<GenerateFacebookDescriptionTagsOutput | null>(null);
  const { toast } = useToast();
  const { addHistoryItem } = useGeneratedContentHistory();

  const form = useForm<FacebookDescTagsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      postContent: '',
      keywords: '',
      targetAudience: '',
      includeEmojis: false,
      callToAction: '',
      hashtagCount: 5,
    },
  });

  const onSubmit: SubmitHandler<FacebookDescTagsFormValues> = async (data) => {
    setIsLoading(true);
    setGeneratedResult(null);
    try {
      const result = await generateFacebookDescriptionAndTags(data);
      setGeneratedResult(result);

      const historyEntry: NewFacebookDescriptionTagsHistoryData = {
        type: 'FACEBOOK_DESCRIPTION_TAGS',
        primaryIdentifier: `FB Desc/Tags for: ${data.postContent.substring(0, 50)}...`,
        input: data,
        output: result,
      };
      addHistoryItem(historyEntry);

      toast({
        title: "Facebook Description & Hashtags Generated",
        description: "Content is ready and saved to history.",
      });
    } catch (error) {
      console.error("Error generating Facebook content:", error);
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
              <CardTitle className="flex items-center"><MessageSquareText className="mr-2 h-6 w-6 text-blue-600" /> AI Facebook Description & Hashtags</CardTitle>
              <CardDescription>
                Provide your post idea, keywords, and style preferences. AI will generate an engaging description and relevant hashtags for your Facebook post.
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
                        placeholder="e.g., Excited to share our latest blog on sustainable living! OR We're running a special promotion this week..."
                        className="min-h-[120px] resize-y"
                        suppressHydrationWarning
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The core message or idea of your Facebook post.
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
                        <Input id="keywords" placeholder="e.g., sustainable living, eco-friendly, special discount" suppressHydrationWarning {...field} />
                      </FormControl>
                      <FormDescription>Comma-separated keywords for theme and hashtags.</FormDescription>
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
                        <Input id="targetAudience" placeholder="e.g., young professionals, parents, local community" suppressHydrationWarning {...field} />
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
                    <FormLabel>Desired Description Style (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger suppressHydrationWarning>
                          <SelectValue placeholder="Select a description style" />
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
                name="callToAction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="callToAction">Call To Action (Optional)</FormLabel>
                    <FormControl>
                      <Input id="callToAction" placeholder="e.g., Shop now!, Learn more, What are your thoughts?" suppressHydrationWarning {...field} />
                    </FormControl>
                     <FormDescription>A specific action you want users to take.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-4 items-center">
                 <FormField
                    control={form.control}
                    name="includeEmojis"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm col-span-2 md:col-span-1">
                        <div className="space-y-0.5">
                            <FormLabel>Include Emojis?</FormLabel>
                            <FormDescription>
                            Add relevant emojis to the description.
                            </FormDescription>
                        </div>
                        <FormControl>
                            <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            suppressHydrationWarning
                            />
                        </FormControl>
                        </FormItem>
                    )}
                    />
                <FormField
                    control={form.control}
                    name="hashtagCount"
                    render={({ field }) => (
                    <FormItem  className="col-span-2 md:col-span-1">
                        <FormLabel htmlFor="hashtagCount">Number of Hashtags: {field.value}</FormLabel>
                        <FormControl>
                        <Slider
                            id="hashtagCount"
                            min={0}
                            max={10}
                            step={1}
                            defaultValue={[field.value || 5]}
                            onValueChange={(value) => field.onChange(value[0])}
                            suppressHydrationWarning
                        />
                        </FormControl>
                        <FormDescription>Choose how many hashtags (0-10).</FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
               
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto" suppressHydrationWarning>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Content...
                  </>
                ) : (
                  <>
                    <MessageSquareText className="mr-2 h-4 w-4" />
                    Generate Description & Hashtags
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
            <CardTitle className="flex items-center"><Hash className="mr-2 h-6 w-6 text-primary" />Generated Facebook Content</CardTitle>
            <CardDescription>Review the AI-generated description, hashtags, and tips.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="result-description" className="text-sm font-medium">Generated Post Description</Label>
              <div className="flex items-start gap-2 mt-1">
                <Textarea
                  id="result-description"
                  value={generatedResult.postDescription}
                  readOnly
                  className="bg-muted/50 min-h-[150px] resize-y whitespace-pre-wrap"
                  suppressHydrationWarning
                />
                <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(generatedResult.postDescription, "Post Description")} title="Copy description">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Separator />

            <div>
              <Label htmlFor="result-hashtags" className="text-sm font-medium">Suggested Hashtags</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  id="result-hashtags"
                  value={generatedResult.suggestedHashtags}
                  readOnly
                  className="bg-muted/50"
                  suppressHydrationWarning
                />
                <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(generatedResult.suggestedHashtags, "Suggested Hashtags")} title="Copy hashtags">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Comma-separated list of suggested hashtags.
              </p>
            </div>

            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold mb-2 text-foreground flex items-center"><Info className="mr-2 h-5 w-5 text-primary"/>Effectiveness Tips:</h3>
              <div className="prose prose-sm max-w-none text-muted-foreground p-3 border rounded-md bg-background">
                 {generatedResult.effectivenessTips.split('\n').map((tip, i) => tip.trim() && <p key={i} className="leading-relaxed my-1">{tip.replace(/^\s*-\s*/, '• ').replace(/^\d\.\s*/, '')}</p>)}
              </div>
               <Button variant="outline" size="sm" className="mt-2" onClick={() => handleCopyToClipboard(generatedResult.effectivenessTips, "Effectiveness Tips")} suppressHydrationWarning>
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
