"use client";
import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ nom: "", email: "", telephone: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSent(true);
    setLoading(false);
  }

  return (
    <>
      <section className="bg-[#1e3a5f] text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Contact</h1>
          <p className="text-gray-300">Une question ? N'hésitez pas à nous contacter.</p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6">Nos coordonnées</h2>
            <ul className="space-y-5">
              {[
                { icon: <Phone size={20} />, label: "Téléphone", val: "+32 475 20 04 87", href: "tel:+32475200487" },
                { icon: <Mail size={20} />, label: "Email", val: "sebastien@laus-chauffage.be", href: "mailto:sebastien@laus-chauffage.be" },
                { icon: <MapPin size={20} />, label: "Adresse", val: "Route de Bruxelles, 17 — Rebecq", href: null },
                { icon: <Clock size={20} />, label: "Horaires", val: "Lundi à vendredi, 8h – 17h", href: null },
              ].map((item) => (
                <li key={item.label} className="flex items-start gap-4">
                  <div className="text-[#c0392b] mt-0.5">{item.icon}</div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-[#1e3a5f] font-semibold hover:text-[#c0392b] transition-colors">{item.val}</a>
                    ) : (
                      <p className="text-[#1e3a5f] font-semibold">{item.val}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6">Envoyer un message</h2>
            {sent ? (
              <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-6 text-center">
                <p className="font-semibold text-lg mb-1">Message envoyé !</p>
                <p className="text-sm">Nous vous répondrons dans les plus brefs délais.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { name: "nom", label: "Nom complet", type: "text" },
                  { name: "email", label: "Email", type: "email" },
                  { name: "telephone", label: "Téléphone", type: "tel" },
                ].map((f) => (
                  <div key={f.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                    <input
                      type={f.type}
                      required={f.name !== "telephone"}
                      value={form[f.name as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#c0392b] hover:bg-[#a93226] text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-60">
                  <Send size={18} />
                  {loading ? "Envoi en cours…" : "Envoyer le message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

