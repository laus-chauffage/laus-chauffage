"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DayPicker } from "react-day-picker";
import { fr } from "date-fns/locale";
import { format, addDays, isSunday, isSaturday, isToday, isBefore, startOfDay } from "date-fns";
import { CheckCircle } from "lucide-react";
import "react-day-picker/style.css";

const SERVICES = [
  { id: "entretien", label: "Entretien chaudière", duree: "2h" },
  { id: "depannage", label: "Dépannage", duree: "2h" },
  { id: "installation", label: "Devis", duree: "1h" },
];

const COMMUNES = ["Rebecq", "Tubize", "Braine-le-Comte", "Soignies", "Enghien", "Braine-le-Château", "Braine-l'Alleud", "Ittre", "Autre"];

const CRENEAUX = ["08:00", "10:00", "12:00", "14:00"];

function ReservationContent() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [service, setService] = useState("");

  useEffect(() => {
    const s = searchParams.get("service");
    if (s && SERVICES.find((sv) => sv.id === s)) {
      setService(s);
      setStep(2);
    }
  }, [searchParams]);
  const [date, setDate] = useState<Date | undefined>();
  const [creneau, setCreneau] = useState("");
  const [creneauxDispo, setCreneauxDispo] = useState<string[]>(CRENEAUX);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [joursActifs, setJoursActifs] = useState<number[]>([1, 2, 3, 4, 5]);

  const [form, setForm] = useState({ nom: "", prenom: "", email: "", telephone: "", rue: "", numero: "", commune: "", communeAutre: "", notes: "" });
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const today = startOfDay(new Date());
  const minDate = addDays(today, 1);

  useEffect(() => {
    if (!service) return;
    fetch(`/api/admin/disponibilites`)
      .then(r => r.json())
      .then(data => {
        const serviceType = service === "installation" ? "devis" : "entretien";
        const jours = [...new Set(
          (data.disponibilites || [])
            .filter((d: any) => d.service_type === serviceType && d.actif)
            .map((d: any) => d.jour)
        )] as number[];
        setJoursActifs(jours.length > 0 ? jours : [1, 2, 3, 4, 5]);
      })
      .catch(() => setJoursActifs([1, 2, 3, 4, 5]));
  }, [service]);

  function isDisabled(day: Date) {
    const dow = day.getDay(); // 0=dim, 1=lun...6=sam
    return isBefore(day, minDate) || dow === 0 || dow === 6 || !joursActifs.includes(dow);
  }

  async function handleDaySelect(day: Date | undefined) {
    setDate(day);
    setCreneau("");
    if (!day) return;
    setLoadingSlots(true);
    try {
      const res = await fetch(`/api/calendar?date=${format(day, "yyyy-MM-dd")}&service=${service}`);
      const data = await res.json();
      setCreneauxDispo(data.available || CRENEAUX);
    } catch {
      setCreneauxDispo(CRENEAUX);
    }
    setLoadingSlots(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const commune = form.commune === "Autre" ? form.communeAutre : form.commune;
    await fetch("/api/reservation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ service, date: date ? format(date, "yyyy-MM-dd") : "", creneau, ...form, commune }),
    });
    setDone(true);
    setSubmitting(false);
  }

  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm p-10 max-w-md w-full text-center border border-gray-100">
          <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-2">Demande envoyée !</h2>
          <p className="text-gray-500 mb-2">Votre rendez-vous du <strong>{date && format(date, "EEEE d MMMM yyyy", { locale: fr })}</strong> à <strong>{creneau}</strong> est en cours de confirmation.</p>
          <p className="text-gray-500 text-sm mb-6">Vérifiez votre email et cliquez sur le lien de confirmation pour finaliser votre réservation.</p>
          <button onClick={() => {
            setDone(false);
            setStep(1);
            setService("");
            setDate(undefined);
            setCreneau("");
            setForm({ nom: "", prenom: "", email: "", telephone: "", rue: "", numero: "", commune: "", communeAutre: "", notes: "" });
          }} className="bg-[#c0392b] hover:bg-[#a93226] text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            Nouvelle réservation
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="bg-[#1e3a5f] text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Prendre rendez-vous</h1>
          <p className="text-gray-300">Réservez votre créneau en ligne en quelques clics.</p>
        </div>
      </section>

      {/* Étapes */}
      <div className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-3xl mx-auto px-4 flex items-center justify-between">
          {["Service", "Date & heure", "Vos coordonnées"].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step > i + 1 ? "bg-green-500 text-white" : step === i + 1 ? "bg-[#c0392b] text-white" : "bg-gray-200 text-gray-400"}`}>
                {step > i + 1 ? "✓" : i + 1}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${step === i + 1 ? "text-[#1e3a5f]" : "text-gray-400"}`}>{label}</span>
              {i < 2 && <div className="w-8 sm:w-16 h-0.5 bg-gray-200 ml-2" />}
            </div>
          ))}
        </div>
      </div>

      <section className="py-12 bg-gray-50 min-h-screen">
        <div className="max-w-3xl mx-auto px-4">

          {/* Étape 1 — Choix du service */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6">Quel service souhaitez-vous ?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {SERVICES.map((s) => (
                  <button key={s.id} onClick={() => setService(s.id)}
                    className={`p-5 rounded-xl border-2 text-left transition-all ${service === s.id ? "border-[#c0392b] bg-[#c0392b]/5" : "border-gray-200 bg-white hover:border-[#1e3a5f]"}`}>
                    <p className="font-semibold text-[#1e3a5f]">{s.label}</p>
                    <p className="text-xs text-gray-400 mt-1">Durée : {s.duree}</p>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(2)} disabled={!service}
                className="w-full bg-[#c0392b] hover:bg-[#a93226] disabled:opacity-40 text-white py-3 rounded-xl font-semibold transition-colors">
                Continuer
              </button>
            </div>
          )}

          {/* Étape 2 — Date & heure */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6">Choisissez une date</h2>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 flex justify-center">
                <DayPicker
                  mode="single"
                  selected={date}
                  onSelect={handleDaySelect}
                  disabled={isDisabled}
                  locale={fr}
                  startMonth={minDate}
                  endMonth={addDays(today, 90)}
                />
              </div>

              {date && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                  <h3 className="font-semibold text-[#1e3a5f] mb-4">
                    Créneaux disponibles — {format(date, "EEEE d MMMM", { locale: fr })}
                  </h3>
                  {loadingSlots ? (
                    <p className="text-gray-400 text-sm">Chargement des disponibilités…</p>
                  ) : creneauxDispo.length === 0 ? (
                    <p className="text-gray-500 text-sm">Aucun créneau disponible ce jour. Choisissez une autre date.</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {creneauxDispo.map((c) => (
                        <button key={c} onClick={() => setCreneau(c)}
                          className={`py-3 rounded-lg border-2 font-semibold text-sm transition-all ${creneau === c ? "border-[#c0392b] bg-[#c0392b] text-white" : "border-gray-200 hover:border-[#1e3a5f] text-[#1e3a5f]"}`}>
                          {c}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 border-2 border-gray-200 text-gray-600 hover:border-[#1e3a5f] py-3 rounded-xl font-semibold transition-colors">
                  Retour
                </button>
                <button onClick={() => setStep(3)} disabled={!date || !creneau}
                  className="flex-1 bg-[#c0392b] hover:bg-[#a93226] disabled:opacity-40 text-white py-3 rounded-xl font-semibold transition-colors">
                  Continuer
                </button>
              </div>
            </div>
          )}

          {/* Étape 3 — Coordonnées */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-[#1e3a5f] mb-2">Vos coordonnées</h2>
              <div className="bg-[#c0392b]/10 border border-[#c0392b]/20 rounded-xl p-4 mb-6 text-sm text-[#1e3a5f]">
                <strong>{SERVICES.find(s => s.id === service)?.label}</strong> — {date && format(date, "EEEE d MMMM yyyy", { locale: fr })} à <strong>{creneau}</strong>
              </div>
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: "prenom", label: "Prénom", required: true },
                    { name: "nom", label: "Nom", required: true },
                  ].map((f) => (
                    <div key={f.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{f.label} *</label>
                      <input required={f.required} type="text" value={form[f.name as keyof typeof form]}
                        onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
                    </div>
                  ))}
                </div>
                {[
                  { name: "email", label: "Email", type: "email", required: true },
                  { name: "telephone", label: "Téléphone", type: "tel", required: true },
                  { name: "rue", label: "Rue", type: "text", required: true },
                  { name: "numero", label: "Numéro", type: "text", required: true },
                ].map((f) => (
                  <div key={f.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{f.label} *</label>
                    <input required={f.required} type={f.type} value={form[f.name as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Commune *</label>
                  <select required value={form.commune} onChange={(e) => setForm({ ...form, commune: e.target.value, communeAutre: "" })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]">
                    <option value="">Sélectionnez votre commune</option>
                    {COMMUNES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {form.commune === "Autre" && (
                    <input
                      type="text"
                      required
                      placeholder="Précisez votre commune"
                      value={form.communeAutre}
                      onChange={(e) => setForm({ ...form, communeAutre: e.target.value })}
                      className="mt-2 w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes / remarques</label>
                  <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Type de chaudière, problème constaté…"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setStep(2)} className="flex-1 border-2 border-gray-200 text-gray-600 hover:border-[#1e3a5f] py-3 rounded-xl font-semibold transition-colors">
                    Retour
                  </button>
                  <button type="submit" disabled={submitting}
                    className="flex-1 bg-[#c0392b] hover:bg-[#a93226] disabled:opacity-60 text-white py-3 rounded-xl font-semibold transition-colors">
                    {submitting ? "Envoi…" : "Confirmer le RDV"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default function ReservationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <ReservationContent />
    </Suspense>
  );
}

