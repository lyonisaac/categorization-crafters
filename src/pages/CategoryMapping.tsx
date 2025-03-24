import { CategoryMapper } from '@/components/CategoryMapping/CategoryMapper';

export default function CategoryMappingPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6 font-heading">Category Mapping</h1>
      <CategoryMapper />
    </div>
  );
}
