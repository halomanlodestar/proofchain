"use client";

import type React from "react";
import { useState, useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils.ts";

// Generic type T represents the type of items in the list
interface DynamicInputProps<T> {
  fetchFunction: (query: string) => Promise<T[]>;
  renderListItem: (item: T) => React.ReactNode;
  onSelect: (item: T) => void;
  debounceTime?: number;
  placeholder?: string;
  className?: string;
  displayValue?: (item: T) => string;
}

export function DynamicInput<T>({
  fetchFunction,
  renderListItem,
  onSelect,
  debounceTime = 300,
  placeholder = "Start typing to search...",
  className,
  displayValue = (item: T) => {
    const itemAsAny = item as any;
    return itemAsAny.name || itemAsAny.title || JSON.stringify(item);
  },
}: DynamicInputProps<T>) {
  const [inputValue, setInputValue] = useState("");
  const [fetchedData, setFetchedData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedFetch = useMemo(() => {
    let timeout: NodeJS.Timeout;
    return (value: string) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        fetchData(value);
      }, debounceTime);
    };
  }, [debounceTime]);

  const fetchData = useCallback(
    async (value: string) => {
      if (value.trim() === "") {
        setFetchedData([]);
        return;
      }

      setIsLoading(true);
      try {
        const data = await fetchFunction(value);
        setFetchedData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setFetchedData([]);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchFunction],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedFetch(value);
  };

  const handleSelectItem = (item: T) => {
    setInputValue(displayValue(item));
    setFetchedData([]);
    onSelect(item);
  };

  return (
    <div className="relative w-full">
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={cn("w-full", className)}
      />
      {isLoading && (
        <div className="absolute right-3 top-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
        </div>
      )}
      {fetchedData.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
          {fetchedData.map((item, index) => (
            <li
              key={index}
              onClick={() => handleSelectItem(item)}
              className="cursor-pointer hover:bg-gray-100 p-2"
            >
              {renderListItem(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
