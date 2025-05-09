"use client";

import { useEffect, useState } from 'react';
import { useComparisons } from '@/hooks/use-comparisons';
import type { Comparison, ComparisonItem } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Edit, Loader2, AlertTriangle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ComparisonViewProps {
  comparisonId: string;
}

export function ComparisonView({ comparisonId }: ComparisonViewProps) {
  const { getComparisonById, isLoading: comparisonsLoading } = useComparisons();
  const [comparison, setComparison] = useState<Comparison | null | undefined>(undefined); // undefined for loading, null for not found

  useEffect(() => {
    if (!comparisonsLoading) {
      const fetchedComparison = getComparisonById(comparisonId);
      setComparison(fetchedComparison || null);
    }
  }, [comparisonId, getComparisonById, comparisonsLoading]);

  if (comparisonsLoading || comparison === undefined) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (comparison === null) {
    return (
      <Card className="text-center py-12 shadow-lg">
        <CardHeader>
          <div className="mx-auto bg-destructive/10 rounded-full p-4 w-fit">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="mt-4 text-2xl">Comparison Not Found</CardTitle>
          <CardDescription>
            The comparison you are looking for does not exist or may have been deleted.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/comparisons">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Comparisons
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Collect all unique feature keys across all items for table headers
  const allFeatureKeys = Array.from(
    new Set(comparison.items.flatMap(item => item.features.map(feature => feature.key)))
  );

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-3xl font-bold tracking-tight">{comparison.title}</CardTitle>
              <CardDescription>
                Detailed comparison of {comparison.items.length} items. Created on {new Date(comparison.createdAt).toLocaleDateString()}.
              </CardDescription>
            </div>
            <Button asChild variant="outline">
              <Link href="/comparisons">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px] sticky left-0 bg-background z-10 shadow-sm">Item</TableHead>
                  {allFeatureKeys.map(key => (
                    <TableHead key={key} className="min-w-[150px] whitespace-nowrap">{key}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparison.items.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium sticky left-0 bg-background z-10 shadow-sm">
                      <div className="flex flex-col items-start space-y-2">
                        {item.imageUrl && (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            width={150}
                            height={100}
                            className="rounded-md object-cover h-24 w-full"
                            data-ai-hint="product item"
                          />
                        )}
                        <span className="font-semibold text-base">{item.name}</span>
                        {item.description && <p className="text-xs text-muted-foreground line-clamp-3">{item.description}</p>}
                      </div>
                    </TableCell>
                    {allFeatureKeys.map(key => {
                      const feature = item.features.find(f => f.key === key);
                      return (
                        <TableCell key={`${item.id}-${key}`} className="whitespace-normal align-top">
                          {feature ? feature.value : 'N/A'}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {comparison.items.map((item, index) => (
        <Card key={item.id} className="shadow-md md:hidden"> {/* Mobile/stacked view */}
          <CardHeader>
            <div className="flex items-center space-x-3">
              {item.imageUrl && (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="rounded-md object-cover h-20 w-20"
                  data-ai-hint="product item"
                />
              )}
              <div>
                <CardTitle>{item.name}</CardTitle>
                {item.description && <CardDescription className="mt-1 text-xs line-clamp-2">{item.description}</CardDescription>}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <h4 className="font-semibold mb-2 text-sm">Features:</h4>
            <ul className="space-y-1 text-sm">
              {item.features.map(feature => (
                <li key={feature.id} className="flex justify-between">
                  <span className="text-muted-foreground">{feature.key}:</span>
                  <span>{feature.value}</span>
                </li>
              ))}
            </ul>
          </CardContent>
           {index < comparison.items.length -1 && <Separator className="my-4"/>}
        </Card>
      ))}

      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product", // Or "ItemList" for a list of compared items
            "name": comparison.title,
            "description": `Comparison of ${comparison.items.map(i => i.name).join(', ')}`,
            // Potentially map items to itemOffered or similar properties
            // This is a simplified example; a more detailed schema might be needed
            "subjectOf": comparison.items.map(item => ({
              "@type": item.schemaType || "Product", // Use schemaType from data or default to Product
              "name": item.name,
              "description": item.description,
              "image": item.imageUrl,
              "additionalProperty": item.features.map(f => ({
                "@type": "PropertyValue",
                "name": f.key,
                "value": f.value
              }))
            }))
          })
        }}
      />
    </div>
  );
}
