
import React from 'react';
import { LucideIcon } from 'lucide-react';

type TrustBadgeProps = {
  icon: LucideIcon;
  text: string;
  description: string;
};

const TrustBadge = ({ icon: Icon, text, description }: TrustBadgeProps) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-2 bg-white p-3 rounded-2xl shadow-soft">
        <Icon size={24} className="text-charity-blue" />
      </div>
      <h4 className="text-base font-bold text-charity-dark">{text}</h4>
      <p className="text-sm text-charity-dark/70">{description}</p>
    </div>
  );
};

export default TrustBadge;
