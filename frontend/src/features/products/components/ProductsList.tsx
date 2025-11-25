'use client';
import { useProducts } from '../hooks';
import ProductCard from './ProductCard';

export default function ProductsList() {
  const { data, isLoading, error } = useProducts();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {data?.map((p) => (
        <ProductCard
          key={p.id}
          title={p.title}
          image={p.image}
          price={p.price}
        />
      ))}
    </div>
  );
}
