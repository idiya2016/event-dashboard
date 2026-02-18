import React from 'react';
import styles from './SearchFilter.module.css';

interface SearchFilterProps {
  searchQuery: string;
  dateFilter: string;
  onSearchChange: (query: string) => void;
  onDateChange: (date: string) => void;
  onClear: () => void;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  searchQuery,
  dateFilter,
  onSearchChange,
  onDateChange,
  onClear,
}) => {
  return (
    <div className={styles.searchFilter}>
      <div className={styles.searchBox}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          type="text"
          placeholder="Search events by name or location..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.searchInput}
        />
        {searchQuery && (
          <button className={styles.clearSearch} onClick={() => onSearchChange('')}>
            ×
          </button>
        )}
      </div>
      <div className={styles.filterGroup}>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => onDateChange(e.target.value)}
          className={styles.dateInput}
        />
        {(searchQuery || dateFilter) && (
          <button className={styles.clearButton} onClick={onClear}>
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};
