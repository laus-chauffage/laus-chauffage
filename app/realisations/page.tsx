"use client";
import { useEffect, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import Link from "next/link";

type Photo = { name: string; url: string };

export default function RealisationsPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<Photo | null>(null);
  const [previewIdx, setPreviewIdx] = useState(0);

  useEffect(() => {
    fetch("/api/admin/photos")
      .then((r) => r.json())
      .then((d) => { setPhotos(d.photos || []); setLoading(false); });
  }, []);

  useEffect(() => {
    if (!preview) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setPreview(null);
      if (e.key === "ArrowRight") setPreviewIdx((i) => Math.min(i + 1, photos.length - 1));
      if (e.key === "ArrowLeft") setPreviewIdx((i) => Math.max(i - 1, 0));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [preview, photos.length]);

  function openPreview(p: Photo) {
    const idx = photos.findIndex((x) => x.name === p.name);
    setPreviewIdx(idx);
    setPreview(p);
  }

  return (
    <>
      <section className="bg-[#1e3a5f] text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Nos réalisations</h1>
          <p className="text-gray-300 max-w-xl mx-auto">Quelques exemples de chantiers réalisés dans la région.</p>
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
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {photos.map((p) => (
                <div key={p.name} onClick={() => openPreview(p)}
                  className="break-inside-avoid cursor-pointer overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 group">
                  <img src={p.url} alt="" className="w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {preview && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setPreview(null)}>
          <button onClick={() => setPreview(null)}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors">
            <X size={32} />
          </button>

          {previewIdx > 0 && (
            <button onClick={(e) => { e.stopPropagation(); setPreviewIdx(i => i - 1); }}
              className="absolute left-4 text-white/70 hover:text-white text-3xl font-light transition-colors">
              ‹
            </button>
          )}

          <img src={photos[previewIdx]?.url} alt=""
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full max-h-[85vh] object-contain rounded-xl" />

          {previewIdx < photos.length - 1 && (
            <button onClick={(e) => { e.stopPropagation(); setPreviewIdx(i => i + 1); }}
              className="absolute right-4 text-white/70 hover:text-white text-3xl font-light transition-colors">
              ›
            </button>
          )}

          <p className="absolute bottom-4 text-white/40 text-xs">{previewIdx + 1} / {photos.length}</p>
        </div>
      )}
    </>
  );
}
