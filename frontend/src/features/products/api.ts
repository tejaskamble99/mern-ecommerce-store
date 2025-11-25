import { apiFetch } from '@/lib/api/client';

export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
};

export async function fetchProducts(): Promise<Product[]> {
  return apiFetch<Product[]>('https://fakestoreapi.com/products');
}

export async function fetchProduct(id: number): Promise<Product> {
  return apiFetch<Product>(`https://fakestoreapi.com/products/${id}`);
}

export async function fetchProductsByCategory(category: string): Promise<Product[]> {
  return apiFetch<Product[]>(`https://fakestoreapi.com/products/category/${category}`);
}