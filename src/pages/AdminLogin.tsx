/**
 * 🔐 PÁGINA DE LOGIN ADMINISTRATIVO
 *
 * Página dedicada para login de administradores com
 * sistema de autenticação JWT seguro.
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAdminAuth();

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  const handleLoginSuccess = () => {
    navigate('/admin', { replace: true });
  };

  return (
    <AdminLoginForm onSuccess={handleLoginSuccess} />
  );
}