"use client";
import { useState, useEffect } from "react";
import { Calendar, Bell, Plus, Send, Printer, ImagePlus, Trash2, XCircle, CheckCircle, ClipboardCheck, Clock, Upload, Pencil, MailCheck } from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";

type Client = {
  id: string;
  prenom: string;
  nom: string;
  email: string | null;
  telephone: string;
  adresse: string;
  commune: string;
  type_chaudiere: "mazout" | "gaz";
  dernier_entretien: string;
  prochain_entretien: string;
  mode_contact: "email" | "courrier";
  statut: "ok" | "bientot" | "en_retard";
};

type Reservation = {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
  commune: string;
  service: string;
  date: string;
  creneau: string;
  notes: string;
  statut: string;
  google_event_id: string | null;
};

function ReservationCard({ r, cancelling, onCancel }: { r: Reservation; cancelling: string | null; onCancel: (id: string) => void }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border p-4 ${r.statut === "annule" ? "border-red-100 opacity-60" : "border-gray-100"}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <p className="font-semibold text-[#1e3a5f]">{r.prenom} {r.nom}</p>
            {r.statut === "confirme" && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle size={11} />Confirmé</span>}
            {r.statut === "annule" && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full flex items-center gap-1"><XCircle size={11} />Annulé</span>}
            {r.statut === "en_attente" && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">En attente de confirmation</span>}
          </div>
          <p className="text-sm font-medium text-gray-700">{r.date} à {r.creneau}</p>
          <p className="text-sm text-gray-500">{r.service}</p>
          <p className="text-xs text-gray-400">{r.adresse}, {r.commune}</p>
          {r.notes && <p className="text-xs text-gray-400 mt-1 italic">"{r.notes}"</p>}
        </div>
        <div className="flex gap-2 text-sm flex-wrap shrink-0">
          <a href={`tel:${r.telephone}`} className="border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 text-gray-600 text-xs">{r.telephone}</a>
          <a href={`mailto:${r.email}`} className="border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 text-gray-600 text-xs">Email</a>
          {r.statut !== "annule" && (
            <button onClick={() => onCancel(r.id)} disabled={cancelling === r.id}
              className="flex items-center gap-1.5 border border-red-200 text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg disabled:opacity-60 text-xs">
              <XCircle size={13} />
              {cancelling === r.id ? "…" : "Annuler"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ReservationsPanel({ reservations, cancelling, onCancel }: {
  reservations: Reservation[];
  cancelling: string | null;
  onCancel: (id: string) => void;
}) {
  const [vue, setVue] = useState<"avenir" | "attente" | "passes" | "annules">("avenir");
  const today = new Date().toISOString().split("T")[0];

  const avenir = reservations.filter(r => r.date >= today && r.statut === "confirme");
  const attente = reservations.filter(r => r.statut === "en_attente");
  const passes = reservations.filter(r => r.date < today && r.statut === "confirme");
  const annules = reservations.filter(r => r.statut === "annule");

  const vues = [
    { id: "avenir", label: "À venir", count: avenir.length, color: "bg-green-500" },
    { id: "attente", label: "En attente", count: attente.length, color: "bg-yellow-500" },
    { id: "passes", label: "Passés", count: passes.length, color: "bg-gray-400" },
    { id: "annules", label: "Annulés", count: annules.length, color: "bg-red-400" },
  ] as const;

  const liste = vue === "avenir" ? avenir : vue === "attente" ? attente : vue === "passes" ? passes : annules;

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {vues.map((v) => (
          <button key={v.id} onClick={() => setVue(v.id)}
            className={`bg-white rounded-xl border p-4 text-left transition-all ${vue === v.id ? "border-[#1e3a5f] shadow-md" : "border-gray-100 hover:border-gray-300"}`}>
            <div className={`w-2 h-2 rounded-full ${v.color} mb-2`} />
            <p className="text-2xl font-bold text-[#1e3a5f]">{v.count}</p>
            <p className="text-xs text-gray-500">{v.label}</p>
          </button>
        ))}
      </div>

      {/* Liste */}
      <div className="space-y-3">
        {liste.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center text-gray-400 border border-gray-100">
            Aucun rendez-vous dans cette catégorie.
          </div>
        ) : (
          liste.map((r) => (
            <ReservationCard key={r.id} r={r} cancelling={cancelling} onCancel={onCancel} />
          ))
        )}
      </div>
    </div>
  );
}

const tabs = [
  { id: "reservations", label: "Réservations", icon: <Calendar size={18} /> },
  { id: "creneaux", label: "Créneaux", icon: <Clock size={18} /> },
  { id: "clients", label: "Clients & rappels", icon: <Bell size={18} /> },
  { id: "photos", label: "Photos", icon: <ImagePlus size={18} /> },
];

const STATUT_COLORS = {
  ok: "bg-green-100 text-green-700",
  bientot: "bg-yellow-100 text-yellow-700",
  en_retard: "bg-red-100 text-red-700",
};

const STATUT_LABELS = {
  ok: "À jour",
  bientot: "Rappel bientôt",
  en_retard: "En retard",
};

export default function AdminPage() {
  const [tab, setTab] = useState("reservations");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewClient, setShowNewClient] = useState(false);
  const [newClient, setNewClient] = useState({
    civilite: "M", prenom: "", nom: "", email: "", telephone: "", adresse: "", code_postal: "", commune: "",
    type_chaudiere: "mazout", dernier_entretien: "", mode_contact: "email",
  });
  const [filtreStatut, setFiltreStatut] = useState("tous");
  const [sending, setSending] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [marquerFait, setMarquerFait] = useState<string | null>(null);
  const [dateEntretien, setDateEntretien] = useState<Record<string, string>>({});
  const [editingClient, setEditingClient] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Client>>({});
  const [savingClient, setSavingClient] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ inserted: number; skipped: number; error?: string } | null>(null);
  const [rappelsMois, setRappelsMois] = useState<{ clients: Client[]; mois: string } | null>(null);
  const [loadingRappels, setLoadingRappels] = useState(false);
  const [sendingBatch, setSendingBatch] = useState(false);
  const [batchResult, setBatchResult] = useState<{ sent: number; failed: number; skipped: number; printed?: boolean } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  function showToast(message: string, type: "success" | "error" = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }
  const [modal, setModal] = useState<{ open: boolean; title: string; message: string; confirmLabel: string; confirmColor: "red" | "green" | "orange"; onConfirm: () => void }>({
    open: false, title: "", message: "", confirmLabel: "Confirmer", confirmColor: "orange", onConfirm: () => {},
  });

  function openModal(opts: { title: string; message: string; confirmLabel?: string; confirmColor?: "red" | "green" | "orange"; onConfirm: () => void }) {
    setModal({ open: true, confirmLabel: "Confirmer", confirmColor: "orange", ...opts });
  }
  function closeModal() { setModal(m => ({ ...m, open: false })); }
  const [photos, setPhotos] = useState<{ name: string; url: string }[]>([]);
  const [uploadLabel, setUploadLabel] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dispos, setDispos] = useState<{ id: number; service_type: string; jour: number; heure: string; actif: boolean }[]>([]);
  const [togglingDispo, setTogglingDispo] = useState<string | null>(null);
  const [showProheatSync, setShowProheatSync] = useState(false);
  const [proheatKey, setProheatKey] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ created: number; updated: number; skipped: number; total: number; error?: string } | null>(null);
  const [selectedClients, setSelectedClients] = useState<Set<string>>(new Set());
  const [deletingBatch, setDeletingBatch] = useState(false);

  useEffect(() => {
    fetchData();
    fetchPhotos();
    fetchCreneaux();
  }, []);

  async function fetchData() {
    setLoading(true);
    const [resRes, cliRes] = await Promise.all([
      fetch("/api/admin/reservations"),
      fetch("/api/admin/clients"),
    ]);
    const resData = await resRes.json();
    const cliData = await cliRes.json();
    setReservations(resData.reservations || []);
    setClients(cliData.clients || []);
    setLoading(false);
  }

  async function fetchCreneaux() {
    const res = await fetch("/api/admin/disponibilites");
    const data = await res.json();
    setDispos(data.disponibilites || []);
  }

  async function toggleDispo(service_type: string, jour: number, heure: string, actif: boolean) {
    const key = `${service_type}-${jour}-${heure}`;
    setTogglingDispo(key);
    await fetch("/api/admin/disponibilites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ service_type, jour, heure, actif }),
    });
    setDispos(prev => prev.map(d =>
      d.service_type === service_type && d.jour === jour && d.heure === heure ? { ...d, actif } : d
    ));
    setTogglingDispo(null);
  }

  const JOURS_LABELS: Record<number, string> = { 1: "Lun", 2: "Mar", 3: "Mer", 4: "Jeu", 5: "Ven" };

  async function fetchPhotos() {
    const res = await fetch("/api/admin/photos");
    const data = await res.json();
    setPhotos(data.photos || []);
  }

  async function uploadPhoto(e: React.FormEvent) {
    e.preventDefault();
    if (!uploadFile || !uploadLabel) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", uploadFile);
    form.append("label", uploadLabel);
    await fetch("/api/admin/photos/upload", { method: "POST", body: form });
    setUploadLabel("");
    setUploadFile(null);
    setUploading(false);
    fetchPhotos();
  }

  async function deletePhoto(name: string) {
    openModal({
      title: "Supprimer la photo",
      message: "Cette photo sera définitivement supprimée.",
      confirmLabel: "Supprimer",
      confirmColor: "red",
      onConfirm: async () => {
        closeModal();
        await fetch("/api/admin/photos", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        });
        fetchPhotos();
      },
    });
  }

  async function cancelReservation(id: string) {
    openModal({
      title: "Annuler le rendez-vous",
      message: "Ce rendez-vous sera annulé et supprimé de Google Calendar. Cette action est irréversible.",
      confirmLabel: "Oui, annuler",
      confirmColor: "red",
      onConfirm: async () => {
        closeModal();
        setCancelling(id);
        await fetch("/api/admin/reservations/annuler", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        setCancelling(null);
        fetchData();
      },
    });
  }

  async function addClient(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newClient),
    });
    setShowNewClient(false);
    setNewClient({ civilite: "M", prenom: "", nom: "", email: "", telephone: "", adresse: "", code_postal: "", commune: "", type_chaudiere: "mazout", dernier_entretien: "", mode_contact: "email" });
    fetchData();
  }

  async function enregistrerEntretien(clientId: string) {
    const date = dateEntretien[clientId] || new Date().toISOString().split("T")[0];
    openModal({
      title: "Entretien effectué",
      message: `Confirmer que l'entretien a été réalisé le ${date} ? Le prochain rappel sera recalculé automatiquement.`,
      confirmLabel: "Oui, enregistrer",
      confirmColor: "green",
      onConfirm: async () => {
        closeModal();
        setMarquerFait(clientId);
        await fetch("/api/admin/clients/entretien", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clientId, date_entretien: date }),
        });
        await fetch("/api/satisfaction", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clientId }),
        });
        setMarquerFait(null);
        showToast("Entretien enregistré — email de satisfaction envoyé ✓");
        fetchData();
      },
    });
  }

  async function sendRappel(clientId: string) {
    setSending(clientId);
    await fetch("/api/rappels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId }),
    });
    setSending(null);
    showToast("Rappel envoyé ✓");
  }

  async function printRappel(client: Client) {
    await fetch("/api/rappels/print", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: client.id }),
    });
    window.open(`/api/rappels/print?clientId=${client.id}`, "_blank");
  }

  const clientsFiltres = clients.filter(c => filtreStatut === "tous" || c.statut === filtreStatut);

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && (
        <div className={`fixed top-52 right-8 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-white font-semibold text-sm ${toast.type === "success" ? "bg-[#1e3a5f]" : "bg-[#c0392b]"}`}
          style={{ minWidth: 220 }}>
          {toast.type === "success" ? <CheckCircle size={18} /> : <XCircle size={18} />}
          {toast.message}
        </div>
      )}
      <ConfirmModal
        open={modal.open}
        title={modal.title}
        message={modal.message}
        confirmLabel={modal.confirmLabel}
        confirmColor={modal.confirmColor}
        onConfirm={modal.onConfirm}
        onCancel={closeModal}
      />
      <div className="bg-[#1e3a5f] text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">Interface Admin — Laus Chauffage</h1>
          <p className="text-gray-300 text-sm">Gestion des réservations et rappels clients</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 shadow-sm border border-gray-100 w-fit">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.id ? "bg-[#1e3a5f] text-white" : "text-gray-500 hover:text-[#1e3a5f]"}`}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Chargement…</div>
        ) : (
          <>
            {/* Réservations */}
            {tab === "reservations" && (
              <div>
                <ReservationsPanel
                  reservations={reservations}
                  cancelling={cancelling}
                  onCancel={cancelReservation}
                />
              </div>
            )}

            {/* Clients & rappels */}
            {tab === "clients" && (
              <div>

                {/* Panneau rappels du mois prochain */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-bold text-[#1e3a5f] text-lg">Rappels du mois prochain</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Clients dont l'entretien arrive à échéance le mois suivant.</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={async () => {
                        setLoadingRappels(true);
                        setBatchResult(null);
                        const res = await fetch("/api/rappels/batch");
                        const data = await res.json();
                        setRappelsMois(data);
                        setLoadingRappels(false);
                      }} className="flex items-center gap-2 border border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                        <Bell size={15} />{loadingRappels ? "Chargement…" : "Voir les rappels"}
                      </button>
                      {rappelsMois && (
                        <button onClick={() => { setRappelsMois(null); setBatchResult(null); }} className="border border-gray-200 text-gray-400 hover:text-gray-600 px-3 py-2 rounded-lg text-sm transition-colors">✕</button>
                      )}
                    </div>
                  </div>

                  {rappelsMois && (
                    <div>
                      <p className="text-sm font-semibold text-[#1e3a5f] mb-3">
                        {rappelsMois.clients.length} client(s) à relancer en <span className="capitalize">{rappelsMois.mois}</span>
                      </p>

                      {rappelsMois.clients.length > 0 && (
                        <>
                          <div className="divide-y divide-gray-100 mb-4 border border-gray-100 rounded-xl overflow-hidden">
                            {rappelsMois.clients.map((c: any) => {
                              const envoyes = c.rappels_envoyes || {};
                              const dejaSent = envoyes.email || envoyes.courrier;
                              return (
                                <div key={c.id} className={`flex items-center justify-between px-4 py-2.5 text-sm ${dejaSent ? "bg-green-50" : "bg-gray-50"}`}>
                                  <div>
                                    <span className="font-medium text-[#1e3a5f]">{c.prenom} {c.nom}</span>
                                    <span className="text-gray-400 ml-2 text-xs">— {c.type_chaudiere} — {c.prochain_entretien}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {envoyes.email && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">✓ Email envoyé</span>}
                                    {envoyes.courrier && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">✓ Courrier imprimé</span>}
                                    {!dejaSent && (
                                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.mode_contact === "email" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}>
                                        {c.mode_contact === "email" ? "Email" : "Courrier"}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className="flex flex-wrap gap-3">
                            <button disabled={sendingBatch} onClick={() => {
                              openModal({
                                title: "Envoyer les rappels email",
                                message: `Envoyer un email de rappel à tous les clients (email) du mois prochain ?`,
                                confirmLabel: "Envoyer",
                                confirmColor: "orange",
                                onConfirm: async () => {
                                  closeModal();
                                  setSendingBatch(true);
                                  setBatchResult(null);
                                  const res = await fetch("/api/rappels/batch", { method: "POST" });
                                  const data = await res.json();
                                  setBatchResult({ ...data, printed: false });
                                  setSendingBatch(false);
                                },
                              });
                            }} className="flex items-center gap-2 bg-[#c0392b] hover:bg-[#a93226] text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-60 transition-colors">
                              <MailCheck size={15} />{sendingBatch ? "Envoi en cours…" : "Envoyer tous les emails"}
                            </button>
                            <button onClick={() => { window.open("/api/rappels/print-batch", "_blank"); setBatchResult({ sent: 0, failed: 0, skipped: 0, printed: true }); }}
                              className="flex items-center gap-2 border border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                              <Printer size={15} />Imprimer tous les courriers
                            </button>
                          </div>

                          {batchResult && (
                            <div className={`mt-3 rounded-xl px-4 py-3 text-sm ${batchResult.failed > 0 ? "bg-red-50 border border-red-200 text-red-700" : "bg-green-50 border border-green-200 text-green-700"}`}>
                              {batchResult.printed
                                ? "✅ Courriers envoyés à l'impression."
                                : <>✅ {batchResult.sent} email(s) envoyé(s){batchResult.failed > 0 ? `, ${batchResult.failed} échec(s)` : ""}{batchResult.skipped > 0 ? `, ${batchResult.skipped} sans email` : ""}.</>
                              }
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex gap-2">
                    {["tous", "en_retard", "bientot", "ok"].map((s) => (
                      <button key={s} onClick={() => setFiltreStatut(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${filtreStatut === s ? "bg-[#1e3a5f] text-white border-[#1e3a5f]" : "border-gray-200 text-gray-500 hover:border-[#1e3a5f]"}`}>
                        {s === "tous" ? "Tous" : STATUT_LABELS[s as keyof typeof STATUT_LABELS]}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <label className={`flex items-center gap-2 border border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${importing ? "opacity-50 pointer-events-none" : ""}`}>
                      <Upload size={16} />
                      {importing ? "Import…" : "Import Google CSV"}
                      <input type="file" accept=".csv" className="hidden" onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setImporting(true);
                        setImportResult(null);
                        const text = await file.text();
                        const res = await fetch("/api/admin/clients/import", { method: "POST", body: text });
                        const data = await res.json();
                        setImportResult(res.ok ? data : { inserted: 0, skipped: 0, error: data.error });
                        setImporting(false);
                        fetchData();
                        e.target.value = "";
                      }} />
                    </label>
                    <button onClick={() => { setShowProheatSync(!showProheatSync); setSyncResult(null); }}
                      className="flex items-center gap-2 border border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
                      Sync ProHeat
                    </button>
                    <button onClick={() => setShowNewClient(!showNewClient)}
                      className="flex items-center gap-2 bg-[#c0392b] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#a93226] transition-colors">
                      <Plus size={16} />Nouveau client
                    </button>
                  </div>
                </div>

                {showProheatSync && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                    <p className="text-sm font-semibold text-[#1e3a5f] mb-2">Synchronisation ProHeat / Testo</p>
                    <p className="text-xs text-gray-500 mb-3">Entrez votre clé API ProHeat (disponible dans Pro+ → Paramètres → API).</p>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        placeholder="X-expose-secret-key"
                        value={proheatKey}
                        onChange={(e) => setProheatKey(e.target.value)}
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                      />
                      <button
                        disabled={!proheatKey || syncing}
                        onClick={async () => {
                          setSyncing(true);
                          setSyncResult(null);
                          const res = await fetch("/api/admin/proheat-sync", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ secretKey: proheatKey }),
                          });
                          const data = await res.json();
                          setSyncResult(res.ok ? data : { created: 0, updated: 0, skipped: 0, total: 0, error: data.error });
                          setSyncing(false);
                          if (res.ok) { fetchData(); setShowProheatSync(false); }
                        }}
                        className="bg-[#1e3a5f] text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-40 hover:bg-[#2a4f80] transition-colors"
                      >
                        {syncing ? "Sync…" : "Lancer"}
                      </button>
                    </div>
                  </div>
                )}

                {syncResult && (
                  <div className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm mb-2 ${syncResult.error ? "bg-red-50 border border-red-200 text-red-700" : "bg-green-50 border border-green-200 text-green-700"}`}>
                    <span>{syncResult.error ? `Erreur : ${syncResult.error}` : `Sync OK — ${syncResult.created} créé(s), ${syncResult.updated} mis à jour, ${syncResult.skipped} ignoré(s) sur ${syncResult.total} clients ProHeat.`}</span>
                    <button onClick={() => setSyncResult(null)} className="text-gray-400 hover:text-gray-600"><XCircle size={16} /></button>
                  </div>
                )}

                {importResult && (
                  <div className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm mb-2 ${importResult.error ? "bg-red-50 border border-red-200 text-red-700" : importResult.inserted > 0 ? "bg-green-50 border border-green-200 text-green-700" : "bg-yellow-50 border border-yellow-200 text-yellow-700"}`}>
                    <span>{importResult.error ? `Erreur : ${importResult.error}` : `${importResult.inserted} client(s) importé(s)${importResult.skipped > 0 ? `, ${importResult.skipped} ignoré(s) (doublon)` : ""}.`}</span>
                    <button onClick={() => setImportResult(null)} className="text-gray-400 hover:text-gray-600"><XCircle size={16} /></button>
                  </div>
                )}

                {/* Formulaire nouveau client */}
                {showNewClient && (
                  <form onSubmit={addClient} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                    <h3 className="font-bold text-[#1e3a5f] mb-4">Ajouter un client</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Civilité</label>
                        <div className="flex gap-3">
                          {["M", "Mme"].map((v) => (
                            <label key={v} className="flex items-center gap-2 cursor-pointer">
                              <input type="radio" name="civilite_new" value={v}
                                checked={(newClient as any).civilite === v}
                                onChange={() => setNewClient({ ...newClient, civilite: v })}
                                className="accent-[#1e3a5f]" />
                              <span className="text-sm">{v === "M" ? "Monsieur" : "Madame"}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      {[
                        { name: "prenom", label: "Prénom" },
                        { name: "nom", label: "Nom" },
                        { name: "telephone", label: "Téléphone" },
                        { name: "email", label: "Email (optionnel)", required: false },
                        { name: "adresse", label: "Adresse" },
                        { name: "code_postal", label: "Code postal" },
                        { name: "commune", label: "Commune" },
                      ].map((f) => (
                        <div key={f.name}>
                          <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
                          <input type="text" required={f.required !== false}
                            value={(newClient as any)[f.name]}
                            onChange={(e) => setNewClient({ ...newClient, [f.name]: e.target.value })}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
                        </div>
                      ))}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Type de chaudière</label>
                        <select value={newClient.type_chaudiere} onChange={(e) => setNewClient({ ...newClient, type_chaudiere: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]">
                          <option value="mazout">Mazout (rappel annuel)</option>
                          <option value="gaz">Gaz (rappel tous les 2 ans)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Date dernier entretien</label>
                        <input type="date" required value={newClient.dernier_entretien}
                          onChange={(e) => setNewClient({ ...newClient, dernier_entretien: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Mode de contact</label>
                        <select value={newClient.mode_contact} onChange={(e) => setNewClient({ ...newClient, mode_contact: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]">
                          <option value="email">Email</option>
                          <option value="courrier">Courrier postal</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button type="button" onClick={() => setShowNewClient(false)} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm">Annuler</button>
                      <button type="submit" className="flex-1 bg-[#1e3a5f] text-white py-2 rounded-lg text-sm font-semibold">Ajouter</button>
                    </div>
                  </form>
                )}

                {/* Liste clients */}
                {selectedClients.size > 0 && (
                  <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-3">
                    <span className="text-sm font-medium text-red-700">{selectedClients.size} client(s) sélectionné(s)</span>
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedClients(new Set())} className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 bg-white">
                        Désélectionner
                      </button>
                      <button
                        disabled={deletingBatch}
                        onClick={() => openModal({
                          title: "Supprimer les clients sélectionnés",
                          message: `Supprimer définitivement ${selectedClients.size} client(s) ? Cette action est irréversible.`,
                          confirmLabel: "Supprimer",
                          confirmColor: "red",
                          onConfirm: async () => {
                            closeModal();
                            setDeletingBatch(true);
                            await Promise.all(
                              [...selectedClients].map((id) =>
                                fetch("/api/admin/clients", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })
                              )
                            );
                            setSelectedClients(new Set());
                            setDeletingBatch(false);
                            fetchData();
                          },
                        })}
                        className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg disabled:opacity-50 transition-colors">
                        <Trash2 size={13} />{deletingBatch ? "Suppression…" : "Supprimer la sélection"}
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {clientsFiltres.length === 0 ? (
                    <div className="bg-white rounded-2xl p-10 text-center text-gray-400 border border-gray-100">Aucun client.</div>
                  ) : (
                    clientsFiltres.map((c) => (
                      <div key={c.id} className={`bg-white rounded-xl shadow-sm border p-4 transition-colors ${selectedClients.has(c.id) ? "border-red-300 bg-red-50/30" : "border-gray-100"}`}>
                        {editingClient === c.id ? (
                          /* Mode édition */
                          <div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                              <div className="sm:col-span-2">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Civilité</label>
                                <div className="flex gap-3">
                                  {["M", "Mme"].map((v) => (
                                    <label key={v} className="flex items-center gap-2 cursor-pointer">
                                      <input type="radio" name={`civilite_edit_${c.id}`} value={v}
                                        checked={(editForm as any).civilite === v}
                                        onChange={() => setEditForm(prev => ({ ...prev, civilite: v }))}
                                        className="accent-[#1e3a5f]" />
                                      <span className="text-sm">{v === "M" ? "Monsieur" : "Madame"}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                              {([
                                { name: "prenom", label: "Prénom" },
                                { name: "nom", label: "Nom" },
                                { name: "telephone", label: "Téléphone" },
                                { name: "email", label: "Email" },
                                { name: "adresse", label: "Adresse" },
                                { name: "code_postal", label: "Code postal" },
                                { name: "commune", label: "Commune" },
                              ] as const).map((f) => (
                                <div key={f.name}>
                                  <label className="block text-xs font-medium text-gray-500 mb-1">{f.label}</label>
                                  <input type="text"
                                    value={(editForm as any)[f.name] ?? ""}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, [f.name]: e.target.value }))}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
                                </div>
                              ))}
                              <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Type chaudière</label>
                                <select value={editForm.type_chaudiere ?? "mazout"}
                                  onChange={(e) => setEditForm(prev => ({ ...prev, type_chaudiere: e.target.value as "mazout" | "gaz" }))}
                                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]">
                                  <option value="mazout">Mazout</option>
                                  <option value="gaz">Gaz</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Dernier entretien</label>
                                <input type="date"
                                  value={editForm.dernier_entretien ?? ""}
                                  onChange={(e) => setEditForm(prev => ({ ...prev, dernier_entretien: e.target.value }))}
                                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Mode de contact</label>
                                <select value={editForm.mode_contact ?? "email"}
                                  onChange={(e) => setEditForm(prev => ({ ...prev, mode_contact: e.target.value as "email" | "courrier" }))}
                                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]">
                                  <option value="email">Email</option>
                                  <option value="courrier">Courrier postal</option>
                                </select>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => setEditingClient(null)} className="flex-1 border border-gray-200 text-gray-500 py-1.5 rounded-lg text-xs">Annuler</button>
                              <button disabled={savingClient} onClick={async () => {
                                setSavingClient(true);
                                await fetch("/api/admin/clients", {
                                  method: "PUT",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ id: c.id, ...editForm }),
                                });
                                setSavingClient(false);
                                setEditingClient(null);
                                fetchData();
                              }} className="flex-1 bg-[#1e3a5f] text-white py-1.5 rounded-lg text-xs font-semibold disabled:opacity-60">
                                {savingClient ? "Enregistrement…" : "Enregistrer"}
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* Mode affichage */
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 flex-wrap min-w-0">
                              <input
                                type="checkbox"
                                checked={selectedClients.has(c.id)}
                                onChange={(e) => {
                                  const next = new Set(selectedClients);
                                  e.target.checked ? next.add(c.id) : next.delete(c.id);
                                  setSelectedClients(next);
                                }}
                                className="w-4 h-4 accent-[#c0392b] shrink-0 cursor-pointer"
                              />
                              <p className="font-semibold text-[#1e3a5f] text-sm">{c.prenom} {c.nom}</p>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${STATUT_COLORS[c.statut]}`}>{STATUT_LABELS[c.statut]}</span>
                              <span className="text-xs text-gray-400 hidden sm:inline">{c.commune}</span>
                              <span className="text-xs text-gray-400 hidden md:inline">{c.type_chaudiere} — prochain : {c.prochain_entretien || "—"}</span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <input type="date"
                                defaultValue={new Date().toISOString().split("T")[0]}
                                onChange={(e) => setDateEntretien(prev => ({ ...prev, [c.id]: e.target.value }))}
                                className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#1e3a5f] w-32" />
                              <button onClick={() => enregistrerEntretien(c.id)} disabled={marquerFait === c.id} title="Entretien fait"
                                className="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg disabled:opacity-60">
                                <ClipboardCheck size={14} />
                              </button>
                              {c.mode_contact === "email" ? (
                                <button onClick={() => sendRappel(c.id)} disabled={sending === c.id} title="Envoyer rappel"
                                  className="p-1.5 bg-[#c0392b] hover:bg-[#a93226] text-white rounded-lg disabled:opacity-60">
                                  <Send size={14} />
                                </button>
                              ) : (
                                <button onClick={() => printRappel(c)} title="Imprimer courrier"
                                  className="p-1.5 border border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white rounded-lg transition-colors">
                                  <Printer size={14} />
                                </button>
                              )}
                              <button onClick={() => { setEditingClient(c.id); setEditForm({ ...c }); }} title="Modifier"
                                className="p-1.5 border border-gray-200 text-gray-400 hover:border-[#1e3a5f] hover:text-[#1e3a5f] rounded-lg transition-colors">
                                <Pencil size={14} />
                              </button>
                              <button onClick={() => openModal({
                                title: "Supprimer le client",
                                message: `Supprimer définitivement ${c.prenom} ${c.nom} ?`,
                                confirmLabel: "Supprimer",
                                confirmColor: "red",
                                onConfirm: async () => {
                                  closeModal();
                                  await fetch("/api/admin/clients", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: c.id }) });
                                  fetchData();
                                },
                              })} title="Supprimer" className="p-1.5 border border-red-200 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
            {/* Photos */}
            {tab === "photos" && (
              <div>
                <form onSubmit={uploadPhoto} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                  <h3 className="font-bold text-[#1e3a5f] mb-4">Ajouter une photo</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Légende</label>
                      <input type="text" required value={uploadLabel}
                        onChange={(e) => setUploadLabel(e.target.value)}
                        placeholder="Ex: Chaudière gaz Viessmann"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Fichier (jpg, png)</label>
                      <input type="file" required accept="image/*"
                        onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
                    </div>
                  </div>
                  <button type="submit" disabled={uploading}
                    className="mt-4 bg-[#c0392b] hover:bg-[#a93226] disabled:opacity-60 text-white px-6 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
                    <ImagePlus size={16} />
                    {uploading ? "Upload en cours…" : "Ajouter la photo"}
                  </button>
                </form>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {photos.length === 0 ? (
                    <div className="col-span-4 bg-white rounded-2xl p-10 text-center text-gray-400 border border-gray-100">
                      Aucune photo. Ajoutez-en une ci-dessus.
                    </div>
                  ) : (
                    photos.map((p) => (
                      <div key={p.name} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <img src={p.url} alt={p.name} className="w-full h-36 object-cover" />
                        <div className="p-2 flex items-center justify-between gap-2">
                          <p className="text-xs text-gray-500 truncate">{p.name}</p>
                          <button onClick={() => deletePhoto(p.name)}
                            className="text-red-400 hover:text-red-600 shrink-0">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {tab === "creneaux" && (
              <div className="space-y-8">
                <p className="text-sm text-gray-500">Cliquez sur une case pour activer ou désactiver ce créneau. Les changements sont immédiats.</p>
                {(["entretien", "devis"] as const).map((type) => {
                  const typeDispos = dispos.filter(d => d.service_type === type);
                  const heures = [...new Set(typeDispos.map(d => d.heure))].sort();
                  const joursList = [1, 2, 3, 4, 5];
                  return (
                    <div key={type} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                      <h3 className="font-bold text-[#1e3a5f] text-lg mb-1">
                        {type === "entretien" ? "Entretien & dépannage" : "Devis"}
                      </h3>
                      <p className="text-xs text-gray-400 mb-6">
                        {type === "entretien" ? "Durée : 2h par créneau" : "Durée : 1h par créneau"}
                      </p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr>
                              <th className="text-left text-xs text-gray-400 font-medium pb-3 pr-4 w-16"></th>
                              {joursList.map(j => (
                                <th key={j} className="text-center text-xs font-semibold text-[#1e3a5f] pb-3 px-2">
                                  {JOURS_LABELS[j]}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {heures.map(heure => (
                              <tr key={heure}>
                                <td className="text-xs font-semibold text-gray-500 pr-4 py-1.5">{heure}</td>
                                {joursList.map(jour => {
                                  const dispo = typeDispos.find(d => d.jour === jour && d.heure === heure);
                                  if (!dispo) return <td key={jour} className="px-2 py-1.5 text-center"><span className="inline-block w-10 h-9 rounded-lg bg-gray-50 border border-dashed border-gray-200" /></td>;
                                  const key = `${type}-${jour}-${heure}`;
                                  const busy = togglingDispo === key;
                                  return (
                                    <td key={jour} className="px-2 py-1.5 text-center">
                                      <button disabled={busy}
                                        onClick={() => toggleDispo(type, jour, heure, !dispo.actif)}
                                        className={`w-10 h-9 rounded-lg border-2 transition-all text-xs font-bold ${dispo.actif ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 bg-gray-50 text-gray-300"} ${busy ? "opacity-40" : "hover:shadow-sm"}`}>
                                        {dispo.actif ? "✓" : "–"}
                                      </button>
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}