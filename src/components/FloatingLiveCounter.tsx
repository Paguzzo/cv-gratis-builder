import React, { useState, useEffect } from 'react';
import { Users, X } from 'lucide-react';

export default function FloatingLiveCounter() {
  const [count, setCount] = useState(47);
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Se não estiver visível, não executar
    if (!isVisible) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      
      setTimeout(() => {
        // Simula variação realista de usuários online
        const variation = Math.floor(Math.random() * 7) - 3; // -3 a +3
        setCount(prev => {
          const newCount = prev + variation;
          return Math.max(25, Math.min(89, newCount)); // Entre 25 e 89 usuários
        });
        setIsAnimating(false);
      }, 300);
      
    }, 8000 + Math.random() * 4000); // Intervalo entre 8-12 segundos

    return () => clearInterval(interval);
  }, [isVisible]);

  // Auto hide após 30 segundos para não irritar
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-slide-in-left">
      <div className={`
        bg-gradient-to-r from-green-500 to-green-600 
        text-white px-4 py-3 rounded-full shadow-xl
        flex items-center gap-2 text-sm font-medium
        transform transition-all duration-300
        hover:shadow-2xl hover:scale-105
        ${isAnimating ? 'scale-110 brightness-110' : ''}
      `}>
        {/* Indicador pulsando */}
        <div className="relative">
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <div className="absolute inset-0 w-2 h-2 bg-white rounded-full animate-ping opacity-75"></div>
        </div>
        
        <Users className="w-4 h-4" />
        
        <span className={`font-bold transition-all duration-300 ${isAnimating ? 'text-yellow-200' : ''}`}>
          {count}
        </span>
        
        <span className="hidden sm:inline">pessoas criando currículo agora</span>
        <span className="sm:hidden">criando CV</span>
        
        <button 
          onClick={() => setIsVisible(false)}
          className="ml-2 text-green-100 hover:text-white transition-colors duration-200 p-1 hover:bg-white/10 rounded"
          aria-label="Fechar"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
} 