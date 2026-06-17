import Link from "next/link";
import { CheckCircle, ArrowLeft, Droplets, Zap, Euro, Leaf, ShieldCheck, Wrench } from "lucide-react";

const avantages = [
  {
    icon: <Leaf size={28} className="text-[#c0392b]" />,
    title: "Sans sel, sans sodium",
    desc: "Contrairement aux adoucisseurs classiques, le système SoluCalc n'ajoute aucun sodium à votre eau. Les minéraux naturels (calcium, magnésium) sont conservés.",
  },
  {
    icon: <Droplets size={28} className="text-[#c0392b]" />,
    title: "Zéro rejet d'eau",
    desc: "Pas de cycle de régénération, pas de gaspillage d'eau. Le système fonctionne en continu sans interruption ni entretien complexe.",
  },
  {
    icon: <Zap size={28} className="text-[#c0392b]" />,
    title: "25 % d'économie d'énergie",
    desc: "Sans calcaire, vos appareils chauffent l'eau plus vite. Chaudière, boiler, lave-linge — tous retrouvent leur efficacité d'origine.",
  },
  {
    icon: <ShieldCheck size={28} className="text-[#c0392b]" />,
    title: "Protection de l'installation",
    desc: "Le calcaire est le principal ennemi des chaudières et des boilers. L'adoucisseur prolonge la durée de vie de toute votre installation.",
  },
];

const etapes = [
  { step: "1", title: "Injection de CO₂", desc: "Le système injecte une quantité contrôlée de CO₂ directement dans l'eau après le compteur." },
  { step: "2", title: "Transformation du calcaire", desc: "Le CO₂ transforme les minéraux durs en bicarbonate de calcium soluble." },
  { step: "3", title: "Eau traitée", desc: "Le calcaire ne s'accumule plus dans vos tuyaux, robinets ou appareils — même à haute température." },
  { step: "4", title: "Entretien minimal", desc: "Un remplacement de la bouteille de CO₂ par an suffit. Pas de sel, pas de rejet." },
];

const economies = [
  { label: "Réparations appareils & canalisations", val: "93 €/an" },
  { label: "Gain énergétique (chauffe 25 % plus rapide)", val: "96 €/an" },
  { label: "Produits d'entretien & détartrants", val: "96 €/an" },
];

const faq = [
  {
    q: "C'est quoi la différence avec un adoucisseur à sel classique ?",
    r: "L'adoucisseur à sel échange le calcium contre du sodium — il adoucit l'eau mais en modifie la composition. Le SoluCalc utilise du CO₂ : il empêche le calcaire de se déposer sans rien ajouter ni retirer de l'eau. Elle reste naturelle et bonne à boire.",
  },
  {
    q: "L'eau reste-t-elle potable ?",
    r: "Oui, totalement. Le système est certifié ACS (conformité eau potable) et CE. Les minéraux naturels sont conservés, le goût de l'eau est préservé.",
  },
  {
    q: "Où est installé l'appareil ?",
    r: "Directement après le compteur d'eau, en cave ou dans le local technique. L'installation est compacte et ne nécessite pas d'évacuation d'eau ni de raccordement électrique complexe.",
  },
  {
    q: "Combien de fois faut-il intervenir par an ?",
    r: "Une seule fois par an pour remplacer la bouteille de CO₂. SoluCalc propose également la livraison à domicile des bouteilles.",
  },
  {
    q: "Quelle est la garantie ?",
    r: "5 ans garantie constructeur. Le système est reconnu par Test-Achats et validé par le centre Buildwise.",
  },
];

export default function AdoucisseurPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-[#1e3a5f] text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <Link href="/services" className="inline-flex items-center gap-2 text-gray-300 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft size={16} /> Retour aux services
          </Link>
          <div className="inline-block bg-[#c0392b] text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
            Partenaire SoluCalc
          </div>
          <h1 className="text-4xl font-bold mb-4">Adoucisseur d'eau</h1>
          <p className="text-gray-300 max-w-xl text-lg">
            Protégez votre installation et économisez jusqu'à 285 € par an — sans sel, sans sodium, sans gaspillage.
          </p>
        </div>
      </section>

      {/* Chiffres clés */}
      <section className="bg-[#c0392b] text-white py-10">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { val: "285 €", label: "Économies par an" },
            { val: "5 ans", label: "Garantie constructeur" },
            { val: "1×/an", label: "Entretien bouteille CO₂" },
            { val: "0", label: "Rejet d'eau" },
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
            Le système SoluCalc n'adoucit pas l'eau au sens traditionnel — il empêche le calcaire de se déposer en injectant du CO₂. Résultat : une eau naturelle, des appareils protégés, sans aucun sel.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {etapes.map((e) => (
              <div key={e.step} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
                <div className="w-10 h-10 rounded-full bg-[#c0392b] text-white font-bold flex items-center justify-center mx-auto mb-4">{e.step}</div>
                <h3 className="font-semibold text-[#1e3a5f] mb-2">{e.title}</h3>
                <p className="text-sm text-gray-500">{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-10">Pourquoi choisir le SoluCalc ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {avantages.map((a) => (
              <div key={a.title} className="flex items-start gap-5 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="shrink-0 mt-1">{a.icon}</div>
                <div>
                  <h3 className="font-semibold text-[#1e3a5f] mb-1">{a.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Économies */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-2">Jusqu'à 285 € d'économies par an</h2>
          <p className="text-gray-500 mb-8">Le calcaire coûte cher — en réparations, en énergie, en produits d'entretien. L'adoucisseur se rembourse rapidement.</p>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {economies.map((e, i) => (
              <div key={e.label} className={`flex items-center justify-between px-6 py-5 ${i < economies.length - 1 ? "border-b border-gray-100" : ""}`}>
                <div className="flex items-center gap-3">
                  <Euro size={16} className="text-[#c0392b] shrink-0" />
                  <span className="text-sm text-gray-600">{e.label}</span>
                </div>
                <span className="font-semibold text-[#1e3a5f]">{e.val}</span>
              </div>
            ))}
            <div className="flex items-center justify-between px-6 py-5 bg-[#1e3a5f] text-white">
              <span className="font-semibold">Total économies estimées</span>
              <span className="text-xl font-bold">285 €/an</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">* Estimation basée sur un logement moyen. Source : SoluCalc.</p>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-10 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 text-center">
            {["Certifié ACS (eau potable)", "Marquage CE", "Validé Buildwise", "Reconnu Test-Achats"].map((c) => (
              <div key={c} className="flex items-center gap-2 text-sm text-gray-500">
                <CheckCircle size={16} className="text-[#c0392b]" />
                {c}
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
          <h2 className="text-2xl font-bold mb-3">Intéressé par un adoucisseur SoluCalc ?</h2>
          <p className="text-gray-300 mb-8">Prenez rendez-vous pour une visite technique. Je vous conseille la solution adaptée à votre installation et à la dureté de votre eau.</p>
          <Link href="/reservation?service=installation" className="inline-block bg-[#c0392b] hover:bg-[#a93226] px-8 py-4 rounded-xl font-semibold text-lg transition-colors">
            Demander un devis
          </Link>
        </div>
      </section>
    </>
  );
}
