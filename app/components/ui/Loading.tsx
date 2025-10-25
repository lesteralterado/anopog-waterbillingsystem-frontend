interface LoadingProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12'
};

export function Loading({ className, size = 'md' }: LoadingProps) {
  return (
    <div className="flex items-center justify-center">
      <div
        className={`
          animate-spin rounded-full border-2 border-current border-t-transparent
          ${sizeClasses[size]}
          ${className || ''}
        `}
      />
    </div>
  );
}
