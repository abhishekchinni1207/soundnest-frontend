import { useEffect } from "react";

export default function Modal({ open, onClose, children }) {
  /* ⌨️ ESC key close */
  useEffect(() => {
    if (!open) return;

    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div
        className="
          relative z-10
          w-full max-w-md
          rounded-xl p-6
          bg-white dark:bg-darkCard
          text-black dark:text-white
          shadow-2xl
          animate-fadeIn
        "
      >
        {children}
      </div>
    </div>
  );
}
