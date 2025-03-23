/**
 * Utility functions for sorting data
 */

export type SortDirection = 'asc' | 'desc' | 'none';

export interface SortState<T extends string> {
  field: T;
  direction: SortDirection;
}

/**
 * Get the next sort direction in the cycle: none -> asc -> desc -> none
 * @param currentDirection - Current sort direction
 * @returns Next sort direction
 */
export const getNextSortDirection = (currentDirection: SortDirection): SortDirection => {
  switch (currentDirection) {
    case 'none': return 'asc';
    case 'asc': return 'desc';
    case 'desc': return 'none';
    default: return 'none';
  }
};

/**
 * Update sort state based on the field clicked
 * @param prevState - Previous sort state
 * @param field - Field to sort by
 * @returns New sort state
 */
export const updateSortState = <T extends string>(
  prevState: SortState<T>,
  field: T
): SortState<T> => {
  if (prevState.field === field) {
    const nextDirection = getNextSortDirection(prevState.direction);
    return { field, direction: nextDirection };
  } else {
    return { field, direction: 'asc' };
  }
};

/**
 * Sort data by a specific field
 * @param data - Array of data to sort
 * @param sortState - Current sort state
 * @param getFieldValue - Function to get the value of the field to sort by
 * @returns Sorted array
 */
export function sortData<T, F extends string>(
  data: T[],
  sortState: SortState<F>,
  getFieldValue: (item: T, field: F) => any
): T[] {
  if (sortState.direction === 'none') {
    return [...data];
  }

  return [...data].sort((a, b) => {
    const valueA = getFieldValue(a, sortState.field);
    const valueB = getFieldValue(b, sortState.field);
    
    let comparison = 0;
    
    // Handle different types of values
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      comparison = valueA.localeCompare(valueB);
    } else if (valueA instanceof Date && valueB instanceof Date) {
      comparison = valueA.getTime() - valueB.getTime();
    } else if (typeof valueA === 'number' && typeof valueB === 'number') {
      comparison = valueA - valueB;
    } else if (typeof valueA === 'boolean' && typeof valueB === 'boolean') {
      comparison = valueA === valueB ? 0 : valueA ? 1 : -1;
    } else {
      // Try to convert to string for comparison
      comparison = String(valueA).localeCompare(String(valueB));
    }
    
    return sortState.direction === 'asc' ? comparison : -comparison;
  });
}
