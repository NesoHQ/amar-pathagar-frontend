'use client';

import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export interface DynamicDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  icon?: string;
  content?: React.ReactNode;
  actions?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'destructive' | 'secondary' | 'ghost' | 'link';
    className?: string;
  }[];
  showCloseButton?: boolean;
  closeButtonLabel?: string;
}

export function DynamicDialog({
  isOpen,
  onClose,
  title,
  description,
  icon,
  content,
  actions = [],
  showCloseButton = true,
  closeButtonLabel = 'Close',
}: DynamicDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="border-4 shadow-lg sm:max-w-md"
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
        showCloseButton={false}
      >
        <DialogHeader>
          {icon && (
            <div className="text-5xl mb-3 text-center">{icon}</div>
          )}
          <DialogTitle 
            className="text-2xl font-bold uppercase tracking-wider text-center"
            style={{ color: 'var(--foreground)' }}
          >
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription 
              className="text-base text-center"
              style={{ color: 'var(--foreground)' }}
            >
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        {content && (
          <div className="py-4">
            {content}
          </div>
        )}

        <DialogFooter className="flex-col sm:flex-col gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              onClick={action.onClick}
              variant={action.variant || 'default'}
              className={`w-full font-bold uppercase text-sm ${action.className || ''}`}
            >
              {action.label}
            </Button>
          ))}
          {showCloseButton && (
            <button
              onClick={onClose}
              className="text-sm underline transition-opacity hover:opacity-70"
              style={{ color: 'var(--muted-foreground)' }}
            >
              {closeButtonLabel}
            </button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Login Prompt Dialog - Specialized version
interface LoginPromptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  action?: string;
}

export function LoginPromptDialog({ 
  isOpen, 
  onClose, 
  action = 'perform this action' 
}: LoginPromptDialogProps) {
  const router = useRouter();

  return (
    <DynamicDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Login Required"
      description={`You need to be logged in to ${action}.`}
      icon="🔐"
      content={
        <div>
          <p className="text-sm mb-4 text-center" style={{ color: 'var(--muted-foreground)' }}>
            Join our community library to request books, participate in discussions, and more!
          </p>

          <div
            className="border-2 rounded-lg p-4 text-left space-y-2"
            style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}
          >
            <p className="text-xs uppercase font-bold mb-2" style={{ color: 'var(--muted-foreground)' }}>
              Member Benefits:
            </p>
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Request and borrow books</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Join book discussions</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Write reviews and earn points</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Track your reading history</span>
              </div>
            </div>
          </div>
        </div>
      }
      actions={[
        {
          label: 'Login',
          onClick: () => router.push('/login'),
          className: 'bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90',
        },
        {
          label: 'Sign Up',
          onClick: () => router.push('/register'),
          variant: 'outline',
          className: 'border-2',
        },
      ]}
      closeButtonLabel="Maybe later"
    />
  );
}
