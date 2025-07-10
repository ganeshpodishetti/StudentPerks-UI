import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface AdminDealsSearchBarProps {
  onSearch: (term: string) => void;
  placeholder?: string;
}

export default function AdminDealsSearchBar({ onSearch, placeholder = 'Search deals...' }: AdminDealsSearchBarProps) {
  const [value, setValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className=" w-full max-w-xs">
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="h-10 text-sm border border-neutral-200 dark:border-neutral-800 rounded-full shadow-sm bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-blue-400 dark:focus:ring-neutral-400 focus:outline-none px-4"
      />
    </div>
  );
}
