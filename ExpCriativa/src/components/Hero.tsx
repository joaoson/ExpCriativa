
import React from 'react';
import { Heart, Star, Gift, Award, ArrowRight } from 'lucide-react';
import AnimatedIcon from './AnimatedIcon';
import TrustBadge from './TrustBadge';

const Hero = () => {
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute -top-10 -left-10 w-64 h-64 bg-charity-light-yellow rounded-full blur-3xl opacity-50"></div>
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-charity-light-blue rounded-full blur-3xl opacity-40"></div>
      
      {/* Floating icons */}
      <div className="absolute top-36 left-[15%] hidden md:block">
        <AnimatedIcon 
          icon={Heart}
          size={28}
          color="#FBAF00"
          bgColor="#FFF8E1"
          className="p-3 shadow-soft"
          animation="float"
          delay="0s"
        />
      </div>
      <div className="absolute bottom-24 right-[10%] hidden md:block">
        <AnimatedIcon 
          icon={Star}
          size={24}
          color="#007CBE"
          bgColor="#E1F0F9"
          className="p-3 shadow-soft"
          animation="float"
          delay="1s"
        />
      </div>
      <div className="absolute top-1/2 right-[20%] hidden lg:block">
        <AnimatedIcon 
          icon={Gift}
          size={20}
          color="#FBAF00"
          bgColor="#FFF8E1"
          className="p-2.5 shadow-soft"
          animation="float"
          delay="1.5s"
        />
      </div>
      
      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-3 py-1 mb-6 bg-charity-light-blue text-charity-blue rounded-full shadow-sm animate-slide-down">
            <span className="text-sm font-medium">Empowering Children's Futures</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-slide-up">
            Every Child Deserves A 
            <span className="text-charity-blue"> Bright</span> And <span className="text-charity-orange">Joyful</span> Future
          </h1>
          
          <p className="text-lg md:text-xl text-charity-dark/80 mb-8 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Join our mission to provide education, healthcare, and safety for children in need around the world. Your donation makes a real difference in a child's life.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <a href="#donate" className="btn-primary text-base px-8 py-3">
              Donate Now
            </a>
            <a href="#about" className="btn-outline text-base px-8 py-3">
              Learn More
            </a>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <TrustBadge
              icon={Award}
              text="100% Transparent"
              description="See exactly how your donation helps"
            />
            <TrustBadge
              icon={Heart}
              text="10,000+ Children Helped"
              description="Across 25 countries worldwide"
            />
            <TrustBadge
              icon={Gift}
              text="95% of Funds"
              description="Go directly to programs"
            />
          </div>
        </div>
      </div>
      
      {/* Bottom curved divider */}
      <div className="absolute bottom-0 left-0 right-0 h-16">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute bottom-0">
          <path fill="#F5F7FA" fillOpacity="1" d="M0,96L60,112C120,128,240,160,360,170.7C480,181,600,171,720,144C840,117,960,75,1080,80C1200,85,1320,139,1380,165.3L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
