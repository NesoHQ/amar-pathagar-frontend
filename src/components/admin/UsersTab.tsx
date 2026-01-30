interface UsersTabProps {
  users: any[]
  onAdjustScore: (userId: string, username: string) => void
  onUpdateRole: (userId: string, username: string, currentRole: string) => void
}

export default function UsersTab({ users, onAdjustScore, onUpdateRole }: UsersTabProps) {
  const userList = Array.isArray(users) ? users : []
  
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full border-2 border-old-border">
          <thead className="bg-old-ink text-old-paper">
            <tr>
              <th className="px-4 py-2 text-left uppercase text-xs">Username</th>
              <th className="px-4 py-2 text-left uppercase text-xs">Email</th>
              <th className="px-4 py-2 text-center uppercase text-xs">Role</th>
              <th className="px-4 py-2 text-center uppercase text-xs">Score</th>
              <th className="px-4 py-2 text-center uppercase text-xs">Books</th>
              <th className="px-4 py-2 text-center uppercase text-xs">Actions</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((user: any) => (
              <tr key={user.id} className="border-t-2 border-old-border hover:bg-gray-50">
                <td className="px-4 py-3 font-bold">{user.username}</td>
                <td className="px-4 py-3 text-sm text-old-grey">{user.email}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 text-xs font-bold uppercase ${
                    user.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-center font-bold">{user.success_score}</td>
                <td className="px-4 py-3 text-center text-sm">{user.books_shared}/{user.books_received}</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => onAdjustScore(user.id, user.username)}
                      className="px-2 py-1 border border-old-ink text-xs font-bold hover:bg-old-ink hover:text-old-paper transition-all"
                      title="Adjust score"
                    >
                      ±
                    </button>
                    <button
                      onClick={() => onUpdateRole(user.id, user.username, user.role)}
                      className="px-2 py-1 border border-old-ink text-xs font-bold hover:bg-old-ink hover:text-old-paper transition-all"
                      title="Toggle role"
                    >
                      ⚡
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
