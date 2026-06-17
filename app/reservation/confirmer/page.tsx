"use client";
import { useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function ConfirmerContent() {
  const params = useSearchParams();
  const ok = params.get("ok");
  const deja = params.get("deja");

  if (ok) {
    return (
      <div className="text-center">
        <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-[#1e3a5f] mb-2">Rendez-vous confirmé !</h1>
        <p className="text-gray-500 mb-2">Votre rendez-vous est maintenant enregistré dans notre agenda.</p>
        <p className="text-gray-500 text-sm mb-6">Vous recevrez un email et un SMS de confirmation.</p>
        <Link href="/" className="bg-[#c0392b] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#a93226] transition-colors">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  if (deja) {
    return (
      <div className="text-center">
        <CheckCircle size={64} className="text-blue-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-[#1e3a5f] mb-2">Déjà confirmé</h1>
        <p className="text-gray-500 mb-6">Ce rendez-vous a déjà été confirmé.</p>
        <Link href="/" className="bg-[#1e3a5f] text-white px-6 py-3 rounded-xl font-semibold">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center">
      <XCircle size={64} className="text-red-400 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-[#1e3a5f] mb-2">Lien invalide</h1>
      <p className="text-gray-500 mb-6">Ce lien est invalide ou a expiré. Veuillez refaire une réservation.</p>
      <Link href="/reservation" className="bg-[#c0392b] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#a93226] transition-colors">
        Nouvelle réservation
      </Link>
    </div>
  );
}

export default function ConfirmerPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full">
        <Suspense fallback={<div className="text-center text-gray-400"><Clock size={48} className="mx-auto mb-4 animate-pulse" />Chargement…</div>}>
          <ConfirmerContent />
        </Suspense>
      </div>
    </div>
  );
}

