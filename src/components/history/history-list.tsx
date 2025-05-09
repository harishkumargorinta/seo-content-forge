
"use client";

import { useGeneratedContentHistory } from '@/hooks/use-generated-content-history';
import type { GeneratedHistoryItem, SeoHistoryItem, ContentWriterHistoryItem, ContentImporterHistoryItem, SeoBlogPackageHistoryItem, YouTubeTitleGeneratorHistoryItem, YouTubeDescriptionTagsHistoryItem, FacebookTitleGeneratorHistoryItem, FacebookDescriptionTagsHistoryItem } from '@/lib/history-types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Trash2, HistoryIcon, FileText, Settings2, PenSquare, FileCode2, Copy, BarChart, Tags as TagsIcon, PackageCheck, ListOrdered, Youtube, Lightbulb, Facebook, MessageSquarePlus, Hash, Info } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

function getIconForType(type: GeneratedHistoryItem['type']) {
  switch (type) {
    case 'SEO_OPTIMIZATION':
      return <Settings2 className="h-5 w-5 mr-2 text-primary" />;
    case 'CONTENT_WRITING':
      return <PenSquare className="h-5 w-5 mr-2 text-primary" />;
    case 'CONTENT_IMPORT_REWRITE':
      return <FileCode2 className="h-5 w-5 mr-2 text-primary" />;
    case 'SEO_BLOG_PACKAGE':
      return <PackageCheck className="h-5 w-5 mr-2 text-primary" />;
    case 'YOUTUBE_TITLE_GENERATION':
      return <Youtube className="h-5 w-5 mr-2 text-red-500" />;
    case 'YOUTUBE_DESCRIPTION_TAGS':
      return <TagsIcon className="h-5 w-5 mr-2 text-red-600" />;
    case 'FACEBOOK_TITLE_GENERATION':
      return <Facebook className="h-5 w-5 mr-2 text-blue-600" />;
    case 'FACEBOOK_DESCRIPTION_TAGS':
      return <MessageSquarePlus className="h-5 w-5 mr-2 text-blue-700" />;
    default:
      return <FileText className="h-5 w-5 mr-2 text-primary" />;
  }
}

function getTypeName(type: GeneratedHistoryItem['type']) {
  switch (type) {
    case 'SEO_OPTIMIZATION':
      return "SEO Optimization";
    case 'CONTENT_WRITING':
      return "Content Writing";
    case 'CONTENT_IMPORT_REWRITE':
      return "Content Import & Rewrite";
    case 'SEO_BLOG_PACKAGE':
      return "SEO Blog Package";
    case 'YOUTUBE_TITLE_GENERATION':
      return "YouTube Title Generation";
    case 'YOUTUBE_DESCRIPTION_TAGS':
      return "YouTube Description & Tags";
    case 'FACEBOOK_TITLE_GENERATION':
      return "Facebook Title Generation";
    case 'FACEBOOK_DESCRIPTION_TAGS':
      return "Facebook Description & Hashtags";
    default:
      return "Generated Content";
  }
}

