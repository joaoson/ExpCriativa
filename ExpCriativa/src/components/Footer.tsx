
import React from 'react';
import { Heart, Mail, Phone, MapPin, Globe, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-charity-dark text-white pt-16 pb-6">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="w-7 h-7 text-charity-orange" fill="#FFD639" />
              <span className="text-xl font-bold font-display">
                <span className="text-charity-blue">Lu</span>
                <span className="text-charity-orange">men</span>
              </span>
            </div>
            <p className="text-charity-gray mb-6">
              We're dedicated to improving the lives of children worldwide through education, 
              healthcare, and creating safe environments.
            </p>
            <div className="flex space-x-3">
              <SocialIcon icon={Facebook} />
              <SocialIcon icon={Twitter} />
              <SocialIcon icon={Instagram} />
              <SocialIcon icon={Youtube} />
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <FooterLink href="#about">About Us</FooterLink>
              <FooterLink href="#impact">Our Impact</FooterLink>
              <FooterLink href="#stories">Success Stories</FooterLink>
              <FooterLink href="#donate">Make a Donation</FooterLink>
              <FooterLink href="#volunteer">Volunteer</FooterLink>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 text-charity-orange flex-shrink-0 mt-0.5" />
                <span>R. Imac. Conceição, 1155 - Prado Velho, Curitiba - PR, 80215-901</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-charity-orange flex-shrink-0" />
                <span>+55 (41) 99897-0828</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-charity-orange flex-shrink-0" />
                <span>info@lumen.org</span>
              </li>
              <li className="flex items-center">
                <Globe className="w-5 h-5 mr-3 text-charity-orange flex-shrink-0" />
                <span>www.lumen.org</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Newsletter</h4>
            <p className="text-charity-gray mb-4">
              Subscribe to our newsletter to receive updates on our work and how you can help.
            </p>
            <div className="mb-4">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-charity-blue text-white placeholder:text-white/60 mb-3"
              />
              <button className="w-full btn-primary py-3">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <hr className="border-white/10 mb-6" />
        
        <div className="flex flex-col md:flex-row justify-between items-center text-charity-gray text-sm">
          <p>&copy; {new Date().getFullYear()} Lumen. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <Link to="/cookie-policy" onClick={() => window.scrollTo(0, 0)} className="hover:text-white transition-colors">Cookies Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <li>
    <a 
      href={href} 
      className="text-charity-gray hover:text-white transition-colors"
    >
      {children}
    </a>
  </li>
);

const SocialIcon = ({ icon: Icon }: { icon: React.ElementType }) => (
  <a 
    href="#" 
    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-charity-blue transition-colors"
  >
    <Icon className="w-4 h-4" />
  </a>
);

export default Footer;
