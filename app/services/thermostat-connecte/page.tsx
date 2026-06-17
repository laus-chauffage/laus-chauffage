import Link from "next/link";
import { Wifi, MapPin, Calendar, Smartphone, Zap, Home, ChevronRight, ThumbsUp } from "lucide-react";

export default function ThermostatConnectePage() {
  return (
    <>
      {/* Header */}
      <section className="bg-[#1e3a5f] text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/services" className="hover:text-white transition-colors">Services</Link>
            <ChevronRight size={14} />
            <span className="text-white">Thermostat connecté</span>
          </div>
          <div className="max-w-3xl">
            <div className="inline-block bg-[#c0392b] text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
              Resideo — Partenaire Honeywell
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Thermostat intelligent T6</h1>
            <p className="text-gray-300 text-lg max-w-2xl">
              Contrôlez votre chauffage depuis votre smartphone, où que vous soyez. Le T6 s'adapte à votre mode de vie et réduit votre consommation sans sacrifier le confort.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#c0392b] text-white py-8">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { val: "Wi-Fi", label: "Connexion intégrée" },
            { val: "7 j", label: "Programmation hebdomadaire" },
            { val: "iOS & Android", label: "Application mobile" },
            { val: "HomeKit", label: "Apple / Alexa / Google" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-bold">{s.val}</div>
              <div className="text-sm opacity-90 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Avantages */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#1e3a5f] mb-10 text-center">Pourquoi choisir le T6 ?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <MapPin size={28} className="text-[#c0392b]" />,
                title: "Géolocalisation",
                desc: "Le thermostat détecte quand vous quittez la maison ou rentrez, et ajuste automatiquement la température.",
              },
              {
                icon: <Calendar size={28} className="text-[#c0392b]" />,
                title: "Programme sur 7 jours",
                desc: "Définissez des plages horaires différentes pour chaque jour de la semaine selon votre rythme de vie.",
              },
              {
                icon: <Zap size={28} className="text-[#c0392b]" />,
                title: "Chauffe intelligente",
                desc: "Calcule le temps nécessaire pour atteindre la température souhaitée, même par grand froid.",
              },
              {
                icon: <Smartphone size={28} className="text-[#c0392b]" />,
                title: "Contrôle à distance",
                desc: "Modifiez la consigne, consultez la température ou changez le programme depuis n'importe où.",
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

      {/* Modèles disponibles */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#1e3a5f] mb-10 text-center">Modèles disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                ref: "Y6H910WF4032",
                title: "T6 filaire — Blanc",
                desc: "Montage mural fixe. Design épuré, s'intègre dans tous les intérieurs.",
                points: ["Filaire", "Blanc", "Wi-Fi intégré"],
              },
              {
                ref: "Y6H810WF1005",
                title: "T6 filaire — Anthracite",
                desc: "Montage mural fixe. Finition anthracite pour un rendu moderne et discret.",
                points: ["Filaire", "Anthracite", "Wi-Fi intégré"],
              },
              {
                ref: "Y6H910RW4013",
                title: "T6 sans fil — Anthracite",
                desc: "Version portable, sans câblage. Idéal pour les installations existantes.",
                points: ["Sans fil", "Anthracite", "Wi-Fi intégré"],
              },
            ].map((m) => (
              <div key={m.ref} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <Wifi size={32} className="text-[#c0392b]" />
                  <span className="text-xs text-gray-400 font-mono">{m.ref}</span>
                </div>
                <h3 className="font-bold text-[#1e3a5f] text-lg mb-2">{m.title}</h3>
                <p className="text-sm text-gray-500 mb-4 flex-1">{m.desc}</p>
                <ul className="space-y-1">
                  {m.points.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c0392b] shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compatibilité */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-[#1e3a5f] mb-4">Compatible avec votre écosystème</h2>
              <p className="text-gray-500 mb-8">
                Le T6 s'intègre nativement aux assistants vocaux et plateformes domotiques les plus répandus. Une seule application centralise tout.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: <Home size={20} className="text-[#c0392b]" />, label: "Apple HomeKit" },
                  { icon: <Smartphone size={20} className="text-[#c0392b]" />, label: "Amazon Alexa" },
                  { icon: <Wifi size={20} className="text-[#c0392b]" />, label: "Google Home" },
                  { icon: <Zap size={20} className="text-[#c0392b]" />, label: "IFTTT" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    {item.icon}
                    <span className="font-medium text-[#1e3a5f] text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <h3 className="font-bold text-[#1e3a5f] mb-6 text-lg">Ce que comprend notre installation</h3>
              <ul className="space-y-4">
                {[
                  "Fourniture du thermostat T6 (modèle au choix)",
                  "Dépose de l'ancien thermostat",
                  "Pose et câblage (ou pose sans fil)",
                  "Configuration Wi-Fi et création du compte Resideo",
                  "Paramétrage du programme hebdomadaire",
                  "Explication de l'application mobile",
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
                q: "Le T6 est-il compatible avec ma chaudière ?",
                a: "Le T6 est compatible avec la grande majorité des chaudières gaz et mazout. Nous vérifions la compatibilité avant l'installation.",
              },
              {
                q: "Faut-il un abonnement pour utiliser l'application ?",
                a: "Non, l'application Resideo Smart Home est gratuite et sans abonnement. Toutes les fonctionnalités sont incluses.",
              },
              {
                q: "Puis-je garder mon ancien thermostat filaire ?",
                a: "Oui, nous pouvons utiliser le câblage existant pour le modèle filaire. La version sans fil ne nécessite aucun câblage.",
              },
              {
                q: "Combien de temps dure l'installation ?",
                a: "En général moins de 2 heures, pose et configuration de l'application comprise.",
              },
              {
                q: "Est-ce que le T6 réduit vraiment ma facture ?",
                a: "Oui — la géolocalisation et la programmation intelligente évitent de chauffer une maison vide. Les économies varient selon l'usage, mais sont généralement significatives.",
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
          <h2 className="text-3xl font-bold mb-4">Intéressé par le thermostat T6 ?</h2>
          <p className="text-gray-300 mb-8">Prenez rendez-vous pour une installation rapide et un paramétrage complet inclus.</p>
          <Link href="/reservation?service=installation"
            className="inline-block bg-[#c0392b] hover:bg-[#a93226] px-10 py-4 rounded-xl font-semibold text-lg transition-colors">
            Demander un devis
          </Link>
        </div>
      </section>
    </>
  );
}
