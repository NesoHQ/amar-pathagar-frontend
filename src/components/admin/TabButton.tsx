interface TabButtonProps {
  active: boolean
  onClick: () => void
  label: string
}

export default function TabButton({ active, onClick, label }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 font-bold uppercase text-sm tracking-wider transition-all whitespace-nowrap ${
        active
          ? 'bg-old-ink text-old-paper'
          : 'bg-white text-old-grey hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  )
}
