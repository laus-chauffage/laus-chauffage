"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, Flame } from "lucide-react";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/services", label: "Services" },
  { href: "/realisations", label: "Réalisations" },
  { href: "/reservation", label: "Réserver" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-[#1e3a5f] text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Flame className="text-[#c0392b]" size={24} />
          Laus Chauffage
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-[#c0392b] transition-colors text-sm font-medium">
              {l.label}
            </Link>
          ))}
          <Link href="/reservation" className="bg-[#c0392b] hover:bg-[#a93226] px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
            Prendre RDV
          </Link>
        </nav>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[#1e3a5f] border-t border-[#2d5a8e] px-4 pb-4">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="block py-3 hover:text-[#c0392b] transition-colors font-medium border-b border-[#2d5a8e]">
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