export function HistoryList() {
  const { history, isLoading, deleteHistoryItem, clearHistory } = useGeneratedContentHistory();
  const { toast } = useToast();

  const handleDelete = (id: string, title: string) => {
    deleteHistoryItem(id);
    toast({
      title: "History Item Deleted",
      description: `"${title}" has been removed from history.`,
    });
  };

  const handleClearHistory = () => {
    clearHistory();
    toast({
      title: "History Cleared",
      description: "All generated content history has been removed.",
    });
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


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <Card className="text-center py-12 shadow-lg">
        <CardHeader>
          <div className="mx-auto bg-secondary rounded-full p-4 w-fit">
            <HistoryIcon className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="mt-4 text-2xl">No History Yet</CardTitle>
          <CardDescription>
            Your generated content will appear here once you use the tools.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" /> Clear All History
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete all
                your generated content history.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleClearHistory}>
                Yes, clear history
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Accordion type="multiple" className="w-full space-y-4">
        {history.map((item) => (
          <Card key={item.id} className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <AccordionItem value={item.id} className="border-b-0">
              <AccordionTrigger className="p-4 hover:no-underline">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full">
                    <div className="flex items-center">
                        {getIconForType(item.type)}
                        <div className="text-left">
                            <CardTitle className="text-lg">{item.primaryIdentifier}</CardTitle>
                            <CardDescription className="text-xs">
                                {getTypeName(item.type)} - Generated {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                            </CardDescription>
                        </div>
                    </div>
                     <AlertDialog>
                        <AlertDialogTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="mt-2 md:mt-0 text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the history item: "{item.primaryIdentifier}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(item.id, item.primaryIdentifier)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 pt-0">
                <div className="space-y-3 text-sm text-muted-foreground">
                  {item.type === 'SEO_OPTIMIZATION' && (
                    <>
                      <p><strong>Focus Keyword:</strong> {(item as SeoHistoryItem).input.focusKeyword || 'N/A'}</p>
                      <p><strong>Optimized Title:</strong> {(item as SeoHistoryItem).output.title}</p>
                      <p><strong>Meta Description:</strong> {(item as SeoHistoryItem).output.metaDescription}</p>
                      <p><strong>Keywords:</strong> {(item as SeoHistoryItem).output.keywords}</p>
                      <Button size="sm" variant="outline" onClick={() => handleCopyToClipboard(JSON.stringify((item as SeoHistoryItem).output, null, 2), "SEO Output")}>
                        <Copy className="mr-2 h-3 w-3" /> Copy Output
                      </Button>
                    </>
                  )}
                  {item.type === 'CONTENT_WRITING' && (
                    <>
                      <p><strong>Topic:</strong> {(item as ContentWriterHistoryItem).input.topic}</p>
                      <p><strong>Generated Title:</strong> {(item as ContentWriterHistoryItem).output.title}</p>
                      <p><strong>Suggested Keywords:</strong> {(item as ContentWriterHistoryItem).output.suggestedKeywords}</p>
                      <p><strong>SEO Score:</strong> {(item as ContentWriterHistoryItem).output.seoScore}</p>
                      <div className="max-h-60 overflow-y-auto p-2 border rounded-md bg-background">
                        <h4 className="font-semibold text-foreground mb-1">Content Body (Markdown):</h4>
                        <pre className="whitespace-pre-wrap text-xs">{(item as ContentWriterHistoryItem).output.contentBody}</pre>
                      </div>
                       <Button size="sm" variant="outline" onClick={() => handleCopyToClipboard((item as ContentWriterHistoryItem).output.contentBody, "Content Body")}>
                        <Copy className="mr-2 h-3 w-3" /> Copy Content Body
                      </Button>
                       <Button size="sm" variant="outline" onClick={() => handleCopyToClipboard(JSON.stringify((item as ContentWriterHistoryItem).output, null, 2), "Full Output")}>
                        <Copy className="mr-2 h-3 w-3" /> Copy Full Output
                      </Button>
                    </>
                  )}
                  {item.type === 'CONTENT_IMPORT_REWRITE' && (
                    <>
                      <p><strong>Original URL:</strong> <a href={(item as ContentImporterHistoryItem).input.articleUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">{(item as ContentImporterHistoryItem).input.articleUrl}</a></p>
                      <p><strong>Rewritten Title:</strong> {(item as ContentImporterHistoryItem).output.rewrittenTitle}</p>
                      <p><strong>Suggested Keywords:</strong> {(item as ContentImporterHistoryItem).output.suggestedKeywords}</p>
                      <p><strong>SEO Score:</strong> {(item as ContentImporterHistoryItem).output.seoScore}</p>
                       {(item as ContentImporterHistoryItem).output.detectedError && <p className="text-destructive"><strong>Error:</strong> {(item as ContentImporterHistoryItem).output.detectedError}</p>}
                      <div className="max-h-60 overflow-y-auto p-2 border rounded-md bg-background">
                        <h4 className="font-semibold text-foreground mb-1">Rewritten Content (Markdown):</h4>
                        <pre className="whitespace-pre-wrap text-xs">{(item as ContentImporterHistoryItem).output.rewrittenContentBody}</pre>
                      </div>
                       <Button size="sm" variant="outline" onClick={() => handleCopyToClipboard((item as ContentImporterHistoryItem).output.rewrittenContentBody, "Rewritten Content")}>
                        <Copy className="mr-2 h-3 w-3" /> Copy Rewritten Content
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleCopyToClipboard(JSON.stringify((item as ContentImporterHistoryItem).output, null, 2), "Full Output")}>
                        <Copy className="mr-2 h-3 w-3" /> Copy Full Output
                      </Button>
                    </>
                  )}
                  {item.type === 'SEO_BLOG_PACKAGE' && (
                    <>
                      <p><strong>Topic:</strong> {(item as SeoBlogPackageHistoryItem).input.topic}</p>
                      <p><strong>Generated Title:</strong> {(item as SeoBlogPackageHistoryItem).output.title}</p>
                      <p><strong>Suggested Keywords:</strong> {(item as SeoBlogPackageHistoryItem).output.suggestedKeywords}</p>
                      <p><strong>SEO Score:</strong> <BarChart className="inline h-4 w-4 mr-1 align-text-bottom" /> {(item as SeoBlogPackageHistoryItem).output.seoScore}</p>
                      
                      <div className="mt-2">
                        <h4 className="font-semibold text-foreground mb-1 flex items-center"><ListOrdered className="h-4 w-4 mr-1"/>Outline (Markdown):</h4>
                        <div className="max-h-40 overflow-y-auto p-2 border rounded-md bg-background">
                          <pre className="whitespace-pre-wrap text-xs">{(item as SeoBlogPackageHistoryItem).output.outline}</pre>
                        </div>
                        <Button size="xs" variant="outline" className="mt-1" onClick={() => handleCopyToClipboard((item as SeoBlogPackageHistoryItem).output.outline, "Outline")}>
                          <Copy className="mr-1 h-3 w-3" /> Copy Outline
                        </Button>
                      </div>

                      <div className="mt-2">
                        <h4 className="font-semibold text-foreground mb-1">Content Body (Markdown):</h4>
                        <div className="max-h-60 overflow-y-auto p-2 border rounded-md bg-background">
                          <pre className="whitespace-pre-wrap text-xs">{(item as SeoBlogPackageHistoryItem).output.contentBody}</pre>
                        </div>
                        <Button size="xs" variant="outline" className="mt-1" onClick={() => handleCopyToClipboard((item as SeoBlogPackageHistoryItem).output.contentBody, "Content Body")}>
                          <Copy className="mr-1 h-3 w-3" /> Copy Content Body
                        </Button>
                      </div>
                      <Button size="sm" variant="outline" className="mt-2" onClick={() => handleCopyToClipboard(JSON.stringify((item as SeoBlogPackageHistoryItem).output, null, 2), "Full Package Output")}>
                        <Copy className="mr-2 h-3 w-3" /> Copy Full Package
                      </Button>
                    </>
                  )}
                   {item.type === 'YOUTUBE_TITLE_GENERATION' && (
                    <>
                      <p><strong>Video Topic:</strong> {(item as YouTubeTitleGeneratorHistoryItem).input.videoTopic}</p>
                      {(item as YouTubeTitleGeneratorHistoryItem).input.keywords && <p><strong>Keywords:</strong> {(item as YouTubeTitleGeneratorHistoryItem).input.keywords}</p>}
                      <div className="mt-2">
                        <h4 className="font-semibold text-foreground mb-1 flex items-center"><Lightbulb className="h-4 w-4 mr-1"/>Suggested Titles:</h4>
                        <div className="max-h-60 overflow-y-auto p-2 border rounded-md bg-background space-y-2">
                          {(item as YouTubeTitleGeneratorHistoryItem).output.suggestedTitles.map((titleItem, idx) => (
                            <div key={idx} className="p-1 border-b border-border/50 last:border-b-0">
                              <p className="font-medium text-foreground">{titleItem.title}</p>
                              <p className="text-xs text-muted-foreground/80"><em>Reasoning:</em> {titleItem.reasoning}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                       <div className="mt-2">
                        <h4 className="font-semibold text-foreground mb-1">General Tips:</h4>
                        <div className="max-h-40 overflow-y-auto p-2 border rounded-md bg-background">
                            <pre className="whitespace-pre-wrap text-xs">{(item as YouTubeTitleGeneratorHistoryItem).output.generalTips}</pre>
                        </div>
                        <Button size="xs" variant="outline" className="mt-1" onClick={() => handleCopyToClipboard((item as YouTubeTitleGeneratorHistoryItem).output.generalTips, "General Tips")}>
                          <Copy className="mr-1 h-3 w-3" /> Copy Tips
                        </Button>
                      </div>
                      <Button size="sm" variant="outline" className="mt-2" onClick={() => handleCopyToClipboard(JSON.stringify((item as YouTubeTitleGeneratorHistoryItem).output, null, 2), "Full Titles Output")}>
                        <Copy className="mr-2 h-3 w-3" /> Copy Full Output
                      </Button>
                    </>
                  )}
                  {item.type === 'YOUTUBE_DESCRIPTION_TAGS' && (
                    <>
                      <p><strong>Video Content Snippet:</strong> {(item as YouTubeDescriptionTagsHistoryItem).input.videoContent.substring(0, 100)}...</p>
                      {(item as YouTubeDescriptionTagsHistoryItem).input.focusKeywords && <p><strong>Focus Keywords:</strong> {(item as YouTubeDescriptionTagsHistoryItem).input.focusKeywords}</p>}
                      <div className="mt-2">
                        <h4 className="font-semibold text-foreground mb-1">Generated Description:</h4>
                        <div className="max-h-60 overflow-y-auto p-2 border rounded-md bg-background">
                          <pre className="whitespace-pre-wrap text-xs">{(item as YouTubeDescriptionTagsHistoryItem).output.videoDescription}</pre>
                        </div>
                         <Button size="xs" variant="outline" className="mt-1" onClick={() => handleCopyToClipboard((item as YouTubeDescriptionTagsHistoryItem).output.videoDescription, "Video Description")}>
                          <Copy className="mr-1 h-3 w-3" /> Copy Description
                        </Button>
                      </div>
                       <div className="mt-2">
                        <h4 className="font-semibold text-foreground mb-1">Generated Tags:</h4>
                         <p className="p-2 border rounded-md bg-background text-xs">{(item as YouTubeDescriptionTagsHistoryItem).output.videoTags}</p>
                        <Button size="xs" variant="outline" className="mt-1" onClick={() => handleCopyToClipboard((item as YouTubeDescriptionTagsHistoryItem).output.videoTags, "Video Tags")}>
                          <Copy className="mr-1 h-3 w-3" /> Copy Tags
                        </Button>
                      </div>
                      <Button size="sm" variant="outline" className="mt-2" onClick={() => handleCopyToClipboard(JSON.stringify((item as YouTubeDescriptionTagsHistoryItem).output, null, 2), "Full Description & Tags Output")}>
                        <Copy className="mr-2 h-3 w-3" /> Copy Full Output
                      </Button>
                    </>
                  )}
                   {item.type === 'FACEBOOK_TITLE_GENERATION' && (
                    <>
                      <p><strong>Post Content/Idea:</strong> {(item as FacebookTitleGeneratorHistoryItem).input.postContent.substring(0,100)}...</p>
                      {(item as FacebookTitleGeneratorHistoryItem).input.keywords && <p><strong>Keywords:</strong> {(item as FacebookTitleGeneratorHistoryItem).input.keywords}</p>}
                      <div className="mt-2">
                        <h4 className="font-semibold text-foreground mb-1 flex items-center"><Lightbulb className="h-4 w-4 mr-1"/>Suggested Titles:</h4>
                        <div className="max-h-60 overflow-y-auto p-2 border rounded-md bg-background space-y-2">
                          {(item as FacebookTitleGeneratorHistoryItem).output.suggestedTitles.map((titleItem, idx) => (
                            <div key={idx} className="p-1 border-b border-border/50 last:border-b-0">
                              <p className="font-medium text-foreground">{titleItem.title}</p>
                              <p className="text-xs text-muted-foreground/80"><em>Reasoning:</em> {titleItem.reasoning}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                       <div className="mt-2">
                        <h4 className="font-semibold text-foreground mb-1">General Tips:</h4>
                        <div className="max-h-40 overflow-y-auto p-2 border rounded-md bg-background">
                            <pre className="whitespace-pre-wrap text-xs">{(item as FacebookTitleGeneratorHistoryItem).output.generalTips}</pre>
                        </div>
                        <Button size="xs" variant="outline" className="mt-1" onClick={() => handleCopyToClipboard((item as FacebookTitleGeneratorHistoryItem).output.generalTips, "General Tips for Facebook")}>
                          <Copy className="mr-1 h-3 w-3" /> Copy Tips
                        </Button>
                      </div>
                      <Button size="sm" variant="outline" className="mt-2" onClick={() => handleCopyToClipboard(JSON.stringify((item as FacebookTitleGeneratorHistoryItem).output, null, 2), "Full Facebook Titles Output")}>
                        <Copy className="mr-2 h-3 w-3" /> Copy Full Output
                      </Button>
                    </>
                  )}
                  {item.type === 'FACEBOOK_DESCRIPTION_TAGS' && (
                    <>
                      <p><strong>Post Content Snippet:</strong> {(item as FacebookDescriptionTagsHistoryItem).input.postContent.substring(0, 100)}...</p>
                      {(item as FacebookDescriptionTagsHistoryItem).input.keywords && <p><strong>Keywords:</strong> {(item as FacebookDescriptionTagsHistoryItem).input.keywords}</p>}
                      <div className="mt-2">
                        <h4 className="font-semibold text-foreground mb-1 flex items-center"><MessageSquarePlus className="h-4 w-4 mr-1"/>Generated Description:</h4>
                        <div className="max-h-60 overflow-y-auto p-2 border rounded-md bg-background">
                          <pre className="whitespace-pre-wrap text-xs">{(item as FacebookDescriptionTagsHistoryItem).output.postDescription}</pre>
                        </div>
                         <Button size="xs" variant="outline" className="mt-1" onClick={() => handleCopyToClipboard((item as FacebookDescriptionTagsHistoryItem).output.postDescription, "Facebook Post Description")}>
                          <Copy className="mr-1 h-3 w-3" /> Copy Description
                        </Button>
                      </div>
                       <div className="mt-2">
                        <h4 className="font-semibold text-foreground mb-1 flex items-center"><Hash className="h-4 w-4 mr-1"/>Suggested Hashtags:</h4>
                         <p className="p-2 border rounded-md bg-background text-xs">{(item as FacebookDescriptionTagsHistoryItem).output.suggestedHashtags}</p>
                        <Button size="xs" variant="outline" className="mt-1" onClick={() => handleCopyToClipboard((item as FacebookDescriptionTagsHistoryItem).output.suggestedHashtags, "Facebook Hashtags")}>
                          <Copy className="mr-1 h-3 w-3" /> Copy Hashtags
                        </Button>
                      </div>
                      <div className="mt-2">
                        <h4 className="font-semibold text-foreground mb-1 flex items-center"><Info className="h-4 w-4 mr-1"/>Effectiveness Tips:</h4>
                        <div className="max-h-40 overflow-y-auto p-2 border rounded-md bg-background">
                            <pre className="whitespace-pre-wrap text-xs">{(item as FacebookDescriptionTagsHistoryItem).output.effectivenessTips}</pre>
                        </div>
                        <Button size="xs" variant="outline" className="mt-1" onClick={() => handleCopyToClipboard((item as FacebookDescriptionTagsHistoryItem).output.effectivenessTips, "Effectiveness Tips")}>
                          <Copy className="mr-1 h-3 w-3" /> Copy Tips
                        </Button>
                      </div>
                      <Button size="sm" variant="outline" className="mt-2" onClick={() => handleCopyToClipboard(JSON.stringify((item as FacebookDescriptionTagsHistoryItem).output, null, 2), "Full Facebook Desc/Tags Output")}>
                        <Copy className="mr-2 h-3 w-3" /> Copy Full Output
                      </Button>
                    </>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Card>
        ))}
      </Accordion>
    </div>
  );
}
