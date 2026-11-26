import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  // Esc tugmasi bilan yopish va orqa fon scroll'ini to'xtatish
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-slate-950/50 animate-fade-in"
      style={{ WebkitBackdropFilter: 'blur(14px) saturate(140%)', backdropFilter: 'blur(14px) saturate(140%)' }}
      onClick={onClose}
    >
      <div
        className="glass-strong rounded-[32px] w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-scale-in"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex justify-between items-center px-6 py-5 sticky top-0 z-10 rounded-t-[32px] border-b border-slate-900/5 dark:border-white/10 bg-white/60 dark:bg-slate-900/60" style={{ WebkitBackdropFilter: 'blur(20px)', backdropFilter: 'blur(20px)' }}>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h2>
          <button onClick={onClose} className="btn-glass p-2 rounded-full group" aria-label="Yopish">
            <X size={22} className="text-slate-500 dark:text-slate-300 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>
        <div className="p-5 sm:p-6">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
