'use client'

import { useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
}

export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'info'
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return 'border-red-700'
      case 'warning':
        return 'border-yellow-700'
      case 'info':
      default:
        return 'border-old-ink'
    }
  }

  const getConfirmButtonStyles = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-700 text-white border-red-700 hover:bg-red-800'
      case 'warning':
        return 'bg-yellow-700 text-white border-yellow-700 hover:bg-yellow-800'
      case 'info':
      default:
        return 'bg-old-ink text-old-paper border-old-ink hover:bg-old-paper hover:text-old-ink'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative bg-white border-4 ${getTypeStyles()} shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] max-w-md w-full animate-slide-up`}>
        {/* Decorative top border */}
        <div className={`h-2 ${type === 'danger' ? 'bg-red-700' : type === 'warning' ? 'bg-yellow-700' : 'bg-old-ink'}`} />
        
        {/* Content */}
        <div className="p-6">
          {/* Title */}
          <h2 className="text-2xl font-bold uppercase tracking-wider mb-4 border-b-2 border-old-border pb-2">
            {title}
          </h2>
          
          {/* Message */}
          <p className="text-old-grey leading-relaxed mb-6 font-serif">
            {message}
          </p>
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onConfirm}
              className={`flex-1 px-6 py-3 font-bold uppercase tracking-widest text-sm border-2 transition-all duration-200 shadow-md hover:shadow-lg ${getConfirmButtonStyles()}`}
            >
              {confirmText}
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 font-bold uppercase tracking-widest text-sm border-2 border-old-border text-old-ink bg-white hover:bg-old-border transition-all duration-200"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
