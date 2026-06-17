"use client";

type Props = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmColor?: "red" | "green" | "orange";
  onConfirm: () => void;
  onCancel: () => void;
};

const COLORS = {
  red: "bg-red-500 hover:bg-red-600",
  green: "bg-green-500 hover:bg-green-600",
  orange: "bg-[#c0392b] hover:bg-[#a93226]",
};

export default function ConfirmModal({ open, title, message, confirmLabel = "Confirmer", confirmColor = "orange", onConfirm, onCancel }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 p-6 max-w-sm w-full">
        <h3 className="font-bold text-[#1e3a5f] text-lg mb-2">{title}</h3>
        <p className="text-gray-500 text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 border-2 border-gray-200 text-gray-600 hover:border-gray-300 py-2.5 rounded-xl font-semibold text-sm transition-colors">
            Annuler
          </button>
          <button onClick={onConfirm}
            className={`flex-1 ${COLORS[confirmColor]} text-white py-2.5 rounded-xl font-semibold text-sm transition-colors`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

