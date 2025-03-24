
import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

type AnimatedIconProps = {
  icon: LucideIcon;
  size?: number;
  color?: string;
  bgColor?: string;
  className?: string;
  animation?: 'float' | 'pulse' | 'bounce' | 'spin' | 'none';
  delay?: string;
};

const AnimatedIcon = ({
  icon: Icon,
  size = 24,
  color = '#007CBE',
  bgColor = '#E1F0F9',
  className,
  animation = 'float',
  delay = '0s',
}: AnimatedIconProps) => {
  const getAnimationClass = () => {
    switch (animation) {
      case 'float':
        return 'animate-float';
      case 'pulse':
        return 'animate-pulse-gentle';
      case 'bounce':
        return 'animate-bounce-gentle';
      case 'spin':
        return 'animate-spin-slow';
      default:
        return '';
    }
  };

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full',
        getAnimationClass(),
        className
      )}
      style={{
        backgroundColor: bgColor,
        animationDelay: delay,
      }}
    >
      <Icon size={size} color={color} />
    </div>
  );
};

export default AnimatedIcon;
