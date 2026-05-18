import { useEffect, useRef, useState } from "react";
import { api } from "../lib/api";

const BookDemoModal = ({ open, onClose }) => {
  const [name, setName] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const firstFieldRef = useRef(null);

  useEffect(() => {
    if (open && firstFieldRef.current) {
      firstFieldRef.current.focus();
    }
    if (!open) {
      // Reset on close
      setError("");
      setSuccess(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await api.submitDemoRequest({
        name: name.trim(),
        restaurantName: restaurantName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim() || undefined,
      });
      setSuccess(true);
      setName("");
      setRestaurantName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#10002b]/80 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg bg-gradient-to-br from-[#240046] to-[#3c096c] border border-milk/20 rounded-3xl md:p-10 p-6 max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-milk/70 hover:text-milk hover:bg-milk/10 transition-colors text-2xl leading-none"
        >
          ×
        </button>

        {success ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gradient-to-br from-[#9d4edd] to-[#c77dff] flex items-center justify-center">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="font-sans md:text-3xl text-2xl font-bold uppercase text-milk tracking-tight mb-3">
              We&apos;re on it.
            </h2>
            <p className="font-paragraph text-milk/80 mb-6">
              Your demo request landed. Someone from Kitchyn will reach out
              within one business day.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="bg-milk text-[#10002b] font-paragraph font-bold uppercase tracking-wider rounded-full px-6 py-3 hover:bg-[#e0aaff] transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h2 className="font-sans md:text-4xl text-3xl font-bold uppercase text-milk tracking-tight mb-2 leading-none">
              Book a demo
            </h2>
            <p className="font-paragraph text-milk/70 mb-6 text-sm">
              Tell us about your restaurant. We&apos;ll show you what Kitchyn can do.
            </p>

            {error && (
              <div className="bg-red-500/20 border border-red-500/40 text-milk text-sm px-4 py-3 rounded-xl mb-4 font-paragraph">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <ModalField label="Your name" required>
                <input
                  ref={firstFieldRef}
                  type="text"
                  required
                  minLength={2}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tunde Adesina"
                  className="modal-input"
                />
              </ModalField>

              <ModalField label="Restaurant name" required>
                <input
                  type="text"
                  required
                  minLength={2}
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  placeholder="The Copper Pot"
                  className="modal-input"
                />
              </ModalField>

              <div className="grid md:grid-cols-2 gap-3">
                <ModalField label="Email" required>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@restaurant.com"
                    className="modal-input"
                  />
                </ModalField>
                <ModalField label="Phone" required>
                  <input
                    type="tel"
                    required
                    minLength={7}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 800 000 0000"
                    className="modal-input"
                  />
                </ModalField>
              </div>

              <ModalField label="Anything you'd like us to know?">
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Optional: tell us about your menu, locations, or current setup."
                  className="modal-input resize-none"
                />
              </ModalField>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-milk text-[#10002b] font-paragraph font-bold uppercase tracking-wider rounded-full md:py-4 py-3 hover:bg-[#e0aaff] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? "Sending…" : "Send request"}
                </button>
                <p className="text-xs text-milk/50 font-paragraph mt-3 text-center">
                  By submitting you agree to be contacted by Kitchyn about your demo.
                </p>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

const ModalField = ({ label, required, children }) => (
  <label className="block">
    <span className="block font-paragraph text-xs uppercase tracking-widest text-milk/60 mb-1.5">
      {label}
      {required && <span className="text-[#e0aaff] ml-0.5">*</span>}
    </span>
    {children}
  </label>
);

export default BookDemoModal;
