"use client";

import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { Services } from "@/components/Services";
import { Benefits } from "@/components/Benefits";
import { About } from "@/components/About";
import { Cta } from "@/components/Cta";

export default function Home() {
  return (
    <main>
      <section id="hero">
        <Hero />
      </section>

      <section id="stats">
        <Stats />
      </section>

      <section id="services-overview">
        <Services />
      </section>

      <section id="about" className="py-14 lg:py-16">
        <About />
      </section>

      <section id="contact" className="py-14 lg:py-16">
        <Cta />
      </section>
    </main>
  );
}
