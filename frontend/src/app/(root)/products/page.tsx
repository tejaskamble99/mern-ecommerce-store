import Productcard from '@/components/layout/Productcard';

export default function ProductsPage() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">FakeStore Products</h1>
      <Productcard />
    </div>
  );
}