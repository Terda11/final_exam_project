import { Suspense } from "react";
import type { Metadata } from "next";

import HeroSection              from "@/components/home/HeroSection";
import StatsSection             from "@/components/home/StatsSection";
import CategoryBar              from "@/components/home/CategoryBar";
import NewArrivals              from "@/components/home/NewArrivals";
import FeaturedProducts         from "@/components/home/FeaturedProducts";
import FeaturedProductsSkeleton from "@/components/home/FeaturedProductsSkeleton";
import PromoBanner              from "@/components/home/PromoBanner";
import WhyUsSection             from "@/components/home/WhyUsSection";

export const metadata: Metadata = {
  title: "Home — TechShop",
  description:
    "Shop the latest smartphones, laptops, audio gear, gaming consoles, and accessories. Genuine products, fast delivery, and 2-year warranty on everything.",
  openGraph: {
    title:       "TechShop — Premium Electronics",
    description: "Your destination for the latest electronics at the best prices.",
    type:        "website",
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <CategoryBar />
      <NewArrivals />
      <Suspense fallback={<FeaturedProductsSkeleton />}>
        <FeaturedProducts />
      </Suspense>
      <PromoBanner />
      <WhyUsSection />
    </>
  );
}
