import Link from "next/link";
import { Thermometer, Wrench, Zap, CheckCircle, ChevronRight, ThumbsUp, Ruler } from "lucide-react";

export default function RadiateurPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-[#1e3a5f] text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/services" className="hover:text-white transition-colors">Services</Link>
            <ChevronRight size={14} />
            <span className="text-white">Remplacement de radiateur</span>
          </div>
          <div className="max-w-3xl">
            <div className="inline-block bg-[#c0392b] text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
              Partenaire Henrad
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Remplacement de radiateur</h1>
            <p className="text-gray-300 text-lg max-w-2xl">
              Un radiateur vétuste ou sous-dimensionné pénalise tout votre système de chauffage. Nous le remplaçons par un modèle adapté à votre pièce pour un confort optimal et une meilleure efficacité.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#c0392b] text-white py-8">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { val: "½ journée", label: "Durée d'intervention" },
            { val: "Sur mesure", label: "Dimensionnement adapté" },
            { val: "Acier", label: "Matériau" },
            { val: "Devis gratuit", label: "Sans engagement" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-bold">{s.val}</div>
              <div className="text-sm opacity-90 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pourquoi remplacer */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#1e3a5f] mb-10 text-center">Quand remplacer un radiateur ?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Thermometer size={28} className="text-[#c0392b]" />,
                title: "Chauffe inégale",
                desc: "La pièce reste froide malgré le chauffage allumé, ou le radiateur chauffe en bas mais pas en haut.",
              },
              {
                icon: <Wrench size={28} className="text-[#c0392b]" />,
                title: "Fuites ou corrosion",
                desc: "Traces de rouille, suintements ou pertes de pression récurrentes sur l'installation.",
              },
              {
                icon: <Zap size={28} className="text-[#c0392b]" />,
                title: "Mauvais rendement",
                desc: "L'accumulation de boues et de crasses dans le circuit obstrue les radiateurs et réduit leur efficacité — sans compter l'inertie excessive des vieux modèles en fonte.",
              },
              {
                icon: <Ruler size={28} className="text-[#c0392b]" />,
                title: "Sous-dimensionnement",
                desc: "La pièce a été agrandie, rénovée ou isolée et le radiateur existant n'est plus adapté.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="mb-4">{item.icon}</div>
                <h3 className="font-bold text-[#1e3a5f] mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Types de radiateurs */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#1e3a5f] mb-10 text-center">Types de radiateurs proposés</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Henrad Premium ECO",
                tag: "Notre recommandation",
                tagColor: "bg-green-100 text-green-700",
                desc: "Le circuit d'eau passe en priorité par la face avant, ce qui augmente la température de surface et rayonne davantage de chaleur. Jusqu'à 10 % d'économies d'énergie vérifiées par Kiwa.",
                points: [
                  "Jusqu'à 10 % d'économies sur la facture",
                  "+100 % de rayonnement sur la face avant",
                  "Chauffe 23 % plus rapide",
                  "Vanne thermostatique pré-réglée incluse",
                  "Compatible énergies renouvelables",
                  "Fabriqué en Belgique (Herentals)",
                ],
              },
              {
                title: "Radiateurs décoratifs Henrad",
                tag: "Design",
                tagColor: "bg-orange-100 text-orange-700",
                desc: "Une gamme complète pour chaque intérieur — du rétro au minimaliste. Tous disponibles chez nous.",
                points: [
                  "Alto Slim / Swing / Tango / Line / Plan",
                  "Everest Slim ECO / Line ECO / Plan ECO",
                  "Everest Line 8 / Plan 8",
                  "Column — style rétro, version verticale & horizontale",
                  "Compact Line / Compact Plan",
                ],
              },
            ].map((m) => (
              <div key={m.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col">
                <span className={`self-start text-xs font-semibold px-2.5 py-1 rounded-full mb-4 ${m.tagColor}`}>{m.tag}</span>
                <h3 className="font-bold text-[#1e3a5f] text-lg mb-2">{m.title}</h3>
                <p className="text-sm text-gray-500 mb-4 flex-1">{m.desc}</p>
                <ul className="space-y-1.5">
                  {m.points.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-xs text-gray-500">
                      <CheckCircle size={13} className="text-[#c0392b] shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Déroulement */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-[#1e3a5f] mb-8">Le déroulement de l'intervention</h2>
              <div className="space-y-6">
                {[
                  { num: "1", title: "Visite et dimensionnement", desc: "Calcul de la puissance nécessaire selon le volume de la pièce, l'isolation et le type de chaudière." },
                  { num: "2", title: "Dépose de l'ancien radiateur", desc: "Vidange locale du circuit, débranchement et enlèvement de l'ancien radiateur." },
                  { num: "3", title: "Pose et raccordement", desc: "Installation du nouveau radiateur, raccordement aux robinets et au retour, purge du circuit." },
                  { num: "4", title: "Mise en service et réglage", desc: "Vérification de l'étanchéité, équilibrage du circuit et réglage de la vanne thermostatique." },
                ].map((step) => (
                  <div key={step.num} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#c0392b] text-white flex items-center justify-center font-bold text-lg shrink-0">
                      {step.num}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1e3a5f] mb-1">{step.title}</h3>
                      <p className="text-sm text-gray-500">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <h3 className="font-bold text-[#1e3a5f] mb-6 text-lg">Ce qui est inclus</h3>
              <ul className="space-y-4">
                {[
                  "Fourniture du nouveau radiateur",
                  "Dépose et évacuation de l'ancien",
                  "Raccordement aux robinets existants",
                  "Remplacement de la vanne thermostatique si nécessaire",
                  "Purge et vérification de l'étanchéité",
                  "Équilibrage du circuit",
                  "Mise en service complète",
                ].map((p) => (
                  <li key={p} className="flex items-start gap-3 text-sm text-gray-600">
                    <ThumbsUp size={16} className="text-[#c0392b] shrink-0 mt-0.5" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#1e3a5f] mb-10 text-center">Questions fréquentes</h2>
          <div className="space-y-4">
            {[
              {
                q: "Faut-il vider toute l'installation pour remplacer un radiateur ?",
                a: "Non, il suffit de fermer les robinets et de vider uniquement le radiateur concerné. Le reste du circuit n'est pas touché.",
              },
              {
                q: "Puis-je garder mes robinets et vannes thermostatiques ?",
                a: "En général oui, si les raccordements sont au standard. Nous vérifions leur état et les remplaçons si nécessaire.",
              },
              {
                q: "Combien de temps dure l'intervention ?",
                a: "En général une demi-journée par radiateur, mise en service et vérification de l'étanchéité comprises.",
              },
              {
                q: "Mon nouveau radiateur sera-t-il compatible avec ma chaudière à condensation ?",
                a: "Oui, nous sélectionnons des radiateurs basse température compatibles avec les chaudières à condensation pour maximiser leur rendement.",
              },
              {
                q: "Proposez-vous des radiateurs avec vanne thermostatique connectée ?",
                a: "Oui, nous pouvons associer le remplacement du radiateur à la pose d'une vanne thermostatique intelligente pour un confort et des économies accrus.",
              },
            ].map((item) => (
              <details key={item.q} className="bg-white rounded-xl border border-gray-100 shadow-sm group">
                <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-[#1e3a5f] list-none">
                  {item.q}
                  <ChevronRight size={18} className="text-[#c0392b] shrink-0 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="px-5 pb-5 text-sm text-gray-500">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#1e3a5f] text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Besoin de remplacer un radiateur ?</h2>
          <p className="text-gray-300 mb-8">Contactez-nous pour un devis gratuit. Nous nous déplaçons pour évaluer le remplacement et vous conseiller sur le modèle le mieux adapté.</p>
          <Link href="/reservation?service=installation"
            className="inline-block bg-[#c0392b] hover:bg-[#a93226] px-10 py-4 rounded-xl font-semibold text-lg transition-colors">
            Demander un devis gratuit
          </Link>
        </div>
      </section>
    </>
  );
}
