
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, Frown, RotateCcw } from "lucide-react";
import DataQueryComponent from "@/components/DataQueryComponent";

const Test = () => {
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
      {/* Doodle background */}
      <DataQueryComponent/>
      
      {/* Animated circles in the background */}
      <div className="absolute w-64 h-64 bg-charity-light-blue rounded-full -top-10 -left-10 animate-float opacity-20"></div>
      <div className="absolute w-48 h-48 bg-charity-light-yellow rounded-full -bottom-10 -right-10 animate-bounce-gentle opacity-30"></div>
      <div className="absolute w-32 h-32 bg-charity-light-orange rounded-full bottom-20 left-20 animate-pulse-gentle opacity-20"></div>
      

    </div>
  );
};

export default Test;