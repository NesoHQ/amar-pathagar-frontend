'use client';

import { Button } from '@/components/ui/button';

interface DiscussionPostProps {
  idea: any;
  index: number;
  onVote: (ideaId: string, voteType: 'upvote' | 'downvote') => void;
}

export function DiscussionPost({ idea, index, onVote }: DiscussionPostProps) {
  return (
    <div className="border-2 hover:shadow-md transition-all rounded-lg overflow-hidden" style={{ borderColor: 'var(--border)' }}>
      {/* Header */}
      <div 
        className="bg-gradient-to-r from-gray-50 to-white p-3 md:p-4 border-b" 
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2 md:gap-3 flex-1 min-w-0">
            {/* Avatar */}
            <div 
              className="w-8 h-8 md:w-10 md:h-10 border-2 flex items-center justify-center flex-shrink-0 rounded-full" 
              style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
            >
              <span className="text-base md:text-lg">👤</span>
            </div>

            {/* Post Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold uppercase text-xs md:text-sm mb-1 leading-tight break-words">
                {idea.title}
              </h3>
              <div className="flex items-center gap-2 text-xs flex-wrap" style={{ color: 'var(--muted-foreground)' }}>
                <span className="font-bold">{idea.user?.username || 'Anonymous'}</span>
                <span>•</span>
                <span>
                  {new Date(idea.created_at || Date.now()).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span>•</span>
                <span>Post #{index + 1}</span>
              </div>
            </div>
          </div>

          {/* Vote Buttons */}
          <div className="flex gap-1 flex-shrink-0">
            <Button
              onClick={() => onVote(idea.id, 'upvote')}
              variant="outline"
              size="sm"
              className="px-2 py-1 h-auto text-xs hover:bg-green-50 hover:border-green-600"
              title="Upvote"
            >
              👍 {idea.upvotes}
            </Button>
            <Button
              onClick={() => onVote(idea.id, 'downvote')}
              variant="outline"
              size="sm"
              className="px-2 py-1 h-auto text-xs hover:bg-red-50 hover:border-red-600"
              title="Downvote"
            >
              👎 {idea.downvotes}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 md:p-4">
        <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--foreground)' }}>
          {idea.content}
        </p>
      </div>

      {/* Footer */}
      <div 
        className="px-3 md:px-4 py-2 border-t flex items-center justify-between text-xs" 
        style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span>💬</span>
            <span className="hidden sm:inline">0 replies</span>
            <span className="sm:hidden">0</span>
          </span>
        </div>
        <span
          className={`px-2 py-0.5 border rounded ${
            idea.upvotes - idea.downvotes > 0
              ? 'border-green-600 text-green-600'
              : idea.upvotes - idea.downvotes < 0
              ? 'border-red-600 text-red-600'
              : 'border-gray-400 text-gray-600'
          }`}
        >
          Score: {idea.upvotes - idea.downvotes}
        </span>
      </div>
    </div>
  );
}
