/**
 * Utility functions for sorting rule data
 */

import { Rule, SortField } from '@/types/rules-table-types';
import { SortState, sortData } from './sorting-utils';

/**
 * Sort rules based on the current sort state
 * @param rules - Array of rules to sort
 * @param sortState - Current sort state
 * @returns Sorted array of rules
 */
export const sortRules = (
  rules: Rule[],
  sortState: SortState<SortField>
): Rule[] => {
  return sortData<Rule, SortField>(
    rules,
    sortState,
    (rule, field) => {
      if (field === 'status') {
        const statusOrder = { active: 0, pending: 1, inactive: 2 };
        return statusOrder[rule.status as keyof typeof statusOrder];
      }
      if (field === 'lastModified') {
        return new Date(rule[field]);
      }
      return rule[field];
    }
  );
};

/**
 * Get the CSS class for a rule status badge
 * @param status - Rule status
 * @returns CSS class string
 */
export const getStatusBadgeClass = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-app-success/20 text-app-success border-app-success/30';
    case 'pending':
      return 'bg-app-warning/20 text-app-warning border-app-warning/30';
    case 'inactive':
      return 'bg-app-danger/20 text-app-danger border-app-danger/30';
    default:
      return 'bg-gray-200 text-gray-700 border-gray-300';
  }
};

/**
 * Get the display text for a rule status
 * @param status - Rule status
 * @returns Formatted status text
 */
export const getStatusDisplayText = (status: string): string => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};
