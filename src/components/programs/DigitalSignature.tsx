import React, { useRef, useState, useEffect } from 'react';
import { RefreshCwIcon, CheckIcon } from 'lucide-react';
import { Button } from '../ui/Button';

interface DigitalSignatureProps {
  onChange: (dataUrl: string) => void;
}

const DigitalSignature: React.FC<DigitalSignatureProps> = ({ onChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas properties
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#333';
    
    // Clear canvas initially
    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add border
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    
    // Reset drawing style
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#333';
  }, []);
  
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    setIsDrawing(true);
    
    // Get position
    let x, y;
    if ('touches' in e) {
      const rect = canvas.getBoundingClientRect();
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.nativeEvent.offsetX;
      y = e.nativeEvent.offsetY;
    }
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Get position
    let x, y;
    if ('touches' in e) {
      const rect = canvas.getBoundingClientRect();
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.nativeEvent.offsetX;
      y = e.nativeEvent.offsetY;
    }
    
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
    
    // Notify parent component about signature change
    if (onChange) {
      onChange(canvas.toDataURL());
    }
  };
  
  const endDrawing = () => {
    setIsDrawing(false);
  };
  
  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add border
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    
    // Reset drawing style
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#333';
    
    setHasSignature(false);
    
    // Notify parent component
    if (onChange) {
      onChange('');
    }
  };
  
  return (
    <div className="space-y-3">
      <div 
        className="border border-gray-300 rounded-md overflow-hidden touch-none"
        style={{ touchAction: 'none' }}
      >
        <canvas
          ref={canvasRef}
          width={280}
          height={140}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
          className="w-full h-auto bg-gray-50"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <Button 
          onClick={clearSignature} 
          variant="secondary"
          size="sm"
          leftIcon={<RefreshCwIcon className="h-4 w-4" />}
        >
          Limpar
        </Button>
        
        {hasSignature && (
          <div className="flex items-center text-sm text-green-600">
            <CheckIcon className="h-4 w-4 mr-1" />
            Assinatura capturada
          </div>
        )}
      </div>
      
      <p className="text-xs text-gray-500 text-center">
        Assine acima usando seu dedo ou mouse
      </p>
    </div>
  );
};

export default DigitalSignature;

