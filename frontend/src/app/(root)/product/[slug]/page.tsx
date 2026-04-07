import ProductPage from "@/components/layout/product/ProductPage";
import { server } from "@/redux/store";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getProduct(slug: string) {
  const res = await fetch(`${server}/api/v1/product/slug/${slug}`, {
    cache: "no-store",
  });

  return res.json();
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;

  try {
    const data = await getProduct(slug);
    const product = data?.product;

    if (!product) {
      return {
        title: "Product Not Found | Barwa",
      };
    }

    return {
      title: `${product.name} | Buy Online at Best Price`,
      description: product.description?.slice(0, 160),

      openGraph: {
        title: product.name,
        description: product.description,
        images: [
          {
            url: `${server}/${product.photo}`,
            width: 1200,
            height: 630,
          },
        ],
      },
    };
  } catch {
    return {
      title: "Product | Barwa",
    };
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params;

  return <ProductPage slug={slug} />;
}