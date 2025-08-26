import { ProductGrid } from "@/components/site/Shop/ProductGrid";
import TeamGrid from "@/components/site/Team/TeamGrid";
import { PromotionGrid } from "@/components/site/Promotions/PromotionGrid";
import { Hero } from "@/components/site/Hero/Hero";
import { Header } from "@/components/site/Header/Header";
import { GalleryGrid } from "@/components/site/Gallery/GalleryGrid";
import { ServiceGrid } from "@/components/site/Services/ServiceGrid";
import { Contact } from "@/components/site/Contact/Contact";
import { Footer } from "@/components/site/Footer/Footer";
import { About } from "@/components/site/About/About";

export default function Home() {
  return (
    <main>
      <section id="home">
        <Header />
      </section>
      <Hero />
      {/* <section id="promotions">
        <PromotionGrid
          promotions={promotions}
          isVisible={sectionsMap.promotions}
        />
      </section> */}
      <section id="about">
        <About />
      </section>
      {/* <section id="shop">
        <ProductGrid products={products} isVisible={sectionsMap.products} />
      </section>
      <section id="team">
        <TeamGrid members={members} isVisible={sectionsMap.team} />
      </section>
      <section id="service">
        <ServiceGrid services={services} isVisible={sectionsMap.services} />
      </section>
      <section id="gallery">
        <GalleryGrid images={images} isVisible={sectionsMap.gallery} />
      </section> */}
      <section id="contact">
        <Contact />
      </section>
      <Footer />
    </main>
  );
}
