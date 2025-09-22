"use client";

import { Products } from "@/components/site/Shop/Products";
import Team from "@/components/site/Team/Team";
import { Promotions } from "@/components/site/Promotions/Promotions";
import { Hero } from "@/components/site/Hero/Hero";
import { Header } from "@/components/site/Header/Header";
import Gallery from "@/components/site/Gallery/Gallery";
import { Services } from "@/components/site/Services/Services";
import { Contact } from "@/components/site/Contact/Contact";
import { Footer } from "@/components/site/Footer/Footer";
import { About } from "@/components/site/About/About";
import { useSectionData } from "@/components/SectionDataProvider";
import { useEffect, useState } from "react";
import { Product } from "@/lib/types";

export default function Home() {
  const sectionsMap = useSectionData();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const data = await response.json();
          const formattedProducts = data.map((product: any) => ({
            ...product,
            price: Number(product.price),
          }));
          setProducts(formattedProducts);
        } else {
          console.error("Failed to fetch products");
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main>
      <section id="home">
        <Header />
      </section>
      <Hero />
      <section id="promotions">
        <Promotions isVisible={sectionsMap.promotions} />
      </section>
      <section id="about">
        <About />
      </section>
      <section id="shop">
        <Products products={products} isVisible={sectionsMap.products} />
      </section>
      <section id="team">
        <Team isVisible={sectionsMap.team} />
      </section>
      <section id="services">
        <Services isVisible={sectionsMap.services} />
      </section>
      <section id="gallery">
        <Gallery images={[]} isVisible={sectionsMap.gallery} />
      </section>
      <section id="contact">
        <Contact />
      </section>
      <Footer />
    </main>
  );
}
