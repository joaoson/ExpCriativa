import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  Sun,
  Moon,
  ChevronDown,
  User,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth-context';
/* ------------------------------------------------------------------ */
/* Fake auth – troque pela real                                       */
/* ------------------------------------------------------------------ */

const user ={ name: 'Charity Organization', role: 'Admin', avatar: 'CO' }

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */
const Header: React.FC = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  /* Tema */
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('theme') === 'dark' || prefersDark,
  );

  const { login, isAuthenticated, parseJwt, getJwtToken, logout} = useAuth();

  /* Rota atual */
  const location = useLocation();
  const navigate = useNavigate();
  const isPt = location.pathname.endsWith('Pt');

  /* Textos dinâmicos */
  const t = {
    headerTitle: isPt
      ? 'Página de Administração da Organização'
      : 'Organization Administration Page',
    langButton: isPt ? 'ENG' : 'PT',
    langTitle: isPt ? 'English version' : 'Versão em Português',
    visitOrg: isPt ? 'Visitar página da organização' : 'Visit Organization Page',
    signOut: isPt ? 'Sair' : 'Sign Out',
  };

  const toggleLangRoute = () => {
    const path = location.pathname;
    const newPath = isPt ? path.slice(0, -2) : `${path}Pt`;
    navigate(`${newPath}${location.search}${location.hash}`);
  };

  /* Dark-mode sync */
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  /* Fecha dropdown clicando fora */
  useEffect(() => {
    const close = () => setShowProfileMenu(false);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, []);

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-gray-200/50 bg-white/95 px-6 shadow-sm backdrop-blur-sm dark:border-gray-700/50 dark:bg-gray-900/80">
      <h1 className="hidden text-xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text sm:block">
        {t.headerTitle}
      </h1>

      <div className="flex items-center gap-2 ml-auto">
        {/* Botão PT/ENG */}
        <Button
          variant="outline"
          size="sm"
          onClick={toggleLangRoute}
          className="px-3"
          title={t.langTitle}
        >
          {t.langButton}
        </Button>

        {/* Dark-mode */}
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            setDarkMode((prev) => !prev);
          }}
          className="hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </Button>

        {/* Notificações */}
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 h-3 w-3 animate-pulse rounded-full border-2 border-white bg-red-500 dark:border-gray-900" />
        </Button>

        {/* Dropdown de perfil */}
        <div
          className="relative"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Button
            variant="ghost"
            onClick={() => setShowProfileMenu((v) => !v)}
            className="flex items-center gap-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-semibold text-white">
              {user.avatar}
            </div>
            <ChevronDown
              size={16}
              className={`transition-transform ${showProfileMenu ? 'rotate-180' : ''}`}
            />
          </Button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <div className="border-b px-4 py-3 dark:border-gray-700">
                <p className="font-semibold text-gray-800 dark:text-gray-100">
                  {user.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {user.role}
                </p>
              </div>

              <a
                href={`/organization/${localStorage.getItem('userId')}`}
                className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <User size={16} />
                {t.visitOrg}
              </a>

              <button
                onClick={logout}
                className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40"
              >
                <LogOut size={16} />
                {t.signOut}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
