'use client';

interface BookCoverProps {
  coverUrl?: string;
  title: string;
  status: string;
  size?: 'small' | 'medium' | 'large';
}

export function BookCover({ coverUrl, title, status, size = 'medium' }: BookCoverProps) {
  const getStatusColor = (status: string) => {
    const colors = {
      available: 'bg-green-600',
      reading: 'bg-blue-600',
      requested: 'bg-orange-600',
      on_hold: 'bg-yellow-600',
    };
    return colors[status as keyof typeof colors] || colors.available;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      available: 'Available',
      reading: 'Out',
      requested: 'Requested',
      on_hold: 'On Hold',
    };
    return labels[status as keyof typeof labels] || status;
  };

  const sizeClasses = {
    small: 'aspect-2/3',
    medium: 'aspect-[3/4]',
    large: 'aspect-[3/4]',
  };

  const iconSizes = {
    small: 'text-4xl',
    medium: 'text-6xl',
    large: 'text-7xl',
  };

  return (
    <div 
      className="border-4 shadow-lg relative overflow-hidden rounded-lg" 
      style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
    >
      <div className={`${sizeClasses[size]} flex items-center justify-center`} style={{ backgroundColor: 'var(--muted)' }}>
        {coverUrl ? (
          <img src={coverUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <span className={iconSizes[size]}>📖</span>
        )}
      </div>
      
      {/* Status Badge */}
      <div className={`${getStatusColor(status)} text-white text-center py-2 font-bold uppercase text-xs md:text-sm tracking-wider`}>
        {getStatusLabel(status)}
      </div>
    </div>
  );
}
