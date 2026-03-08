'use client';

interface BookMetadataProps {
  totalReads: number;
  averageRating: number;
  category?: string;
  maxReadingDays?: number;
  isbn?: string;
}

export function BookMetadata({ 
  totalReads, 
  averageRating, 
  category, 
  maxReadingDays,
  isbn 
}: BookMetadataProps) {
  return (
    <div className="space-y-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div 
          className="border-2 p-3 rounded-lg" 
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <p className="text-xs uppercase mb-1" style={{ color: 'var(--muted-foreground)' }}>
            Total Reads
          </p>
          <p className="text-xl md:text-2xl font-bold">{totalReads}</p>
        </div>
        
        <div 
          className="border-2 p-3 rounded-lg" 
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <p className="text-xs uppercase mb-1" style={{ color: 'var(--muted-foreground)' }}>
            Rating
          </p>
          <p className="text-xl md:text-2xl font-bold">
            {averageRating > 0 ? `★ ${averageRating.toFixed(1)}` : 'N/A'}
          </p>
        </div>
        
        <div 
          className="border-2 p-3 rounded-lg" 
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <p className="text-xs uppercase mb-1" style={{ color: 'var(--muted-foreground)' }}>
            Category
          </p>
          <p className="text-sm font-bold uppercase truncate">{category || 'General'}</p>
        </div>
        
        <div 
          className="border-2 p-3 rounded-lg" 
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <p className="text-xs uppercase mb-1" style={{ color: 'var(--muted-foreground)' }}>
            Reading Period
          </p>
          <p className="text-xl md:text-2xl font-bold">{maxReadingDays || 14}</p>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>days</p>
        </div>
      </div>

      {/* ISBN */}
      {isbn && (
        <div 
          className="border-2 p-3 rounded-lg" 
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <p className="text-xs uppercase mb-1 font-bold" style={{ color: 'var(--muted-foreground)' }}>
            ISBN
          </p>
          <p className="text-sm font-bold">{isbn}</p>
        </div>
      )}
    </div>
  );
}
