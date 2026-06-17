import Link from "next/link";
import { CheckCircle, Zap, Thermometer, Wind, Wifi, ArrowLeft, Euro } from "lucide-react";

const modeles = [
  {
    nom: "Nuos Plus S2 WiFi",
    type: "Intégré",
    image: "/boiler/nuos-s2-fixed.jpg",
    capacites: ["200 L", "250 L"],
    cop: "3,5",
    desc: "Unité tout-en-un compacte. La pompe à chaleur est intégrée au ballon — idéal si vous avez un local technique ou une cave suffisamment grande.",
    avantages: ["Installation simple, un seul appareil", "WiFi intégré de série", "Idéal pour local > 10 m³"],
  },
  {
    nom: "Nuos Split",
    type: "Split",
    image: "/boiler/nuos-split-fixed.jpg",
    capacites: ["200 L", "250 L"],
    cop: "3,5",
    desc: "La pompe à chaleur est séparée du ballon (comme une climatisation). Parfait si votre local technique est petit ou non chauffé.",
    avantages: ["Ballon placé n'importe où", "Unité extérieure ou en façade", "Moins de contraintes d'espace"],
  },
];

const modes = [
  { mode: "Automatique", desc: "Le système choisit en permanence le mode le plus économique selon la température ambiante.", color: "bg-green-100 text-green-700" },
  { mode: "Pompe à chaleur", desc: "Uniquement sur la pompe à chaleur — consommation minimale, idéal au quotidien.", color: "bg-blue-100 text-blue-700" },
  { mode: "Booster", desc: "Pompe à chaleur + résistance électrique combinées pour une recharge rapide.", color: "bg-orange-100 text-orange-700" },
  { mode: "Électrique", desc: "Résistance seule — utile pour profiter d'un tarif nuit ou en cas d'urgence.", color: "bg-gray-100 text-gray-600" },
];

const faq = [
  {
    q: "Quelle taille choisir : 200 ou 250 litres ?",
    r: "200 L convient à 2–4 personnes. 250 L est recommandé pour 4–5 personnes ou si vous consommez beaucoup d'eau chaude. En cas de doute, le 250 L est plus confortable.",
  },
  {
    q: "Combien d'espace faut-il pour le modèle intégré ?",
    r: "Le local doit faire au moins 10 à 15 m³ pour que la pompe à chaleur puisse extraire suffisamment de calories de l'air ambiant. En dessous, on privilégie le modèle split.",
  },
  {
    q: "Est-ce compatible avec des panneaux solaires ?",
    r: "Oui. Le Nuos Plus S2 peut être programmé pour se recharger en priorité quand votre production solaire est excédentaire, ce qui maximise encore les économies.",
  },
  {
    q: "Quel entretien est nécessaire ?",
    r: "Un nettoyage du filtre à air tous les 3 à 6 mois suffit. L'appareil n'a pas de pièces d'usure importantes — c'est une technologie très fiable sur le long terme.",
  },
];

export default function BoilerThermodynamiquePage() {
  return (
    <>
      {/* Header */}
      <section className="bg-[#1e3a5f] text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <Link href="/services" className="inline-flex items-center gap-2 text-gray-300 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft size={16} /> Retour aux services
          </Link>
          <div className="inline-block bg-[#c0392b] text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
            Partenaire Ariston
          </div>
          <h1 className="text-4xl font-bold mb-4">Boiler thermodynamique</h1>
          <p className="text-gray-300 max-w-xl text-lg">
            Jusqu'à 70 % d'économies sur votre eau chaude sanitaire — sans compromis sur le confort.
          </p>
        </div>
      </section>

      {/* Chiffres clés */}
      <section className="bg-[#c0392b] text-white py-10">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { val: "3,5", label: "COP maximum" },
            { val: "70 %", label: "Économies vs électrique" },
            { val: "A+", label: "Classe énergétique" },
            { val: "2 ans", label: "Garantie constructeur" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-bold">{s.val}</div>
              <div className="text-sm opacity-90 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-2">Comment ça fonctionne ?</h2>
          <p className="text-gray-500 mb-10 max-w-2xl">
            Un boiler thermodynamique fonctionne comme un réfrigérateur à l'envers : il capte les calories présentes dans l'air ambiant et les transfère à l'eau. Pour 1 kWh d'électricité consommé, il en produit jusqu'à 3,5 — c'est ça, le COP.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { icon: <Wind size={28} className="text-[#c0392b]" />, step: "1", title: "Captage de l'air", desc: "La pompe à chaleur aspire l'air ambiant (local, garage, cave…)." },
              { icon: <Thermometer size={28} className="text-[#c0392b]" />, step: "2", title: "Extraction des calories", desc: "Un fluide frigorigène absorbe la chaleur de cet air, même par temps froid." },
              { icon: <Zap size={28} className="text-[#c0392b]" />, step: "3", title: "Compression", desc: "Le compresseur élève la température du fluide jusqu'à ~60 °C." },
              { icon: <Euro size={28} className="text-[#c0392b]" />, step: "4", title: "Économies", desc: "L'eau est chauffée à moindre coût — facture divisée par 3 à 4." },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
                <div className="flex justify-center mb-3">{item.icon}</div>
                <div className="text-xs font-bold text-[#c0392b] mb-1">ÉTAPE {item.step}</div>
                <h3 className="font-semibold text-[#1e3a5f] mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Modes */}
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6">Les 4 modes de fonctionnement</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {modes.map((m) => (
              <div key={m.mode} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-start gap-4">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 mt-0.5 ${m.color}`}>{m.mode}</span>
                <p className="text-sm text-gray-500">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modèles */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-2">Les modèles que nous installons</h2>
          <p className="text-gray-500 mb-10">Deux versions de la gamme Ariston Nuos Plus S2, selon la configuration de votre logement.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {modeles.map((m) => (
              <div key={m.nom} className="border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-[#c0392b]/30 transition-colors">
                <div className="h-64 bg-gray-900 overflow-hidden">
                  <img
                    src={m.image}
                    alt={m.nom}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs font-semibold text-[#c0392b] uppercase tracking-wider mb-1">{m.type}</p>
                      <h3 className="text-xl font-bold text-[#1e3a5f]">{m.nom}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Capacités</p>
                      <p className="font-semibold text-[#1e3a5f]">{m.capacites.join(" · ")}</p>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mb-6">{m.desc}</p>
                  <ul className="space-y-2">
                    {m.avantages.map((a) => (
                      <li key={a} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle size={15} className="text-[#c0392b] shrink-0" />
                        {a}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-3">
                    <Wifi size={15} className="text-[#c0392b]" />
                    <span className="text-xs text-gray-400">WiFi intégré · COP {m.cop} · Classe A+</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-10">Questions fréquentes</h2>
          <div className="space-y-4">
            {faq.map((item) => (
              <div key={item.q} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-[#1e3a5f] mb-2">{item.q}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.r}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#1e3a5f] text-white text-center">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-3">Intéressé par un boiler thermodynamique ?</h2>
          <p className="text-gray-300 mb-8">Prenez rendez-vous pour une visite technique gratuite. Je vous conseille le modèle adapté à votre situation.</p>
          <Link href="/reservation?service=installation" className="inline-block bg-[#c0392b] hover:bg-[#a93226] px-8 py-4 rounded-xl font-semibold text-lg transition-colors">
            Demander un devis
          </Link>
        </div>
      </section>
    </>
  );
}
