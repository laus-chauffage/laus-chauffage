import Link from "next/link";
import { Flame, ThumbsUp, Clock, MapPin, Phone, Droplet, Droplets, Wrench, Zap, Thermometer, Wifi } from "lucide-react";



const zones = ["Rebecq", "Tubize", "Braine-le-Comte", "Soignies", "Enghien", "Braine-le-Château", "Braine-l'Alleud", "Ittre"];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-[#1e3a5f] text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f] via-[#2d5a8e] to-[#1e3a5f] opacity-90" />
        <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-36 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-block bg-[#c0392b] text-white text-xs font-semibold px-3 py-1 rounded-full mb-6 uppercase tracking-wider">
              Plus de 45 ans d'expérience
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Votre chauffagiste<br />
              <span className="text-[#c0392b]">de confiance</span><br />
              en Brabant wallon
            </h1>
            <p className="text-gray-300 text-lg mb-8 max-w-xl">
              Entretien, installation et dépannage de chaudières mazout et gaz, boilers thermodynamiques et adoucisseurs d'eau.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/reservation"
                className="bg-[#c0392b] hover:bg-[#a93226] text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors shadow-lg">
                Prendre rendez-vous
              </Link>
              <a href="tel:+32475200487"
                className="border-2 border-white hover:bg-white hover:text-[#1e3a5f] text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors">
                +32 475 20 04 87
              </a>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative w-64 h-80 md:w-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl border-4 border-[#c0392b]/30">
              <img src="/photos/sebastien.jpg" alt="Sebastien Laus" className="w-full h-full object-cover object-top" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#c0392b] text-white py-10">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { val: "45+", label: "Années d'expérience" },
            { val: "500+", label: "Clients fidèles" },
            { val: "BW & Hainaut", label: "Zone d'intervention" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-bold">{s.val}</div>
              <div className="text-sm opacity-90 mt-1">{s.label}</div>
            </div>
          ))}
          <div>
            <div className="flex justify-center"><Zap size={36} className="fill-white stroke-white" /></div>
            <div className="text-sm opacity-90 mt-1">Intervention rapide</div>
          </div>
        </div>
      </section>

      {/* Services teaser */}
      <section className="py-20 bg-gray-50" id="services">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1e3a5f] mb-4">Tout pour votre chauffage</h2>
            <p className="text-gray-500 max-w-xl mx-auto">De l'entretien annuel au remplacement complet, en passant par les solutions d'économie d'énergie.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
            {[
              { icon: <Droplet size={24} className="text-[#c0392b]" />, label: "Chaudière mazout" },
              { icon: <Flame size={24} className="text-[#c0392b]" />, label: "Chaudière gaz" },
              { icon: <Wrench size={24} className="text-[#c0392b]" />, label: "Dépannage" },
              { icon: <Wrench size={24} className="text-[#c0392b]" />, label: "Remplacement chaudière" },
              { icon: <Droplets size={24} className="text-[#c0392b]" />, label: "Adoucisseur d'eau" },
              { icon: <Zap size={24} className="text-[#c0392b]" />, label: "Boiler thermodynamique" },
              { icon: <Thermometer size={24} className="text-[#c0392b]" />, label: "Radiateurs" },
              { icon: <Wifi size={24} className="text-[#c0392b]" />, label: "Thermostat connecté" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm">
                <div className="shrink-0">{s.icon}</div>
                <span className="text-sm font-medium text-[#1e3a5f]">{s.label}</span>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/services" className="inline-block bg-[#c0392b] hover:bg-[#a93226] text-white px-10 py-4 rounded-xl font-semibold text-lg transition-colors">
              Voir tous nos services
            </Link>
          </div>
        </div>
      </section>

      {/* Pourquoi nous choisir */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-[#1e3a5f] mb-4">Pourquoi nous choisir ?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <ThumbsUp size={28} className="text-[#c0392b]" />, title: "Expérience & fiabilité", desc: "45 ans de métier, des centaines de clients satisfaits dans la région." },
              { icon: <Clock size={28} className="text-[#c0392b]" />, title: "Rappels automatiques", desc: "On vous contacte avant l'échéance de votre entretien. Vous n'oubliez rien." },
              { icon: <MapPin size={28} className="text-[#c0392b]" />, title: "Réservation en ligne", desc: "Choisissez votre créneau 24h/24 sur notre calendrier en temps réel." },
            ].map((item) => (
              <div key={item.title} className="text-center p-6">
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="font-semibold text-[#1e3a5f] text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Zone d'intervention */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#1e3a5f] mb-4">Un chauffagiste local, proche de chez vous</h2>
          <p className="text-gray-500 mb-2 max-w-xl mx-auto">Basé à Rebecq, j'interviens rapidement en Brabant wallon et dans le Hainaut.</p>
          <p className="text-gray-400 text-sm mb-8">Rebecq · Tubize · Braine-le-Comte · Soignies · Enghien · Braine-le-Château · Braine-l'Alleud · Ittre · et environs</p>
          <a href="/reservation" className="inline-block bg-[#c0392b] hover:bg-[#a93226] text-white px-6 py-3 rounded-xl font-semibold transition-colors text-sm">
            Prendre rendez-vous
          </a>
        </div>
      </section>

      {/* Partenaires & certifications */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-8">Partenaires & certifications</p>
          <div className="flex flex-wrap items-center justify-center gap-10">
            {[
              { src: "/logos/ariston.jpg", alt: "Ariston" },
              { src: "/logos/viessmann.png", alt: "Viessmann" },
              { src: "/logos/henrad.webp", alt: "Henrad" },
              { src: "/logos/solucalc.png", alt: "SoluCalc" },
              { src: "/logos/Cerga.png", alt: "Cerga gas.be" },
              { src: "/logos/wilo.png", alt: "Wilo" },
              { src: "/logos/honeywell.png", alt: "Honeywell" },
            ].map((logo) => (
              <img key={logo.alt} src={logo.src} alt={logo.alt}
                className="h-10 object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100" />
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 bg-[#1e3a5f] text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Prêt à planifier votre entretien ?</h2>
          <p className="text-gray-300 mb-8">Réservez directement en ligne ou appelez-nous. Créneaux disponibles du lundi au vendredi.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/reservation" className="bg-[#c0392b] hover:bg-[#a93226] px-8 py-4 rounded-xl font-semibold text-lg transition-colors">
              Réserver en ligne
            </Link>
            <a href="tel:+32475200487" className="flex items-center justify-center gap-2 border-2 border-white hover:bg-white hover:text-[#1e3a5f] px-8 py-4 rounded-xl font-semibold text-lg transition-colors">
              <Phone size={20} />
              +32 475 20 04 87
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

