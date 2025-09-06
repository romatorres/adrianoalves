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
      {/* <section id="promotions">
        <Promotions
          promotions={promotions}
          isVisible={sectionsMap.promotions}
        />
      </section> */}
      <section id="about">
        <About />
      </section>
      {/*
      <section id="shop">
        <Products products={products} isVisible={sectionsMap.products} />
      </section> */}
      <section id="team">
        <Team isVisible={sectionsMap.team} />
      </section>
      <section id="service">
        <Services isVisible={sectionsMap.services} />
      </section>
      {/* <section id="gallery">
        <Gallery images={images} isVisible={sectionsMap.gallery} />
      </section>  */}
      <section id="contact">
        <Contact />
      </section>
      <Footer />
    </main>
  );
}
