
import React, { useState } from 'react';
import { Heart, ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import LoginModal from './LoginModal';
import { useToast } from '@/hooks/use-toast';

type AmountButtonProps = {
  value: number;
  selected: boolean;
  onClick: () => void;
};

const AmountButton = ({ value, selected, onClick }: AmountButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "py-3 px-6 rounded-xl text-lg font-medium transition-all duration-200",
      selected
        ? "bg-charity-blue text-white shadow-button"
        : "bg-charity-light-gray text-charity-dark hover:bg-charity-light-blue"
    )}
  >
    ${value}
  </button>
);

type DonationImpactProps = {
  amount: number;
  description: string;
};

const DonationImpact = ({ amount, description }: DonationImpactProps) => (
  <div className="flex items-start space-x-2 mb-3">
    <div className="mt-1 flex-shrink-0">
      <Check className="w-5 h-5 text-charity-blue" />
    </div>
    <p className="text-charity-dark/80 text-sm">
      ${amount} <span className="font-medium">{description}</span>
    </p>
  </div>
);

const DonationCard = () => {
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setIsCustom(false);
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setCustomAmount(value);
      setIsCustom(true);
      if (value !== '') {
        setSelectedAmount(parseInt(value));
      }
    }
  };

  const handleDonateClick = () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
    } else {
      processDonation();
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    processDonation();
  };

  const processDonation = () => {
    toast({
      title: "Thank you for your donation!",
      description: `Your $${selectedAmount} donation will help children in need.`,
      variant: "default",
    });
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-medium p-8" id="donate">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-charity-light-yellow p-3 rounded-full">
            <Heart className="w-6 h-6 text-charity-orange" fill="#FFD639" />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-center mb-2">Make a Donation</h3>
        <p className="text-charity-dark/80 text-center mb-8">
          Your generosity transforms children's lives
        </p>
        
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            <AmountButton 
              value={25} 
              selected={selectedAmount === 25 && !isCustom} 
              onClick={() => handleAmountSelect(25)} 
            />
            <AmountButton 
              value={50} 
              selected={selectedAmount === 50 && !isCustom} 
              onClick={() => handleAmountSelect(50)} 
            />
            <AmountButton 
              value={100} 
              selected={selectedAmount === 100 && !isCustom} 
              onClick={() => handleAmountSelect(100)} 
            />
          </div>
          
          <div className="relative">
            <input
              type="text"
              value={customAmount}
              onChange={handleCustomAmountChange}
              placeholder="Other amount"
              className="w-full py-3 px-6 pl-12 rounded-xl border border-charity-gray/30 focus:border-charity-blue focus:ring-1 focus:ring-charity-blue outline-none transition-all"
            />
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-charity-dark">$</span>
          </div>
          
          <div className="rounded-xl bg-charity-light-gray p-4">
            <h4 className="font-medium mb-3">Your Impact</h4>
            <DonationImpact 
              amount={selectedAmount * 0.4} 
              description="provides educational materials for children"
            />
            <DonationImpact 
              amount={selectedAmount * 0.3} 
              description="ensures access to healthcare services"
            />
            <DonationImpact 
              amount={selectedAmount * 0.3} 
              description="supports safe living environments"
            />
          </div>
          
          <button 
            onClick={handleDonateClick}
            className="btn-primary py-4 w-full text-lg flex items-center justify-center space-x-2"
          >
            <span>Donate ${selectedAmount}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <div className="text-center text-sm text-charity-dark/70">
            Secured by <span className="font-medium">SSL Encryption</span>. 
            All donations are tax-deductible.
          </div>
        </div>
      </div>

      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </>
  );
};

export default DonationCard;
