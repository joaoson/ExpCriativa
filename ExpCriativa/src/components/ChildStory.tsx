
import React from 'react';
import { cn } from '@/lib/utils';

type ChildStoryProps = {
  name: string;
  age: number;
  location: string;
  quote: string;
  imagePath: string;
  className?: string;
};

const ChildStory = ({
  name,
  age,
  location,
  quote,
  imagePath,
  className,
}: ChildStoryProps) => {
  return (
    <div className={cn("bg-white rounded-2xl overflow-hidden shadow-soft card-hover", className)}>
      <div className="aspect-[4/3] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <img
          src={imagePath}
          alt={`${name}'s story`}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold">{name}, {age}</h3>
            <p className="text-sm text-charity-dark/70">{location}</p>
          </div>
          <div className="bg-charity-light-blue text-charity-blue px-3 py-1 rounded-full text-xs font-semibold">
            Success Story
          </div>
        </div>
        <blockquote className="text-charity-dark/80 italic relative pl-4 border-l-2 border-charity-blue">
          "{quote}"
        </blockquote>
      </div>
    </div>
  );
};

export default ChildStory;
