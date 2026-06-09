'use client';

import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'primary' | 'destructive';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'primary',
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6 py-2">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full ${variant === 'destructive' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
            <AlertTriangle size={24} />
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed pt-1">
            {message}
          </p>
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <Button variant="ghost" onClick={onClose} className="rounded-xl px-6">
            {cancelLabel}
          </Button>
          <Button 
            variant={variant === 'destructive' ? 'primary' : 'primary'} // Adjusted based on available variants in your Button.tsx
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`rounded-xl px-6 ${variant === 'destructive' ? 'bg-destructive hover:bg-destructive-hover shadow-destructive/20' : ''}`}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
