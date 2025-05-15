import React from 'react';

interface LoadingStateProps {
  message?: string;
}

function LoadingState({ message = 'Carregando...' }: LoadingStateProps) {
  return (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
      <span>{message}</span>
    </div>
  );
}

export default LoadingState;