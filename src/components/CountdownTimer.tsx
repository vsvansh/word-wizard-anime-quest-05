
import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetTime?: Date;
  onComplete?: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ 
  targetTime = new Date(new Date().setHours(24, 0, 0, 0)), // Next midnight
  onComplete 
}) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +targetTime - +new Date();
      
      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        if (onComplete) onComplete();
        return;
      }
      
      setTimeLeft({
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetTime, onComplete]);

  const formatTime = (value: number) => {
    return value.toString().padStart(2, '0');
  };

  return (
    <div className="flex items-center justify-center space-x-1 md:space-x-2">
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-wizard-purple/10 rounded-md">
          <span className="text-lg md:text-xl font-bold text-wizard-purple">{formatTime(timeLeft.hours)}</span>
        </div>
        <span className="text-xs text-gray-500">hours</span>
      </div>
      <span className="text-lg md:text-xl font-bold text-wizard-purple">:</span>
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-wizard-purple/10 rounded-md">
          <span className="text-lg md:text-xl font-bold text-wizard-purple">{formatTime(timeLeft.minutes)}</span>
        </div>
        <span className="text-xs text-gray-500">mins</span>
      </div>
      <span className="text-lg md:text-xl font-bold text-wizard-purple">:</span>
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-wizard-purple/10 rounded-md">
          <span className="text-lg md:text-xl font-bold text-wizard-purple">{formatTime(timeLeft.seconds)}</span>
        </div>
        <span className="text-xs text-gray-500">secs</span>
      </div>
    </div>
  );
};

export default CountdownTimer;
