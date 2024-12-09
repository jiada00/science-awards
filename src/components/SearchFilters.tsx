interface SearchFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export default function SearchFilters({
  searchQuery,
  onSearchChange
}: SearchFiltersProps) {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="搜索奖项..."
        className="w-full px-6 py-4 rounded-2xl search-input text-lg"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  )
} 