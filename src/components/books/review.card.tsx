'use client';

interface ReviewCardProps {
  review: any;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const ratings = [
    review.behavior_rating,
    review.book_condition_rating,
    review.communication_rating,
  ].filter((r) => r != null);
  
  const avgRating = ratings.length > 0 ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length : 0;

  return (
    <div className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-white p-3 md:p-4 rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div 
            className="w-8 h-8 md:w-10 md:h-10 border-2 border-purple-600 bg-purple-100 flex items-center justify-center flex-shrink-0 rounded-full"
          >
            <span className="text-sm md:text-base">👤</span>
          </div>
          <div>
            <p className="font-bold text-xs md:text-sm">
              {review.reviewer?.full_name || review.reviewer?.username || 'Anonymous'}
            </p>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              {new Date(review.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg md:text-xl font-bold text-purple-600">{avgRating.toFixed(1)}</div>
          <div className="text-xs md:text-sm">{'⭐'.repeat(Math.round(avgRating))}</div>
        </div>
      </div>

      {/* Rating Pills */}
      <div className="flex gap-2 mb-3 flex-wrap">
        {review.behavior_rating && (
          <span 
            className="px-2 py-1 border border-purple-200 text-xs rounded-full" 
            style={{ backgroundColor: 'var(--card)' }}
          >
            <span style={{ color: 'var(--muted-foreground)' }}>Behavior:</span>{' '}
            <span className="font-bold text-purple-600">{review.behavior_rating}/5</span>
          </span>
        )}
        {review.book_condition_rating && (
          <span 
            className="px-2 py-1 border border-purple-200 text-xs rounded-full" 
            style={{ backgroundColor: 'var(--card)' }}
          >
            <span style={{ color: 'var(--muted-foreground)' }}>Condition:</span>{' '}
            <span className="font-bold text-purple-600">{review.book_condition_rating}/5</span>
          </span>
        )}
        {review.communication_rating && (
          <span 
            className="px-2 py-1 border border-purple-200 text-xs rounded-full" 
            style={{ backgroundColor: 'var(--card)' }}
          >
            <span style={{ color: 'var(--muted-foreground)' }}>Communication:</span>{' '}
            <span className="font-bold text-purple-600">{review.communication_rating}/5</span>
          </span>
        )}
      </div>

      {/* Comment */}
      {review.comment && (
        <p className="text-xs md:text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
          "{review.comment}"
        </p>
      )}
    </div>
  );
}
