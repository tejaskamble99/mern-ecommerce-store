import ProductsList from '@/features/products/components/ProductsList';

export default function ProductsPage() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">FakeStore Products</h1>
      <ProductsList />
    </div>
  );
}