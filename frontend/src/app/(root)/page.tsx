import { server } from "@/redux/store";
import Home from "./../../components/layout/Home";

export async function generateMetadata() {
  try {
    const res = await fetch(
      `${server}/api/v1/seo/home`,
      {
        cache: "no-store",
      }
    );

    const data = await res.json();
    const seo = data?.seo || {};

    const title = seo.title || "Barwa | Mobile Accessories Store";
    const description =
      seo.description ||
      "Buy premium mobile accessories online from Barwa.";
    const keywords = seo.keywords || [
      "mobile accessories",
      "charger",
      "tws",
      "powerbank",
    ];

    return {
      title,
      description,
      keywords,

      openGraph: {
        title,
        description,
        url: "https://barwa.in",
        siteName: "Barwa",
        images: [
          {
            url: "/logo.png",
            width: 1200,
            height: 630,
            alt: "Barwa Mobile Accessories",
          },
        ],
        type: "website",
      },

      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ["/logo.png"],
      },

      alternates: {
        canonical: "https://barwa.in",
      },
    };
  } catch {
    return {
      title: "Barwa | Mobile Accessories Store",
      description: "Buy premium mobile accessories online from Barwa.",
    };
  }
}

export default function Page() {
  return <Home />;
}