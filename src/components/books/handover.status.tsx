'use client';

import { Button } from '@/components/ui/button';

interface HandoverStatusProps {
  readingStatus?: any;
  handoverThread?: any;
  userId?: string;
  onMarkCompleted: () => void;
  onMarkDelivered: () => void;
  onOpenThread: () => void;
}

export function HandoverStatus({
  readingStatus,
  handoverThread,
  userId,
  onMarkCompleted,
  onMarkDelivered,
  onOpenThread,
}: HandoverStatusProps) {
  if (!readingStatus && !handoverThread) {
    return null;
  }

  return (
    <div 
      className="border-4 border-blue-600 shadow-lg rounded-lg overflow-hidden" 
      style={{ backgroundColor: 'var(--card)' }}
    >
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-3 md:p-4 flex items-center gap-2">
        <span className="text-lg md:text-xl">🔄</span>
        <h2 className="text-base md:text-xl font-bold uppercase tracking-wider">
          Book Handover Status
        </h2>
      </div>

      <div className="p-4 md:p-6 space-y-4">
        {/* Reading Status for Current Holder */}
        {readingStatus && (
          <div className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg">
            <h3 className="font-bold uppercase text-sm mb-3 flex items-center gap-2">
              <span className="text-xl">📖</span>
              Your Reading Status
            </h3>
            <div className="space-y-2 text-sm mb-4">
              {readingStatus.due_date && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span style={{ color: 'var(--muted-foreground)' }}>Due Date:</span>
                  <span className="font-bold">
                    {new Date(readingStatus.due_date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  {new Date(readingStatus.due_date) < new Date() && (
                    <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold uppercase rounded">
                      Overdue
                    </span>
                  )}
                </div>
              )}
              <div className="flex items-center gap-2">
                <span style={{ color: 'var(--muted-foreground)' }}>Status:</span>
                <span
                  className={`px-2 py-0.5 text-xs font-bold uppercase rounded ${
                    readingStatus.is_completed ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'
                  }`}
                >
                  {readingStatus.is_completed ? 'Completed' : 'Reading'}
                </span>
              </div>
              {readingStatus.next_reader && (
                <div className="flex items-center gap-2">
                  <span style={{ color: 'var(--muted-foreground)' }}>Next Reader:</span>
                  <span className="font-bold">
                    {readingStatus.next_reader.full_name || readingStatus.next_reader.username}
                  </span>
                </div>
              )}
            </div>

            {!readingStatus.is_completed && (
              <Button
                onClick={onMarkCompleted}
                className="border-2 border-green-600 bg-green-600 text-white hover:bg-green-700 font-bold uppercase text-xs"
              >
                ✓ Mark as Completed
              </Button>
            )}
          </div>
        )}

        {/* Next Reader Status */}
        {!readingStatus && handoverThread && handoverThread.next_holder_id === userId && (
          <div className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-white p-4 rounded-lg">
            <h3 className="font-bold uppercase text-sm mb-3 flex items-center gap-2">
              <span className="text-xl">📬</span>
              You're Next in Line!
            </h3>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex items-center gap-2">
                <span style={{ color: 'var(--muted-foreground)' }}>Current Holder:</span>
                <span className="font-bold">
                  {handoverThread.current_holder?.full_name ||
                    handoverThread.current_holder?.username ||
                    'Book Owner'}
                </span>
              </div>
            </div>

            <Button
              onClick={onMarkDelivered}
              className="border-2 border-green-600 bg-green-600 text-white hover:bg-green-700 font-bold uppercase text-xs"
            >
              ✓ Confirm Delivery Received
            </Button>
          </div>
        )}

        {/* Handover Thread Link */}
        {handoverThread && handoverThread.id && (
          <div 
            className="border-2 p-4 rounded-lg" 
            style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold uppercase text-sm mb-1 flex items-center gap-2">
                  <span className="text-xl">💬</span>
                  Handover Coordination Thread
                </h3>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  Coordinate the book handover with the other party
                </p>
              </div>
              <Button
                onClick={onOpenThread}
                className="font-bold uppercase text-xs whitespace-nowrap"
                style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
              >
                Open Thread →
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
