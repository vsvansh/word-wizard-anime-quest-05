
import React from 'react';

const BackgroundEffects = () => {
  return (
    <>
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800"></div>
      <div className="fixed inset-0 -z-10 opacity-50">
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-wizard-purple/20 dark:bg-wizard-purple/30"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: `scale(${Math.random() * 3 + 0.5})`,
                opacity: `${Math.random() * 0.5 + 0.2}`,
                animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite, 
                          pulse ${Math.random() * 5 + 2}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>
      </div>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0) scale(var(--tw-scale-x)); }
          25% { transform: translateY(-20px) translateX(10px) scale(var(--tw-scale-x)); }
          50% { transform: translateY(0) translateX(20px) scale(var(--tw-scale-x)); }
          75% { transform: translateY(20px) translateX(10px) scale(var(--tw-scale-x)); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: var(--tw-opacity); }
          50% { opacity: calc(var(--tw-opacity) * 1.5); }
        }
      `}</style>
    </>
  );
};

export default BackgroundEffects;
