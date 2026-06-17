import { Flame, Phone, Mail, MapPin, Clock } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1e3a5f] text-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 font-bold text-xl mb-4">
            <Flame className="text-[#c0392b]" size={24} />
            Laus Chauffage
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            Spécialiste en chauffage central résidentiel depuis plus de 45 ans. Entretien, dépannage et installation dans le Brabant wallon et Hainaut.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4">Contact</h3>
          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-[#c0392b] shrink-0" />
              <a href="tel:+32475200487" className="hover:text-white transition-colors">+32 475 20 04 87</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-[#c0392b] shrink-0" />
              <a href="mailto:sebastien@laus-chauffage.be" className="hover:text-white transition-colors">sebastien@laus-chauffage.be</a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={16} className="text-[#c0392b] shrink-0" />
              <span>Route de Bruxelles, 17 — Rebecq</span>
            </li>
            <li className="flex items-center gap-2">
              <Clock size={16} className="text-[#c0392b] shrink-0" />
              <span>Lun–Ven : 8h–17h</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4">Navigation</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            {[
              { href: "/services", label: "Services" },
              { href: "/realisations", label: "Réalisations" },
              { href: "/reservation", label: "Réserver un RDV" },
              { href: "/contact", label: "Contact" },
              { href: "/admin", label: "Espace admin" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white hover:text-[#c0392b] transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-[#2d5a8e] text-center text-xs text-gray-400 py-4">
        © {new Date().getFullYear()} Laus Chauffage — Tous droits réservés
      </div>
    </footer>
  );
}

