"use client";

import { useState, useEffect } from "react";
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
import { Service, Team as TeamType } from "@/lib/types";

// Ajuste para o tipo Service no cliente
interface ClientService extends Omit<Service, 'price'> {
  price: number;
}

export default function Home() {
  const sectionsMap = useSectionData();
  const [services, setServices] = useState<ClientService[]>([]);
  const [members, setMembers] = useState<TeamType[]>([]);

  useEffect(() => {
    if (!sectionsMap) return;

    const fetchData = async () => {
      if (sectionsMap.services) {
        try {
          const res = await fetch("/api/services");
          const data = await res.json();
          setServices(data);
        } catch (error) {
          console.error("Failed to fetch services:", error);
        }
      }
      if (sectionsMap.team) {
        try {
          const res = await fetch("/api/team");
          const data = await res.json();
          setMembers(data);
        } catch (error) {
          console.error("Failed to fetch team members:", error);
        }
      }
    };

    fetchData();
  }, [sectionsMap]);

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
        <Team members={members} isVisible={sectionsMap.team} />
      </section>
      <section id="service">
        <Services services={services} isVisible={sectionsMap.services} />
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
