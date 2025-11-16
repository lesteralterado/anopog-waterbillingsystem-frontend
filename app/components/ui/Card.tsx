// Lightweight re-export so imports using '@/components/ui/card' work
export * from './Card'

export default {} as any
import { ReactNode, MouseEventHandler } from 'react';

interface CardProps {
  className?: string;
  children: ReactNode;
  // Use React's MouseEventHandler so the prop matches the native onClick signature
  onClick?: MouseEventHandler<HTMLDivElement>;
}

interface CardHeaderProps {
  className?: string;
  children: ReactNode;
}

interface CardTitleProps {
  className?: string;
  children: ReactNode;
}

interface CardDescriptionProps {
  className?: string;
  children: ReactNode;
}

interface CardContentProps {
  className?: string;
  children: ReactNode;
}

interface CardFooterProps {
  className?: string;
  children: ReactNode;
}

export function Card({ className, children, onClick }: CardProps) {
  return (
    <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className || ''}`} onClick={onClick}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children }: CardHeaderProps) {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 ${className || ''}`}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children }: CardTitleProps) {
  return (
    <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className || ''}`}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children }: CardDescriptionProps) {
  return (
    <p className={`text-sm text-muted-foreground ${className || ''}`}>
      {children}
    </p>
  );
}

export function CardContent({ className, children }: CardContentProps) {
  return (
    <div className={`p-6 pt-0 ${className || ''}`}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children }: CardFooterProps) {
  return (
    <div className={`flex items-center p-6 pt-0 ${className || ''}`}>
      {children}
    </div>
  );
}
