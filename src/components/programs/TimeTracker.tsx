import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, Square, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

interface TimeTrackerProps {
  startTime?: string;
  endTime?: string;
  onTimeUpdate?: (startTime: string, endTime: string | null, elapsedSeconds: number) => void;
}

const TimeTracker: React.FC<TimeTrackerProps> = ({ 
  startTime, 
  endTime, 
  onTimeUpdate 
}) => {
  const [isRunning, setIsRunning] = useState<boolean>(!!startTime && !endTime);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [trackingStartTime, setTrackingStartTime] = useState<Date | null>(
    startTime ? new Date(startTime) : null
  );
  const [trackingEndTime, setTrackingEndTime] = useState<Date | null>(
    endTime ? new Date(endTime) : null
  );
  const [pausedTime, setPausedTime] = useState<number>(0);
  const [timeLog, setTimeLog] = useState<Array<{start: Date, end: Date | null}>>([]);
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning && !isPaused) {
      const start = trackingStartTime || new Date();
      
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - start.getTime()) / 1000) - pausedTime;
        setElapsedTime(elapsed);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, trackingStartTime, isPaused, pausedTime]);
  
  const handleStartTracking = () => {
    const now = new Date();
    setTrackingStartTime(now);
    setTrackingEndTime(null);
    setIsRunning(true);
    setIsPaused(false);
    setPausedTime(0);
    setElapsedTime(0);
    
    const newLog = [{start: now, end: null}];
    setTimeLog(newLog);
    
    if (onTimeUpdate) {
      onTimeUpdate(now.toISOString(), null, 0);
    }
  };
  
  const handlePauseTracking = () => {
    setIsPaused(true);
    
    // Capture current elapsed time for pause
    const pauseTime = new Date();
    const updatedLog = [...timeLog];
    if (updatedLog.length > 0) {
      const lastEntry = updatedLog[updatedLog.length - 1];
      if (lastEntry && !lastEntry.end) {
        lastEntry.end = pauseTime;
      }
    }
    setTimeLog(updatedLog);
  };
  
  const handleResumeTracking = () => {
    setIsPaused(false);
    
    // Add new log entry for resumed time
    const now = new Date();
    const updatedLog = [...timeLog, {start: now, end: null}];
    setTimeLog(updatedLog);
    
    // Calculate total paused time
    let totalPaused = pausedTime;
    if (trackingStartTime) {
      let runningTime = 0;
      timeLog.forEach(entry => {
        if (entry.end) {
          runningTime += entry.end.getTime() - entry.start.getTime();
        }
      });
      
      const totalTime = now.getTime() - trackingStartTime.getTime();
      totalPaused = Math.floor((totalTime - runningTime) / 1000);
      setPausedTime(totalPaused);
    }
  };
  
  const handleStopTracking = () => {
    setIsRunning(false);
    setIsPaused(false);
    const now = new Date();
    setTrackingEndTime(now);
    
    // Update the last log entry
    const updatedLog = [...timeLog];
    if (updatedLog.length > 0) {
      const lastEntry = updatedLog[updatedLog.length - 1];
      if (lastEntry && !lastEntry.end) {
        lastEntry.end = now;
      }
    }
    setTimeLog(updatedLog);
    
    if (onTimeUpdate && trackingStartTime) {
      onTimeUpdate(trackingStartTime.toISOString(), now.toISOString(), elapsedTime);
    }
  };
  
  const handleResetTracking = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTrackingStartTime(null);
    setTrackingEndTime(null);
    setElapsedTime(0);
    setPausedTime(0);
    setTimeLog([]);
    
    if (onTimeUpdate) {
      onTimeUpdate('', '', 0);
    }
  };
  
  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    let formattedTime = '';
    if (hrs > 0) formattedTime += `${hrs}h `;
    if (mins > 0 || hrs > 0) formattedTime += `${mins}min `;
    formattedTime += `${secs}s`;
    
    return formattedTime;
  };
  
  const exportTimeLog = () => {
    // Prepare data for export
    const csvContent = [
      ['Início', 'Fim', 'Duração (segundos)'].join(','),
      ...timeLog.map(entry => {
        const start = entry.start.toLocaleString();
        const end = entry.end ? entry.end.toLocaleString() : 'Em andamento';
        const duration = entry.end 
          ? Math.floor((entry.end.getTime() - entry.start.getTime()) / 1000) 
          : 'N/A';
        return [start, end, duration].join(',');
      })
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `time-log-${new Date().toISOString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-500">Início</h4>
          <p className="text-gray-800">
            {trackingStartTime 
              ? trackingStartTime.toLocaleString() 
              : 'Não iniciado'}
          </p>
        </div>
        {trackingEndTime && (
          <div>
            <h4 className="text-sm font-medium text-gray-500">Fim</h4>
            <p className="text-gray-800">{trackingEndTime.toLocaleString()}</p>
          </div>
        )}
      </div>
      
      <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg bg-gray-50">
        <div className="text-xs text-gray-500 mb-1">Tempo Total</div>
        <div className="text-3xl font-mono font-semibold text-gray-800 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-teal-700" />
          {formatTime(elapsedTime)}
        </div>
      </div>
      
      <div className="flex justify-center space-x-3">
        {!isRunning && !trackingEndTime && (
          <Button 
            onClick={handleStartTracking} 
            variant="success" 
            leftIcon={<Play className="h-4 w-4" />}
          >
            Iniciar
          </Button>
        )}
        
        {isRunning && !isPaused && (
          <Button 
            onClick={handlePauseTracking} 
            variant="warning" 
            leftIcon={<Pause className="h-4 w-4" />}
          >
            Pausar
          </Button>
        )}
        
        {isRunning && isPaused && (
          <Button 
            onClick={handleResumeTracking} 
            variant="info" 
            leftIcon={<Play className="h-4 w-4" />}
          >
            Continuar
          </Button>
        )}
        
        {isRunning && (
          <Button 
            onClick={handleStopTracking} 
            variant="danger" 
            leftIcon={<Square className="h-4 w-4" />}
          >
            Parar
          </Button>
        )}
        
        {(trackingStartTime || trackingEndTime) && (
          <Button 
            onClick={handleResetTracking} 
            variant="secondary" 
            leftIcon={<RefreshCw className="h-4 w-4" />}
          >
            Reiniciar
          </Button>
        )}
      </div>
      
      {timeLog.length > 0 && trackingEndTime && (
        <div className="mt-4">
          <Button 
            onClick={exportTimeLog} 
            variant="outline" 
            className="w-full"
          >
            Exportar Log de Tempo (CSV)
          </Button>
        </div>
      )}
    </div>
  );
};

export default TimeTracker;



