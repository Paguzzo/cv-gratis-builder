import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Gift, Menu, X } from "lucide-react";
import Logo from "@/components/Logo";

const MobileHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar se é mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isMenuOpen && !target.closest('.mobile-menu') && !target.closest('.menu-toggle')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  // Prevenir scroll quando menu está aberto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <header className="py-3 sm:py-6 px-3 sm:px-4 border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50" role="banner" aria-label="Cabeçalho principal">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2 sm:gap-3">
          <Logo size="md" />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-4" aria-label="Navegação principal">
          <Button variant="outline" asChild className="text-sm px-4">
            <Link to="/showcase" aria-label="Ver galeria de templates disponíveis">Ver Templates</Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="w-8 h-8 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            title="Área Administrativa"
          >
            <Link to="/admin-login" aria-label="Acesso à área administrativa">A</Link>
          </Button>
          <Button asChild className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-sm px-4">
            <Link to="/criar-curriculo" aria-label="Começar a criar currículo gratuitamente agora">
              <Gift className="w-4 h-4 mr-2" aria-hidden="true" />
              CRIAR GRÁTIS
            </Link>
          </Button>
        </nav>

        {/* Mobile Navigation */}
        {isMobile && (
          <div className="flex items-center gap-2">
            {/* CTA Button sempre visível */}
            <Button asChild className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-xs px-3 py-2 h-auto">
              <Link to="/criar-curriculo" aria-label="Criar currículo grátis">
                <Gift className="w-3 h-3 mr-1" aria-hidden="true" />
                CRIAR
              </Link>
            </Button>

            {/* Menu Hamburger Button */}
            <button
              className="menu-toggle p-2 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {isMobile && isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div className="mobile-menu fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Menu Header */}
              <div className="flex justify-between items-center p-4 border-b">
                <span className="font-semibold text-gray-800">Menu</span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                  aria-label="Fechar menu"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Menu Items */}
              <nav className="flex flex-col p-4 space-y-3" aria-label="Menu de navegação mobile">
                <Link
                  to="/criar-curriculo"
                  className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold hover:from-green-600 hover:to-green-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Gift className="w-5 h-5" />
                  Criar Currículo GRÁTIS
                </Link>

                <Link
                  to="/showcase"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700 font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                  Ver Templates
                </Link>

                <Link
                  to="/admin-login"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-500 font-medium transition-colors text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Área Admin
                </Link>
              </nav>

              {/* Menu Footer */}
              <div className="mt-auto p-4 border-t bg-gray-50">
                <p className="text-xs text-gray-500 text-center">
                  CVGratis - Seu currículo profissional
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default MobileHeader;
