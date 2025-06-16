
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import UpdateDonorProfile from './UpdateDonorProfile';

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
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)
  const { logout } = useAuth();
  
  const email = localStorage.getItem("userEmail")
  const role = localStorage.getItem("role")
  const userId = localStorage.getItem("userId")
  const isDonor = role === "1"

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

  function onClose() {
    setIsProfileDialogOpen(false)
  }

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

            {!isAuthenticated && (
              <>
                <NavLink href="#about" isScrolled={isScrolled}>About</NavLink>
                <NavLink href="#impact" isScrolled={isScrolled}>Impact</NavLink>
                <NavLink href="#stories" isScrolled={isScrolled}>Stories</NavLink>
              </>
            )}

            {isAuthenticated && (
              <>
                <NavLink href="/search" isScrolled={isScrolled}>Organizations</NavLink>
                {isDonor && (
                  <NavLink href="/donations" isScrolled={isScrolled}>My Donations</NavLink>
                )}

                {!isDonor && (
                  <>
                    <NavLink href="/dashboard" isScrolled={isScrolled}>Dashboard</NavLink>
                    <NavLink href={`/organization/${userId}`} isScrolled={isScrolled}>Profile</NavLink>
                  </>
                )}
              </>
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
                      <DropdownMenuLabel>{email}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {isDonor && (
                        <>
                          <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
                            <DialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                Edit Profile
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Update Your Profile</DialogTitle>
                                <DialogDescription>
                                  Keep your information updated!
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <UpdateDonorProfile onClose={onClose}></UpdateDonorProfile>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Link to={"/donations"}>
                            <DropdownMenuItem>
                              Donation History
                            </DropdownMenuItem>
                          </Link>
                        </>
                      )}

                      {!isDonor && (
                        <>
                          <Link to={`/organization/${userId}`}>
                            <DropdownMenuItem>
                              View Profile
                            </DropdownMenuItem>
                          </Link>
                          <Link to={"/dashboard"}>
                            <DropdownMenuItem>
                              Dashboard
                            </DropdownMenuItem>
                          </Link>
                        </>
                      )}
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

                {!isAuthenticated && (
                  <>
                    <MobileNavLink href="#about" onClick={() => setIsMobileMenuOpen(false)}>About</MobileNavLink>
                    <MobileNavLink href="#impact" onClick={() => setIsMobileMenuOpen(false)}>Impact</MobileNavLink>
                    <MobileNavLink href="#stories" onClick={() => setIsMobileMenuOpen(false)}>Stories</MobileNavLink>
                    <MobileNavLink href="/login" onClick={() => setIsMobileMenuOpen(false)}>Log In</MobileNavLink>
                    <MobileNavLink href="/signup" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</MobileNavLink>
                  </>
                )}

                {isAuthenticated && (
                  <>
                    <MobileNavLink href="/search" onClick={() => setIsMobileMenuOpen(false)}>Organizations</MobileNavLink>
                    {isDonor && (
                      <MobileNavLink href="/donations" onClick={() => setIsMobileMenuOpen(false)}>My Donations</MobileNavLink>
                    )}
                    {!isDonor && (
                      <>
                        <MobileNavLink href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</MobileNavLink>
                        <MobileNavLink href={`/organization/${userId}`} onClick={() => setIsMobileMenuOpen(false)}>Profile</MobileNavLink>

                      </>
                    )}
                    <MobileNavLink href="" onClick={
                      () => {
                        setIsMobileMenuOpen(false)
                        logout()
                      }
                      }>Logout</MobileNavLink>

                  </>
                )}

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
