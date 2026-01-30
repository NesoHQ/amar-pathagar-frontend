interface RequestsTabProps {
  requests: any[]
  onApprove: (id: string) => void
  onReject: (id: string) => void
}

export default function RequestsTab({ requests, onApprove, onReject }: RequestsTabProps) {
  const requestList = Array.isArray(requests) ? requests : []
  
  if (requestList.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-old-grey uppercase tracking-wider">No pending requests</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {requestList.map((req: any) => (
        <div key={req.id} className="border-2 border-old-border p-4 hover:border-old-ink transition-all">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-bold uppercase text-lg mb-1">{req.book?.title || 'Unknown Book'}</h3>
              <p className="text-sm text-old-grey mb-2">by {req.book?.author || 'Unknown'}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <strong>User:</strong> {req.user?.username || req.user?.full_name}
                </span>
                <span className="flex items-center gap-1">
                  <strong>Score:</strong> {req.user?.success_score || 0}
                </span>
                <span className="flex items-center gap-1">
                  <strong>Priority:</strong> {req.priority_score?.toFixed(1) || 0}
                </span>
                <span className="flex items-center gap-1">
                  <strong>Requested:</strong> {new Date(req.requested_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onApprove(req.id)}
                className="px-4 py-2 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-bold uppercase text-xs transition-all"
              >
                ✓ Approve
              </button>
              <button
                onClick={() => onReject(req.id)}
                className="px-4 py-2 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-bold uppercase text-xs transition-all"
              >
                ✗ Reject
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
