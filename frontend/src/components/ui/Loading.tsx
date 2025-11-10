import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const Loading: React.FC<LoadingProps> = ({ size = 'md', text }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={clsx('border-4 border-border-default border-t-accent-emphasis rounded-full animate-spin', sizeClasses[size])} />
      {text && <p className="text-text-secondary text-sm">{text}</p>}
    </div>
  );
};

function clsx(...args: any[]) {
  return args.filter(Boolean).join(' ');
}
