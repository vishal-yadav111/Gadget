"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, AlertTriangle, X, ShieldAlert } from "lucide-react";

export interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName?: string;
  userRole?: string;
  title?: string;
  description?: string;
}

export const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  userName,
  userRole,
  title = "Confirm Sign Out",
  description = "Are you sure you want to end your active session?",
}) => {
  // Lock body scroll and handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Dialog Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.2, ease: [0.2, 0.7, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-dialog-title"
            className="relative w-full max-w-md bg-white rounded-2xl border border-[#DDE4F3] shadow-2xl overflow-hidden z-10 my-8 p-6"
          >
            {/* Close icon button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Icon & Title */}
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center shrink-0 shadow-xs">
                <LogOut className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <h3
                  id="logout-dialog-title"
                  className="text-base font-bold font-display text-[#17284D]"
                >
                  {title}
                </h3>
                <p className="text-xs text-[#5F6A86] mt-1 leading-relaxed">
                  {description}
                </p>
              </div>
            </div>

            {/* User Session Info Box */}
            {(userName || userRole) && (
              <div className="mt-4 p-3 rounded-xl bg-[#F4F6FB] border border-[#DDE4F3] flex items-center justify-between gap-3">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-[8px] bg-[#0052CC] text-white flex items-center justify-center font-bold text-xs shrink-0 uppercase">
                    {(userName || "U").charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#17284D] truncate">
                      {userName || "Technician"}
                    </div>
                    {userRole && (
                      <div className="text-[10px] font-mono text-[#5F6A86] uppercase truncate">
                        Role: {userRole}
                      </div>
                    )}
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200/70 text-amber-700 text-[10px] font-semibold shrink-0">
                  <ShieldAlert className="w-3 h-3" />
                  Active Session
                </span>
              </div>
            )}

            <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">
              Logging out will clear your local authorization token. Any unsubmitted diagnostic forms will be reset.
            </p>

            {/* Action Buttons */}
            <div className="mt-6 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#4A5875] hover:text-[#17284D] hover:bg-slate-100 border border-[#DDE4F3] transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onConfirm();
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:translate-y-[1px] shadow-sm shadow-rose-600/30 transition-all cursor-pointer inline-flex items-center space-x-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Yes, Sign Out</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default LogoutConfirmModal;
