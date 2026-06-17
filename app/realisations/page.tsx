"use client";
import { useEffect, useState } from "react";
import { ImagePlus } from "lucide-react";
import Link from "next/link";

type Photo = { name: string; url: string };

export default function RealisationsPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/photos")
      .then((r) => r.json())
      .then((d) => { setPhotos(d.photos || []); setLoading(false); });
  }, []);

  function getLabel(name: string) {
    return name.replace(/^\d+-/, "").replace(/\.[^.]+$/, "").replace(/-/g, " ");
  }

  return (
    <>
      <section className="bg-[#1e3a5f] text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Nos réalisations</h1>
          <p className="text-gray-300 max-w-xl mx-auto">
            Quelques exemples de chantiers réalisés dans la région.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          {loading ? (
            <div className="text-center py-16 text-gray-400">Chargement…</div>
          ) : photos.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <ImagePlus size={48} className="mx-auto mb-4 opacity-30" />
              <p>Aucune photo pour le moment.</p>
              <Link href="/admin" className="text-[#c0392b] text-sm mt-2 inline-block">Ajouter des photos depuis l'admin</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {photos.map((p) => (
                <div key={p.name} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                  <div className="h-56 overflow-hidden">
                    <img src={p.url} alt={getLabel(p.name)} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-4">
                    <p className="font-medium text-[#1e3a5f] text-sm capitalize">{getLabel(p.name)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

