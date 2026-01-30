type TabType = 'overview' | 'requests' | 'users' | 'books'

interface OverviewTabProps {
  stats: any
  onNavigate: (tab: TabType) => void
}

export default function OverviewTab({ stats, onNavigate }: OverviewTabProps) {
  if (!stats) return <p className="text-center text-old-grey">Loading...</p>
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border-2 border-old-border p-4">
          <h3 className="font-bold uppercase tracking-wider mb-4 text-lg">📊 System Health</h3>
          <div className="space-y-3">
            <MetricRow label="Available Books" value={stats.available_books || 0} total={stats.total_books || 0} />
            <MetricRow label="Avg Success Score" value={Math.round(stats.avg_success_score || 0)} total={100} />
            <MetricRow label="Total Donations" value={stats.total_donations || 0} />
            <MetricRow label="Total Ideas" value={stats.total_ideas || 0} />
            <MetricRow label="Total Reviews" value={stats.total_reviews || 0} />
          </div>
        </div>

        <div className="border-2 border-old-border p-4">
          <h3 className="font-bold uppercase tracking-wider mb-4 text-lg">🎯 Quick Actions</h3>
          <div className="space-y-2">
            <button 
              onClick={() => onNavigate('users' as TabType)}
              className="w-full px-4 py-2 border-2 border-old-ink bg-white hover:bg-old-ink hover:text-old-paper transition-all font-bold uppercase text-sm"
            >
              👥 Manage Users
            </button>
            <button 
              onClick={() => onNavigate('requests' as TabType)}
              className="w-full px-4 py-2 border-2 border-old-ink bg-white hover:bg-old-ink hover:text-old-paper transition-all font-bold uppercase text-sm"
            >
              📬 View Requests
            </button>
            <button 
              onClick={() => onNavigate('books' as TabType)}
              className="w-full px-4 py-2 border-2 border-old-ink bg-white hover:bg-old-ink hover:text-old-paper transition-all font-bold uppercase text-sm"
            >
              📚 Manage Books
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricRow({ label, value, total }: { label: string; value: number; total?: number }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-old-grey uppercase tracking-wider">{label}</span>
      <span className="font-bold">
        {value}{total && ` / ${total}`}
      </span>
    </div>
  )
}
