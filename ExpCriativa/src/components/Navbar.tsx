
import React, { useState, useEffect } from 'react';
import { Menu, X, Heart, UserRound } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { useAuth } from './auth-context';

type NavbarProps = {
  labels: LabelProp[],
  isAuthenticated: boolean
}

export type LabelProp = {
  href: string,
  text: string
}

const Navbar = ({
  labels,
  isAuthenticated
} : NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout } = useAuth();
  

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'py-3 glassmorphism shadow-soft'
          : 'py-3 glassmorphism shadow-soft'
      )}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          <a 
            href="/" 
            className="flex items-center space-x-2"
            aria-label="Logo"
          >
            <Heart 
              className={cn(
                "w-8 h-8 transition-colors duration-300",
                isScrolled ? "text-charity-orange" : "text-charity-orange"
              )} 
              strokeWidth={2.5} 
              fill="#FFD639" 
            />
            <span className="text-xl font-bold font-display">
              <span className="text-charity-blue">Lu</span>
              <span className="text-charity-orange">men</span>
            </span>
          </a>

          <nav className="hidden md:flex items-center space-x-8">
            {labels.map((i, index) => 
              (
                <NavLink key={index} href={i.href} isScrolled={isScrolled}>{i.text}</NavLink>
              )
            )}
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ?
              (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <UserRound />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-34">
                      <DropdownMenuLabel>John Doe</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <Link to={"/profile"}>
                        <DropdownMenuItem>
                          View Profile
                        </DropdownMenuItem>
                      </Link>
                      <Link to={"/donations"}>
                        <DropdownMenuItem>
                          Donation History
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem onClick={logout}>
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) :
              (
                <>
                  <Link to={"/login"}>
                    <Button variant='default' className="w-full py-2">
                        Log In
                    </Button>
                  </Link>
                  <Link to={"/signup"}>
                    <Button variant='ghost' className="w-full py-2">
                        Get Started
                    </Button>
                  </Link>
                </>
              )
            }
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-charity-dark focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute inset-x-0 top-full px-2 pb-3 pt-2 glassmorphism shadow-medium animate-slide-down rounded-b-xl">
            <div className="px-4 py-2 space-y-1">
              {labels.map(i => (
                <MobileNavLink href={i.href} onClick={() => setIsMobileMenuOpen(false)}>{i.text}</MobileNavLink>
              ))}
              <div className="pt-2">
                <Link to={isAuthenticated ? "/organization" : "login"}>
                  <Button variant='default' className="w-full py-2">
                      {isAuthenticated ? "Your Profile" : "Log In"}
                  </Button>
                </Link>
              </div>

            </div>
          </div>
        )}
      </div>
    </header>
  );
};

const NavLink: React.FC<{ href: string; isScrolled: boolean; children: React.ReactNode }> = ({ 
  href, 
  isScrolled, 
  children 
}) => (
  <a
    href={href}
    className={cn(
      "text-sm font-medium transition-colors duration-200 hover:text-charity-blue relative after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-0.5 after:origin-bottom-right after:scale-x-0 after:bg-charity-blue after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100",
      isScrolled ? "text-charity-dark" : "text-charity-dark"
    )}
  >
    {children}
  </a>
);

const MobileNavLink: React.FC<{ href: string; onClick: () => void; children: React.ReactNode }> = ({ 
  href, 
  onClick, 
  children 
}) => (
  <a
    href={href}
    className="block py-2 text-base font-medium text-charity-dark hover:text-charity-blue transition-colors duration-200"
    onClick={onClick}
  >
    {children}
  </a>
);

export default Navbar;
