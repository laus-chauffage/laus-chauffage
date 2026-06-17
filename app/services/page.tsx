import React from "react";
import Link from "next/link";
import { Flame, Wrench, Droplets, Droplet, Filter, CheckCircle, Zap, Thermometer, Wind, Wifi, ChevronRight, Euro, ShieldCheck } from "lucide-react";

const services: { icon: React.ReactNode; title: string; freq: string; price: string; points: string[]; href?: string }[] = [
  {
    icon: <Flame size={40} className="text-[#c0392b]" />,
    title: "Entretien chaudière",
    freq: "Mazout (annuel) · Gaz (2 ans)",
    price: "À partir de 132,50€ TVAC",
    points: [
      "Nettoyage du corps de chauffe et du brûleur",
      "Vérification circuit gaz / fuel",
      "Contrôle des sécurités et de la régulation",
      "Analyse des fumées / de combustion",
      "Rapport d'entretien fourni",
      "Mazout à partir de 145€ · Gaz à partir de 132,50€",
    ],
  },
  {
    icon: <Wrench size={40} className="text-[#c0392b]" />,
    title: "Dépannage",
    freq: "Sur rendez-vous",
    price: "Sur devis",
    points: [
      "Diagnostic complet",
      "Remplacement de pièces",
      "Remise en service",
      "Conseil et prévention",
    ],
  },
  {
    icon: <Wrench size={40} className="text-[#c0392b]" />,
    title: "Remplacement chaudière",
    freq: "Sur devis",
    price: "Sur devis",
    href: "/services/chaudiere-gaz",
    points: [
      "Chaudières à condensation mazout",
      "Chaudières à condensation gaz",
      "Mise en service et réglage",
      "Garantie constructeur",
    ],
  },
  {
    icon: <Droplets size={40} className="text-[#c0392b]" />,
    title: "Adoucisseur d'eau",
    freq: "Sur devis",
    price: "Sur devis",
    href: "/services/adoucisseur",
    points: [
      "Protection de votre installation",
      "Réduction du calcaire",
      "Installation et raccordement",
      "Mise en service et réglage",
    ],
  },
  {
    icon: <Zap size={40} className="text-[#c0392b]" />,
    title: "Boiler thermodynamique",
    freq: "Sur devis",
    price: "Sur devis",
    href: "/services/boiler-thermodynamique",
    points: [
      "Ariston Nuos Plus S2 WiFi — 200 & 250 litres",
      "Ariston Nuos Split — 200 & 250 litres",
      "COP jusqu'à 3,5 — économies jusqu'à 70 %",
      "Classe énergétique A+",
      "Contrôle via application mobile (WiFi intégré)",
      "Raccordements hydrauliques et électriques",
      "Mise en service et paramétrage inclus",
    ],
  },
  {
    icon: <Thermometer size={40} className="text-[#c0392b]" />,
    title: "Remplacement de radiateur",
    freq: "Sur rendez-vous",
    price: "Sur devis",
    href: "/services/radiateur",
    points: [
      "Dépose de l'ancien radiateur",
      "Fourniture et pose du nouveau radiateur",
      "Rinçage et mise en service",
      "Conseil sur le dimensionnement",
    ],
  },
  {
    icon: <Wifi size={40} className="text-[#c0392b]" />,
    title: "Thermostat connecté",
    freq: "Sur rendez-vous",
    price: "Sur devis",
    href: "/services/thermostat-connecte",
    points: [
      "Fourniture et pose du thermostat",
      "Connexion Wi-Fi et configuration",
      "Programmation horaire",
      "Contrôle à distance via application",
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="bg-[#1e3a5f] text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Nos services</h1>
          <p className="text-gray-300 max-w-xl mx-auto">
            Entretien, installation et dépannage dans le Brabant wallon et le Hainaut.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s) => (
            <div key={s.title} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex flex-col">
              <div className="mb-4">{s.icon}</div>
              <h2 className="text-xl font-bold text-[#1e3a5f] mb-1">{s.title}</h2>
              <div className="flex gap-3 mb-4">
                <span className="text-xs bg-[#1e3a5f]/10 text-[#1e3a5f] px-3 py-1 rounded-full font-medium">{s.freq}</span>
                {s.price && s.price !== "Sur devis" && (
                  <span className="text-xs bg-[#c0392b]/10 text-[#c0392b] px-3 py-1 rounded-full font-medium">{s.price}</span>
                )}
              </div>
              <ul className="space-y-2 flex-1">
                {s.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle size={16} className="text-[#c0392b] shrink-0 mt-0.5" />
                    {p}
                  </li>
                ))}
              </ul>
              {s.href ? (
                <Link href={s.href} className="mt-6 flex items-center justify-center gap-1 bg-[#c0392b] hover:bg-[#a93226] text-white py-2.5 rounded-lg font-semibold text-sm transition-colors">
                  En savoir plus <ChevronRight size={15} />
                </Link>
              ) : (
                <Link href="/reservation" className="mt-6 block text-center bg-[#c0392b] hover:bg-[#a93226] text-white py-2.5 rounded-lg font-semibold text-sm transition-colors">
                  Prendre RDV
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Focus Ariston Nuos */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1">
              <div className="inline-block bg-[#c0392b]/10 text-[#c0392b] text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
                Partenaire Ariston
              </div>
              <h2 className="text-3xl font-bold text-[#1e3a5f] mb-4">Ariston Nuos Plus S2 — le boiler qui se paie tout seul</h2>
              <p className="text-gray-500 mb-8">
                La gamme Nuos extrait les calories de l'air ambiant pour chauffer l'eau sanitaire. Résultat : jusqu'à 70 % d'économies sur votre facture d'eau chaude, avec un confort identique à un boiler électrique classique.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: <Zap size={20} className="text-[#c0392b]" />, label: "COP jusqu'à 3,5", sub: "3,5 kWh produits pour 1 kWh consommé" },
                  { icon: <Thermometer size={20} className="text-[#c0392b]" />, label: "De -5 °C à +43 °C", sub: "Fonctionne toute l'année" },
                  { icon: <Wind size={20} className="text-[#c0392b]" />, label: "200 & 250 litres", sub: "Nuos Plus S2 · Nuos Split" },
                  { icon: <Wifi size={20} className="text-[#c0392b]" />, label: "WiFi intégré", sub: "Contrôle via application mobile" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                    <div className="mt-0.5 shrink-0">{item.icon}</div>
                    <div>
                      <p className="font-semibold text-[#1e3a5f] text-sm">{item.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/reservation" className="inline-block bg-[#c0392b] hover:bg-[#a93226] text-white px-8 py-3 rounded-xl font-semibold transition-colors">
                Demander un devis
              </Link>
            </div>
            <div className="flex-1 bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <h3 className="font-bold text-[#1e3a5f] mb-6 text-lg">Les 4 modes de fonctionnement</h3>
              <div className="space-y-4">
                {[
                  { mode: "Automatique", desc: "Le système choisit le mode le plus économique selon la température ambiante.", color: "bg-green-100 text-green-700" },
                  { mode: "Pompe à chaleur", desc: "100 % sur la pompe à chaleur — consommation minimale.", color: "bg-blue-100 text-blue-700" },
                  { mode: "Booster", desc: "Pompe à chaleur + résistance électrique pour une recharge rapide.", color: "bg-orange-100 text-orange-700" },
                  { mode: "Électrique", desc: "Résistance seule — idéal en cas de tarif nuit ou d'urgence.", color: "bg-gray-100 text-gray-600" },
                ].map((m) => (
                  <div key={m.mode} className="flex items-start gap-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 mt-0.5 ${m.color}`}>{m.mode}</span>
                    <p className="text-sm text-gray-500">{m.desc}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-400">Ariston Nuos Plus S2 WiFi · Nuos Split · 200 & 250 L · Classe A+ · Garantie 2 ans</p>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Focus SoluCalc */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1">
              <div className="inline-block bg-[#c0392b]/10 text-[#c0392b] text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
                Partenaire SoluCalc
              </div>
              <h2 className="text-3xl font-bold text-[#1e3a5f] mb-4">L'adoucisseur sans sel qui protège votre installation</h2>
              <p className="text-gray-500 mb-8">
                Le SoluCalc injecte du CO₂ dans l'eau pour empêcher le calcaire de se déposer — sans sel, sans sodium, sans rejet d'eau. Vos appareils durent plus longtemps et consomment moins.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: <Euro size={20} className="text-[#c0392b]" />, label: "285 €/an économisés", sub: "Énergie, entretien, produits" },
                  { icon: <Droplets size={20} className="text-[#c0392b]" />, label: "Sans sel ni sodium", sub: "Eau naturelle préservée" },
                  { icon: <ShieldCheck size={20} className="text-[#c0392b]" />, label: "Certifié ACS & CE", sub: "Eau potable, norme européenne" },
                  { icon: <Wrench size={20} className="text-[#c0392b]" />, label: "1 intervention/an", sub: "Remplacement bouteille CO₂" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100">
                    <div className="mt-0.5 shrink-0">{item.icon}</div>
                    <div>
                      <p className="font-semibold text-[#1e3a5f] text-sm">{item.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/services/adoucisseur" className="inline-block bg-[#c0392b] hover:bg-[#a93226] text-white px-8 py-3 rounded-xl font-semibold transition-colors">
                En savoir plus
              </Link>
            </div>
            <div className="flex-1 bg-white rounded-2xl p-8 border border-gray-100">
              <h3 className="font-bold text-[#1e3a5f] mb-6 text-lg">Comparatif : avec ou sans adoucisseur</h3>
              <div className="space-y-4">
                {[
                  { aspect: "Calcaire dans les tuyaux", sans: "Accumulation progressive", avec: "Aucun dépôt" },
                  { aspect: "Chaudière & boiler", sans: "Usure accélérée", avec: "Durée de vie prolongée" },
                  { aspect: "Consommation énergie", sans: "Normale", avec: "-25 % sur la chauffe" },
                  { aspect: "Produits détartrants", sans: "Régulièrement", avec: "Inutiles" },
                  { aspect: "Goût de l'eau", sans: "Inchangé", avec: "Inchangé (minéraux préservés)" },
                ].map((row) => (
                  <div key={row.aspect} className="grid grid-cols-3 gap-3 text-sm items-start">
                    <p className="text-gray-500 text-xs font-medium">{row.aspect}</p>
                    <p className="text-red-400 text-xs">{row.sans}</p>
                    <p className="text-green-600 text-xs font-medium">{row.avec}</p>
                  </div>
                ))}
                <div className="grid grid-cols-3 gap-3 text-xs font-semibold text-gray-400 pt-2 border-t border-gray-100">
                  <span></span><span>Sans</span><span className="text-[#1e3a5f]">Avec SoluCalc</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

