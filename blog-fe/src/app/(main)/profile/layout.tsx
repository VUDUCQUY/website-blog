import React from 'react';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}
