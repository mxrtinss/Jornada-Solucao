import React, { useState, useEffect } from 'react';
import { ClockIcon, PlayIcon, HopIcon as StopIcon } from 'lucide-react';
import Button from '../ui/Button';

interface TimeTrackerProps {
  startTime?: string;
  endTime?: string;
}

const TimeTracker: React.FC<TimeTrackerProps> = ({ startTime, endTime }) => {
  const [isRunning, setIsRunning] = useState<boolean>(!!startTime && !endTime);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [trackingStartTime, setTrackingStartTime] = useState<Date | null>(
    startTime ? new Date(startTime) : null
  );
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning) {
      const start = trackingStartTime || new Date();
      
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - start.getTime()) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, trackingStartTime]);
  
  const handleStartTracking = () => {
    const now = new Date();
    setTrackingStartTime(now);
    setIsRunning(true);
  };
  
  const handleStopTracking = () => {
    setIsRunning(false);
  };
  
  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
      hrs.toString().padStart(2, '0'),
      mins.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-500">Start Time</h4>
          <p className="text-gray-800">
            {trackingStartTime 
              ? trackingStartTime.toLocaleString() 
              : 'Not started'}
          </p>
        </div>
        {endTime && (
          <div>
            <h4 className="text-sm font-medium text-gray-500">End Time</h4>
            <p className="text-gray-800">{new Date(endTime).toLocaleString()}</p>
          </div>
        )}
      </div>
      
      <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg bg-gray-50">
        <div className="text-xs text-gray-500 mb-1">Total Time</div>
        <div className="text-3xl font-mono font-semibold text-gray-800 flex items-center">
          <ClockIcon className="h-5 w-5 mr-2 text-teal-700" />
          {formatTime(elapsedTime)}
        </div>
      </div>
      
      <div className="flex justify-center space-x-4">
        {!isRunning ? (
          <Button 
            onClick={handleStartTracking} 
            variant="success" 
            leftIcon={<PlayIcon className="h-4 w-4" />}
            disabled={!!endTime}
          >
            Start Tracking
          </Button>
        ) : (
          <Button 
            onClick={handleStopTracking} 
            variant="danger" 
            leftIcon={<StopIcon className="h-4 w-4" />}
          >
            Stop Tracking
          </Button>
        )}
      </div>
    </div>
  );
};

export default TimeTracker;