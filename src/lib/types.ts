export interface ComparisonFeature {
  id: string;
  key: string;
  value: string;
}

export interface ComparisonItem {
  id: string;
  name: string;
  imageUrl?: string;
  description?: string;
  features: ComparisonFeature[];
}

export interface Comparison {
  id: string;
  title: string;
  items: ComparisonItem[];
  createdAt: string; // ISO date string
  // Optional: Add schema.org type for structured data generation
  schemaType?: string; // e.g., "Product", "Service", "SoftwareApplication"
}
