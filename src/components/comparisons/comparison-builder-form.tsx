"use client";

import { useForm, useFieldArray, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useComparisons } from '@/hooks/use-comparisons';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation'; // for redirecting
import { Separator } from '@/components/ui/separator';
import type { Comparison, ComparisonItem, ComparisonFeature } from '@/lib/types'; // Import types
import { useState } from 'react';

const featureSchema = z.object({
  key: z.string().min(1, "Feature name is required."),
  value: z.string().min(1, "Feature value is required."),
});

const itemSchema = z.object({
  name: z.string().min(1, "Item name is required."),
  imageUrl: z.string().url({ message: "Please enter a valid URL for the image." }).optional().or(z.literal('')),
  description: z.string().optional(),
  features: z.array(featureSchema).min(1, "At least one feature is required."),
});

const comparisonFormSchema = z.object({
  title: z.string().min(3, "Comparison title must be at least 3 characters."),
  items: z.array(itemSchema).min(2, "At least two items are required for comparison."),
});

type ComparisonFormValues = z.infer<typeof comparisonFormSchema>;

export function ComparisonBuilderForm() {
  const { addComparison } = useComparisons();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ComparisonFormValues>({
    resolver: zodResolver(comparisonFormSchema),
    defaultValues: {
      title: '',
      items: [
        { name: '', imageUrl: '', description: '', features: [{ key: '', value: '' }] },
        { name: '', imageUrl: '', description: '', features: [{ key: '', value: '' }] },
      ],
    },
  });

  const { fields: itemFields, append: appendItem, remove: removeItem } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const onSubmit: SubmitHandler<ComparisonFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      // Explicitly cast data to match Omit structure for addComparison
      const newComparisonData = {
        title: data.title,
        items: data.items.map(item => ({
          name: item.name,
          imageUrl: item.imageUrl,
          description: item.description,
          features: item.features.map(feature => ({
            key: feature.key,
            value: feature.value,
          })),
        })),
      };
      const newComparison = addComparison(newComparisonData as Omit<Comparison, 'id' | 'createdAt' | 'items'> & { items: Array<Omit<ComparisonItem, 'id' | 'features'> & { features: Array<Omit<ComparisonFeature, 'id'>> }> });
      toast({
        title: "Comparison Created",
        description: `"${data.title}" has been saved.`,
      });
      router.push(`/comparisons/${newComparison.id}`);
    } catch (error) {
      console.error("Error creating comparison:", error);
      toast({
        title: "Error",
        description: "Failed to create comparison. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Create New Comparison</CardTitle>
            <CardDescription>
              Build a side-by-side comparison table. Add items and their features.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comparison Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Top Smartphones 2024" suppressHydrationWarning {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator className="my-6" />

            <div>
              <h3 className="text-lg font-medium mb-4">Comparison Items</h3>
              {itemFields.map((item, itemIndex) => (
                <Card key={item.id} className="mb-6 p-4 border bg-secondary/30">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-md font-semibold">Item #{itemIndex + 1}</h4>
                    {itemFields.length > 2 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeItem(itemIndex)}
                        suppressHydrationWarning
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Remove Item
                      </Button>
                    )}
                  </div>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name={`items.${itemIndex}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Item Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., iPhone 15 Pro" suppressHydrationWarning {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`items.${itemIndex}.imageUrl`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/image.jpg" suppressHydrationWarning {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`items.${itemIndex}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Short Description (Optional)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="A brief overview of the item." suppressHydrationWarning {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FeatureArray control={form.control} itemIndex={itemIndex} />
                  </div>
                </Card>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => appendItem({ name: '', imageUrl: '', description: '', features: [{ key: '', value: '' }] })}
                className="mt-2"
                suppressHydrationWarning
              >
                <PlusCircle className="h-4 w-4 mr-2" /> Add Another Item
              </Button>
               {form.formState.errors.items && !form.formState.errors.items.message && (
                <p className="text-sm font-medium text-destructive mt-2">
                  {form.formState.errors.items.root?.message || "Please ensure all items and features are correctly filled."}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto" suppressHydrationWarning>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Comparison...
                </>
              ) : (
                'Save Comparison'
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

// Helper component for nested feature array
function FeatureArray({ control, itemIndex }: { control: any, itemIndex: number }) {
  const { fields: featureFields, append: appendFeature, remove: removeFeature } = useFieldArray({
    control,
    name: `items.${itemIndex}.features`,
  });

  return (
    <div className="space-y-3 pl-4 border-l-2 border-primary/50">
      <h5 className="text-sm font-medium text-muted-foreground">Features:</h5>
      {featureFields.map((feature, featureIndex) => (
        <div key={feature.id} className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-end p-3 border rounded-md bg-background">
          <FormField
            control={control}
            name={`items.${itemIndex}.features.${featureIndex}.key`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-xs">Feature Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Screen Size" suppressHydrationWarning {...field} />
                </FormControl>
                <FormMessage className="text-xs"/>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`items.${itemIndex}.features.${featureIndex}.value`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-xs">Feature Value</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 6.1 inches" suppressHydrationWarning {...field} />
                </FormControl>
                <FormMessage className="text-xs"/>
              </FormItem>
            )}
          />
          {featureFields.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0 self-end sm:self-auto"
              onClick={() => removeFeature(featureIndex)}
              suppressHydrationWarning
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          )}
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => appendFeature({ key: '', value: '' })}
        className="mt-1"
        suppressHydrationWarning
      >
        <PlusCircle className="h-3 w-3 mr-1" /> Add Feature
      </Button>
       {/* TODO: Figure out how to display feature-level errors if needed */}
    </div>
  );
}
