"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useComparisons } from '@/hooks/use-comparisons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowRight, FilePlus2, ListChecks, Loader2, Trash2 } from 'lucide-react';
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

export function ComparisonList() {
  const { comparisons, isLoading, deleteComparison } = useComparisons();
  const { toast } = useToast();

  const handleDelete = (id: string, title: string) => {
    deleteComparison(id);
    toast({
      title: "Comparison Deleted",
      description: `"${title}" has been removed.`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (comparisons.length === 0) {
    return (
      <Card className="text-center py-12 shadow-lg">
        <CardHeader>
          <div className="mx-auto bg-secondary rounded-full p-4 w-fit">
            <ListChecks className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="mt-4 text-2xl">No Comparisons Yet</CardTitle>
          <CardDescription>
            You haven't created any comparisons. Get started by building your first one!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild size="lg">
            <Link href="/comparison-builder">
              <FilePlus2 className="mr-2 h-5 w-5" /> Create New Comparison
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {comparisons.map((comp) => (
          <Card key={comp.id} className="flex flex-col shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              {comp.items[0]?.imageUrl && (
                 <Image 
                    src={comp.items[0].imageUrl} 
                    alt={comp.items[0].name} 
                    width={400} 
                    height={200} 
                    className="w-full h-40 object-cover rounded-t-lg"
                    data-ai-hint="product tech" 
                  />
              )}
               {!comp.items[0]?.imageUrl && (
                 <div className="w-full h-40 bg-secondary rounded-t-lg flex items-center justify-center">
                   <ListChecks className="h-16 w-16 text-muted-foreground" />
                 </div>
               )}
              <CardTitle className="mt-4 text-xl">{comp.title}</CardTitle>
              <CardDescription>
                Comparing {comp.items.length} items. Created on {new Date(comp.createdAt).toLocaleDateString()}.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {comp.items.map(item => item.name).join(' vs ')}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between items-center gap-2 pt-0">
              <Button asChild variant="default" size="sm">
                <Link href={`/comparisons/${comp.id}`}>
                  View Details <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the comparison titled "{comp.title}".
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(comp.id, comp.title)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        ))}
      </div>
       <div className="mt-8 text-center">
        <Button asChild size="lg" variant="outline">
          <Link href="/comparison-builder">
            <FilePlus2 className="mr-2 h-5 w-5" /> Create Another Comparison
          </Link>
        </Button>
      </div>
    </div>
  );
}
