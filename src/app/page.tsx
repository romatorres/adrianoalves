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
import { prisma } from "@/lib/prisma";
import { SectionDataProvider } from "@/components/SectionDataProvider";

export default async function Home() {
  return (
    <SectionDataProvider>
      {async (sectionsMap) => {
        // sectionsMap is passed from SectionDataProvider
        const servicesFromDb = sectionsMap.services
          ? await prisma.service.findMany({
              where: { active: true },
              orderBy: { name: "asc" },
            })
          : [];

        const services = servicesFromDb.map((service) => ({
          ...service,
          price: service.price.toNumber(),
        }));

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
            </section>
            <section id="team">
              <Team members={members} isVisible={sectionsMap.team} />
            </section> */}
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
      }}
    </SectionDataProvider>
  );
}
