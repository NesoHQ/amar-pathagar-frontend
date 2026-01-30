interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  confirmColor?: 'red' | 'green' | 'blue' | 'orange'
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'blue'
}: ConfirmModalProps) {
  if (!isOpen) return null

  const colorClasses = {
    red: 'bg-red-600 hover:bg-red-700 border-red-600',
    green: 'bg-green-600 hover:bg-green-700 border-green-600',
    blue: 'bg-blue-600 hover:bg-blue-700 border-blue-600',
    orange: 'bg-orange-600 hover:bg-orange-700 border-orange-600'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-60"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md border-4 border-old-ink bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)]">
        {/* Header */}
        <div className="bg-gradient-to-r from-old-ink to-gray-800 text-old-paper p-4 border-b-4 border-old-ink">
          <h3 className="text-xl font-bold uppercase tracking-wider">{title}</h3>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-old-grey leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="p-4 border-t-2 border-old-border bg-gray-50 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 border-2 border-old-border text-old-grey hover:border-old-ink hover:text-old-ink 
                     font-bold uppercase text-sm tracking-wider transition-all"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className={`px-6 py-2 border-2 text-white font-bold uppercase text-sm tracking-wider transition-all ${colorClasses[confirmColor]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
