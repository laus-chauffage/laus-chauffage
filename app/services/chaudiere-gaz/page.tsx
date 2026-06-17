import Link from "next/link";
import { Flame, Zap, CheckCircle, ChevronRight, ThumbsUp, Thermometer, Wind, BarChart3 } from "lucide-react";

export default function ChaudiereGazPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-[#1e3a5f] text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/services" className="hover:text-white transition-colors">Services</Link>
            <ChevronRight size={14} />
            <span className="text-white">Remplacement chaudière gaz</span>
          </div>
          <div className="max-w-3xl">
            <div className="inline-block bg-[#c0392b] text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
              Partenaire Viessmann
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Remplacement de chaudière gaz</h1>
            <p className="text-gray-300 text-lg max-w-2xl">
              Une chaudière gaz à condensation moderne convertit plus de 98 % de l'énergie consommée en chaleur. C'est le remplacement le plus rentable que vous puissiez faire sur votre installation.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#c0392b] text-white py-8">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { val: "98 %+", label: "Rendement à condensation" },
            { val: "−35 %", label: "Économies vs ancienne chaudière" },
            { val: "jusqu'à 45 kW", label: "Puissances disponibles" },
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
          <h2 className="text-3xl font-bold text-[#1e3a5f] mb-10 text-center">Pourquoi remplacer votre chaudière gaz ?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <BarChart3 size={28} className="text-[#c0392b]" />,
                title: "Rendement insuffisant",
                desc: "Une ancienne chaudière gaz atteint 70 à 80 % de rendement. Une chaudière à condensation dépasse 98 % — la différence se voit directement sur la facture.",
              },
              {
                icon: <Thermometer size={28} className="text-[#c0392b]" />,
                title: "Pannes répétées",
                desc: "Brûleur défaillant, échangeur encrassé, pièces introuvables — au-delà de 15 ans, le remplacement est souvent plus économique que la réparation.",
              },
              {
                icon: <Wind size={28} className="text-[#c0392b]" />,
                title: "Chaudière non condensation",
                desc: "Les vieilles chaudières évacuent la chaleur latente dans les fumées. Une chaudière à condensation récupère cette énergie au lieu de la perdre.",
              },
              {
                icon: <Zap size={28} className="text-[#c0392b]" />,
                title: "Confort insuffisant",
                desc: "Eau chaude sanitaire irrégulière, manque de pression, temps de chauffe trop long — les nouvelles chaudières offrent un confort nettement supérieur.",
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

      {/* Technologie condensation */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1">
              <div className="inline-block bg-[#c0392b]/10 text-[#c0392b] text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
                Technologie à condensation
              </div>
              <h2 className="text-3xl font-bold text-[#1e3a5f] mb-4">Comment ça fonctionne ?</h2>
              <p className="text-gray-500 mb-6 leading-relaxed">
                Une chaudière classique évacue les gaz de combustion — et la chaleur qu'ils contiennent — directement vers l'extérieur. La chaudière à condensation récupère cette chaleur latente en faisant condenser la vapeur d'eau des fumées avant de les rejeter.
              </p>
              <p className="text-gray-500 leading-relaxed">
                Résultat : plus de 98 % de l'énergie du gaz est convertie en chaleur utile, contre 70 à 80 % pour une ancienne chaudière. Sur une facture annuelle, cela représente des centaines d'euros d'économies.
              </p>
            </div>
            <div className="flex-1 bg-white rounded-2xl p-8 border border-gray-100">
              <h3 className="font-bold text-[#1e3a5f] mb-6 text-lg">Ancienne vs condensation</h3>
              <div className="space-y-4">
                {[
                  { aspect: "Rendement", ancien: "70 – 80 %", condensation: "98 %+" },
                  { aspect: "Économies vs ancien", ancien: "—", condensation: "Jusqu'à −35 %" },
                  { aspect: "Récupération chaleur fumées", ancien: "Non", condensation: "Oui" },
                  { aspect: "Température de retour", ancien: "Élevée", condensation: "Basse (optimale)" },
                  { aspect: "Émissions de CO₂", ancien: "Élevées", condensation: "Réduites" },
                ].map((row) => (
                  <div key={row.aspect} className="grid grid-cols-3 gap-3 text-sm items-start">
                    <p className="text-gray-500 text-xs font-medium">{row.aspect}</p>
                    <p className="text-red-400 text-xs">{row.ancien}</p>
                    <p className="text-green-600 text-xs font-medium">{row.condensation}</p>
                  </div>
                ))}
                <div className="grid grid-cols-3 gap-3 text-xs font-semibold text-gray-400 pt-2 border-t border-gray-100">
                  <span></span><span>Ancienne</span><span className="text-[#1e3a5f]">Condensation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gamme Viessmann */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#1e3a5f] mb-4 text-center">La gamme Viessmann</h2>
          <p className="text-center text-gray-500 mb-10 max-w-xl mx-auto">Nous installons les chaudières Viessmann, reconnues pour leur fiabilité et leur rendement. Deux gammes selon votre configuration.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Vitodens — Murale",
                tag: "Compact",
                tagColor: "bg-blue-100 text-blue-700",
                desc: "Chaudière murale compacte, idéale pour les maisons et appartements. Chauffe l'eau à la demande ou avec boiler intégré selon le modèle.",
                points: [
                  "Gain de place — montage au mur",
                  "Chauffe-eau instantané ou boiler intégré",
                  "Idéale pour maison individuelle et appartement",
                  "Puissances jusqu'à 40 kW",
                ],
              },
              {
                title: "Vitocrossal — Au sol",
                tag: "Haute puissance",
                tagColor: "bg-green-100 text-green-700",
                desc: "Chaudière au sol avec ballon de stockage intégré. Pour les besoins importants en eau chaude sanitaire ou les grandes surfaces.",
                points: [
                  "Grand volume d'eau chaude disponible",
                  "Idéale pour maison de grande surface",
                  "Puissances jusqu'à 45 kW",
                  "Robustesse et longévité",
                ],
              },
            ].map((m) => (
              <div key={m.title} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col">
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

      {/* Ce qui est inclus */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-[#1e3a5f] mb-8">Le déroulement de l'installation</h2>
              <div className="space-y-6">
                {[
                  { num: "1", title: "Visite et dimensionnement", desc: "Évaluation de vos besoins en chauffage et eau chaude sanitaire, choix du modèle et de la puissance adaptée." },
                  { num: "2", title: "Dépose de l'ancienne chaudière", desc: "Vidange et débranchement de l'ancienne installation, déconnexion des raccordements gaz et hydrauliques." },
                  { num: "3", title: "Installation de la nouvelle chaudière", desc: "Pose, raccordements gaz, hydrauliques et électriques, connexion au conduit d'évacuation." },
                  { num: "4", title: "Mise en service et réglage", desc: "Mise sous pression, vérification de l'étanchéité, réglage des paramètres et test de combustion." },
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
            <div className="flex-1 bg-white rounded-2xl p-8 border border-gray-100">
              <h3 className="font-bold text-[#1e3a5f] mb-6 text-lg">Ce qui est inclus</h3>
              <ul className="space-y-4">
                {[
                  "Fourniture et pose de la chaudière Viessmann",
                  "Dépose et évacuation de l'ancienne installation",
                  "Raccordements gaz, eau et électricité",
                  "Connexion au conduit d'évacuation existant",
                  "Mise en service et test de combustion",
                  "Réglage des paramètres et mise au point",
                  "Garantie constructeur",
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
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#1e3a5f] mb-10 text-center">Questions fréquentes</h2>
          <div className="space-y-4">
            {[
              {
                q: "Combien de temps dure le remplacement ?",
                a: "En général 2 à 3 jours, de la dépose à la mise en service complète.",
              },
              {
                q: "Faut-il changer les radiateurs en même temps ?",
                a: "Pas nécessairement. Les chaudières à condensation fonctionnent mieux avec des basses températures de retour, ce que la plupart des radiateurs acier permettent déjà. Nous évaluons votre installation existante.",
              },
              {
                q: "Mon conduit de fumée est-il compatible ?",
                a: "Les chaudières à condensation utilisent un conduit coaxial (double tube). Si votre conduit existant est différent, nous adaptons ou remplaçons le raccordement.",
              },
              {
                q: "Quelle est la durée de vie d'une chaudière Viessmann ?",
                a: "Avec un entretien régulier, une chaudière Viessmann dure généralement 20 ans ou plus.",
              },
            ].map((item) => (
              <details key={item.q} className="bg-gray-50 rounded-xl border border-gray-100 shadow-sm group">
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
          <h2 className="text-3xl font-bold mb-4">Vous souhaitez remplacer votre chaudière gaz ?</h2>
          <p className="text-gray-300 mb-8">Contactez-nous pour un devis gratuit. Nous nous déplaçons pour évaluer votre installation et vous proposer la solution la mieux adaptée.</p>
          <Link href="/reservation?service=installation"
            className="inline-block bg-[#c0392b] hover:bg-[#a93226] px-10 py-4 rounded-xl font-semibold text-lg transition-colors">
            Demander un devis gratuit
          </Link>
        </div>
      </section>
    </>
  );
}
