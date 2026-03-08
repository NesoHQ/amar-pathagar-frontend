'use client';

import { Button } from '@/components/ui/button';

interface BookActionsProps {
  status: string;
  isRequested: boolean;
  isCurrentHolder: boolean;
  onRequest: () => void;
  onCancelRequest: () => void;
  onMarkCompleted: () => void;
}

export function BookActions({
  status,
  isRequested,
  isCurrentHolder,
  onRequest,
  onCancelRequest,
  onMarkCompleted,
}: BookActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {isRequested ? (
        <>
          <div 
            className="flex-1 p-3 border-4 border-green-600 bg-green-50 text-center rounded-lg"
          >
            <p className="text-base md:text-lg font-bold uppercase text-green-700 tracking-wider">
              ✓ Requested
            </p>
          </div>
          <Button
            onClick={onCancelRequest}
            variant="outline"
            className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-bold uppercase text-xs md:text-sm"
          >
            Cancel Request
          </Button>
        </>
      ) : status === 'available' || status === 'on_hold' ? (
        <Button
          onClick={onRequest}
          className="flex-1 font-bold uppercase text-xs md:text-sm"
          style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
        >
          Request This Book
        </Button>
      ) : status === 'reading' && isCurrentHolder ? (
        <Button
          onClick={onMarkCompleted}
          className="flex-1 border-2 border-green-600 bg-green-600 text-white hover:bg-green-700 font-bold uppercase text-xs md:text-sm"
        >
          ✓ Mark as Completed
        </Button>
      ) : null}
    </div>
  );
}
