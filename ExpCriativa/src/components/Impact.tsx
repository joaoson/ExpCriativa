
import React from 'react';
import { BookOpen, HeartPulse, Home, GraduationCap } from 'lucide-react';
import AnimatedIcon from './AnimatedIcon';

type ImpactCardProps = {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  delay: string;
};

const ImpactCard = ({ icon: Icon, title, description, color, bgColor, delay }: ImpactCardProps) => (
  <div 
    className="bg-white rounded-2xl p-6 shadow-soft card-hover"
    style={{ animationDelay: delay }}
  >
    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4`} style={{ backgroundColor: bgColor }}>
      <Icon size={28} className="text-charity-blue" style={{ color }} />
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-charity-dark/80">{description}</p>
  </div>
);

const Impact = () => {
  return (
    <section id="impact" className="section bg-charity-light-gray relative">
      <div className="absolute top-20 left-10 hidden lg:block">
        <AnimatedIcon 
          icon={HeartPulse}
          size={20}
          color="#007CBE"
          bgColor="#E1F0F9"
          className="p-2.5 shadow-soft"
          animation="float"
          delay="0.2s"
        />
      </div>
      
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 mb-4 bg-charity-light-yellow text-charity-orange rounded-full shadow-sm">
            <span className="text-sm font-medium">Our Impact</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How Your Donation Makes a Difference</h2>
          <p className="text-lg text-charity-dark/80">
            We focus on making lasting change in children's lives through these key areas. Every donation directly supports these vital initiatives.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          <ImpactCard 
            icon={BookOpen} 
            title="Education"
            description="Providing books, school supplies, and learning programs to underprivileged children."
            color="#007CBE"
            bgColor="#E1F0F9"
            delay="0s"
          />
          <ImpactCard 
            icon={HeartPulse} 
            title="Healthcare"
            description="Ensuring access to medical care, vaccinations, and nutrition programs."
            color="#FBAF00"
            bgColor="#FFF0E1"
            delay="0.1s"
          />
          <ImpactCard 
            icon={Home} 
            title="Safe Homes"
            description="Building and maintaining safe living environments and community centers."
            color="#007CBE"
            bgColor="#E1F0F9" 
            delay="0.2s"
          />
          <ImpactCard 
            icon={GraduationCap} 
            title="Scholarships"
            description="Supporting continued education through scholarship programs for talented students."
            color="#FBAF00"
            bgColor="#FFF0E1"
            delay="0.3s"
          />
        </div>
        
        <div className="mt-16 text-center">
          <div className="inline-block bg-white px-8 py-5 rounded-2xl shadow-medium">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
              <div className="flex flex-col items-center md:items-start">
                <p className="text-sm text-charity-dark/70 mb-1">Children Helped</p>
                <h3 className="text-3xl font-bold text-charity-blue">10,284</h3>
              </div>
              <div className="h-px w-full md:h-12 md:w-px bg-charity-gray/20"></div>
              <div className="flex flex-col items-center md:items-start">
                <p className="text-sm text-charity-dark/70 mb-1">Communities Served</p>
                <h3 className="text-3xl font-bold text-charity-orange">142</h3>
              </div>
              <div className="h-px w-full md:h-12 md:w-px bg-charity-gray/20"></div>
              <div className="flex flex-col items-center md:items-start">
                <p className="text-sm text-charity-dark/70 mb-1">Success Rate</p>
                <h3 className="text-3xl font-bold text-charity-blue">94%</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Impact;
