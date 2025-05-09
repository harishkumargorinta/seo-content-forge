import { ComparisonView } from '@/components/comparisons/comparison-view';

export default function SingleComparisonPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <ComparisonView comparisonId={params.id} />
    </div>
  );
}
