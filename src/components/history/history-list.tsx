
"use client";

import { useGeneratedContentHistory } from '@/hooks/use-generated-content-history';
import type { GeneratedHistoryItem, SeoHistoryItem, ContentWriterHistoryItem, ContentImporterHistoryItem } from '@/lib/history-types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Trash2, HistoryIcon, FileText, Settings2, PenSquare, FileCode2, Copy } from 'lucide-react';
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
                </div>
              </AccordionContent>
            </AccordionItem>
          </Card>
        ))}
      </Accordion>
    </div>
  );
}
