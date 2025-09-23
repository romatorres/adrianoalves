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

export default function Home() {
  const sectionsMap = useSectionData();

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
      <section id="products">
        <Products isVisible={sectionsMap.products} />
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
