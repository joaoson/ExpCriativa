
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, Frown, RotateCcw } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Random shapes for the doodle background
  const renderDoodles = () => {
    const doodles = [];
    const shapes = ['circle', 'square', 'triangle', 'star', 'heart', 'cloud'];
    const colors = ['charity-blue', 'charity-yellow', 'charity-orange', 'charity-gray'];
    
    for (let i = 0; i < 15; i++) {
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.floor(Math.random() * 40) + 10; // 10-50px
      const top = Math.floor(Math.random() * 80) + 10; // 10-90%
      const left = Math.floor(Math.random() * 80) + 10; // 10-90%
      const opacity = (Math.floor(Math.random() * 5) + 2) / 10; // 0.2-0.7
      const rotate = Math.floor(Math.random() * 360); // 0-360deg
      
      doodles.push(
        <div
          key={i}
          className={`absolute opacity-${opacity} bg-${color}`}
          style={{
            width: `${size}px`,
            height: shape === 'circle' || shape === 'square' ? `${size}px` : 'auto',
            top: `${top}%`,
            left: `${left}%`,
            borderRadius: shape === 'circle' ? '50%' : shape === 'square' ? '8px' : '0',
            clipPath: shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 
                      shape === 'star' ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' : 
                      shape === 'heart' ? 'polygon(50% 0%, 100% 38%, 82% 100%, 50% 76%, 18% 100%, 0% 38%)' :
                      shape === 'cloud' ? 'polygon(25% 50%, 25% 20%, 45% 10%, 65% 15%, 75% 25%, 85% 10%, 95% 20%, 95% 40%, 85% 50%, 75% 60%, 50% 70%, 25% 50%)' : 'none',
            transform: `rotate(${rotate}deg)`,
            zIndex: -1
          }}
        />
      );
    }
    
    return doodles;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
      {/* Doodle background */}
      <div className="absolute inset-0 opacity-10">
        {renderDoodles()}
      </div>
      
      {/* Animated circles in the background */}
      <div className="absolute w-64 h-64 bg-charity-light-blue rounded-full -top-10 -left-10 animate-float opacity-20"></div>
      <div className="absolute w-48 h-48 bg-charity-light-yellow rounded-full -bottom-10 -right-10 animate-bounce-gentle opacity-30"></div>
      <div className="absolute w-32 h-32 bg-charity-light-orange rounded-full bottom-20 left-20 animate-pulse-gentle opacity-20"></div>
      
      <div className="relative z-10 mx-auto p-8 bg-white/80 backdrop-blur-md rounded-3xl shadow-medium border border-charity-light-gray">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="relative">
              <Frown size={80} className="text-charity-blue animate-bounce-gentle" />
              <div className="absolute w-16 h-16 bg-charity-light-yellow rounded-full -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          </div>
          
          <h1 className="text-6xl font-bold mb-2 text-charity-dark">404</h1>
          <h2 className="text-2xl font-bold mb-4 text-charity-dark">Oops! Page Not Found</h2>
          <p className="text-lg text-charity-dark/70 mb-8">
            We couldn't find the page you were looking for. It might have been moved or doesn't exist.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
  <Link to="/" className="btn-primary py-3 px-6 flex items-center justify-center min-w-[180px]">
    <Home size={20} className="mr-2" />
    Back to Home
  </Link>
  <button 
    onClick={() => window.history.back()} 
    className="btn-outline py-3 px-6 flex items-center justify-center min-w-[180px]"
  >
    <ArrowLeft size={20} className="mr-2" />
    Go Back
  </button>
  <button 
    onClick={() => window.location.reload()} 
    className="btn-ghost py-3 px-6 flex items-center justify-center min-w-[180px]"
  >
    <RotateCcw size={20} className="mr-2" />
    Reload Page
  </button>
</div>

        </div>
      </div>
    </div>
  );
};

export default NotFound;