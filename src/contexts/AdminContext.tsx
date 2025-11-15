import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Credenciais administrativas
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'Cvgratis@917705'
};

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  // Verificar se já está logado ao carregar
  useEffect(() => {
    const adminStatus = localStorage.getItem('cvgratis-admin-logged');
    if (adminStatus === 'true') {
      setIsAdmin(true);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setIsAdmin(true);
      localStorage.setItem('cvgratis-admin-logged', 'true');
      console.log('✅ Admin logged in successfully');
      return true;
    }
    console.log('❌ Invalid admin credentials');
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('cvgratis-admin-logged');
    // Limpar flags administrativas de acesso premium
    localStorage.removeItem('admin-mode-enabled');
    localStorage.removeItem('admin-viewing-premium');
    console.log('🚪 Admin logged out - flags administrativas removidas');
  };

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
