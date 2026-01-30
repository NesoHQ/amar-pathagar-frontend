interface StatCardProps {
  icon: string
  label: string
  value: number
  color: 'blue' | 'green' | 'orange' | 'purple'
}

export default function StatCard({ icon, label, value, color }: StatCardProps) {
  const colors = {
    blue: 'border-blue-600 bg-gradient-to-br from-blue-50 to-blue-100',
    green: 'border-green-600 bg-gradient-to-br from-green-50 to-green-100',
    orange: 'border-orange-600 bg-gradient-to-br from-orange-50 to-orange-100',
    purple: 'border-purple-600 bg-gradient-to-br from-purple-50 to-purple-100',
  }
  
  return (
    <div className={`border-4 ${colors[color]} p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]`}>
      <div className="text-center">
        <div className="text-4xl mb-2">{icon}</div>
        <p className="text-3xl font-bold mb-1">{value}</p>
        <p className="text-xs uppercase tracking-wider text-old-grey">{label}</p>
      </div>
    </div>
  )
}
