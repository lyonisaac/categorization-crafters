/**
 * Utility functions for formatting log data
 */

/**
 * Get the CSS class for an action badge
 * @param action - Action type
 * @returns CSS class string
 */
export const getActionColor = (action: string): string => {
  switch (action.toLowerCase()) {
    case 'categorize':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'tag':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'flag':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'notify':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'move':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

/**
 * Get the CSS class for an outcome badge
 * @param outcome - Outcome type
 * @returns CSS class string
 */
export const getOutcomeColor = (outcome: string): string => {
  switch (outcome.toLowerCase()) {
    case 'success':
      return 'bg-app-success/20 text-app-success border-app-success/30';
    case 'partial':
      return 'bg-app-warning/20 text-app-warning border-app-warning/30';
    case 'failure':
      return 'bg-app-danger/20 text-app-danger border-app-danger/30';
    case 'skipped':
      return 'bg-gray-200 text-gray-700 border-gray-300';
    default:
      return 'bg-gray-200 text-gray-700 border-gray-300';
  }
};

/**
 * Format a log action for display
 * @param action - Action type
 * @returns Formatted action text
 */
export const formatAction = (action: string): string => {
  return action.charAt(0).toUpperCase() + action.slice(1);
};

/**
 * Format a log outcome for display
 * @param outcome - Outcome type
 * @returns Formatted outcome text
 */
export const formatOutcome = (outcome: string): string => {
  return outcome.charAt(0).toUpperCase() + outcome.slice(1);
};
