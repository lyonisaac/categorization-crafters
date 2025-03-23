/**
 * Rule Utilities
 * 
 * This module provides utility functions for working with categorization rules.
 */
import { Database } from '@/types/supabase-types';

// Type definitions
type BaseRule = Database['public']['Tables']['categorization_rules']['Row'];

// Extended rule type with our application-specific fields
export interface Rule extends BaseRule {
  conditions: RuleCondition[];
  target_category_id: string;
}

export interface RuleCondition {
  field: string;
  operator: string;
  value: string;
}

export type Transaction = {
  id: string;
  date: string;
  amount: number;
  memo: string | null;
  payee_name: string | null;
  category_id: string | null;
  category_name: string | null;
  [key: string]: any;
};

// Condition operators
export enum ConditionOperator {
  CONTAINS = 'contains',
  EQUALS = 'equals',
  STARTS_WITH = 'starts_with',
  ENDS_WITH = 'ends_with',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  REGEX = 'regex'
}

// Fields that can be used in rule conditions
export enum ConditionField {
  PAYEE = 'payee_name',
  MEMO = 'memo',
  AMOUNT = 'amount',
  DATE = 'date'
}

/**
 * Validates if a transaction matches a specific rule condition
 * 
 * @param transaction - The transaction to test
 * @param field - The field to check
 * @param operator - The operator to use
 * @param value - The value to compare against
 * @returns Whether the transaction matches the condition
 */
export function matchesCondition(
  transaction: Transaction,
  field: string,
  operator: string,
  value: string
): boolean {
  // Get the field value from the transaction
  const fieldValue = transaction[field];
  
  // If the field doesn't exist or is null, it doesn't match
  if (fieldValue === undefined || fieldValue === null) {
    return false;
  }

  // Convert values to strings for string operations
  const stringFieldValue = String(fieldValue).toLowerCase();
  const stringValue = String(value).toLowerCase();
  
  // Special handling for amount (convert to cents for comparison)
  if (field === ConditionField.AMOUNT) {
    const numericFieldValue = parseFloat(String(fieldValue));
    const numericValue = parseFloat(value);
    
    if (isNaN(numericFieldValue) || isNaN(numericValue)) {
      return false;
    }
    
    switch (operator) {
      case ConditionOperator.EQUALS:
        return numericFieldValue === numericValue;
      case ConditionOperator.GREATER_THAN:
        return numericFieldValue > numericValue;
      case ConditionOperator.LESS_THAN:
        return numericFieldValue < numericValue;
      default:
        return false;
    }
  }
  
  // String-based comparisons
  switch (operator) {
    case ConditionOperator.CONTAINS:
      return stringFieldValue.includes(stringValue);
    case ConditionOperator.EQUALS:
      return stringFieldValue === stringValue;
    case ConditionOperator.STARTS_WITH:
      return stringFieldValue.startsWith(stringValue);
    case ConditionOperator.ENDS_WITH:
      return stringFieldValue.endsWith(stringValue);
    case ConditionOperator.REGEX:
      try {
        const regex = new RegExp(value, 'i');
        return regex.test(String(fieldValue));
      } catch (error) {
        console.error('Invalid regex pattern:', value, error);
        return false;
      }
    default:
      return false;
  }
}

/**
 * Validates if a transaction matches all conditions in a rule
 * 
 * @param transaction - The transaction to test
 * @param rule - The rule to test against
 * @returns Whether the transaction matches all conditions in the rule
 */
export function matchesRule(transaction: Transaction, rule: Rule): boolean {
  if (!rule.conditions || !Array.isArray(rule.conditions)) {
    return false;
  }
  
  // Check each condition in the rule
  return rule.conditions.every(condition => 
    matchesCondition(
      transaction,
      condition.field,
      condition.operator,
      condition.value
    )
  );
}

/**
 * Finds the first matching rule for a transaction
 * 
 * @param transaction - The transaction to test
 * @param rules - The rules to test against
 * @returns The first matching rule or null if none match
 */
export function findMatchingRule(
  transaction: Transaction,
  rules: Rule[]
): Rule | null {
  // Sort rules by priority (if available) or creation date
  const sortedRules = [...rules].sort((a, b) => {
    if (a.priority !== undefined && b.priority !== undefined) {
      return a.priority - b.priority;
    }
    
    // Fall back to created_at if priority is not available
    const dateA = new Date(a.created_at || 0).getTime();
    const dateB = new Date(b.created_at || 0).getTime();
    return dateA - dateB;
  });
  
  // Find the first rule that matches
  return sortedRules.find(rule => matchesRule(transaction, rule)) || null;
}

/**
 * Applies rules to a transaction and returns the suggested category
 * 
 * @param transaction - The transaction to categorize
 * @param rules - The rules to apply
 * @returns The suggested category ID or null if no rules match
 */
export function getCategoryForTransaction(
  transaction: Transaction,
  rules: Rule[]
): string | null {
  const matchingRule = findMatchingRule(transaction, rules);
  return matchingRule?.target_category_id || null;
}

/**
 * Tests a rule against a set of transactions
 * 
 * @param rule - The rule to test
 * @param transactions - The transactions to test against
 * @returns Transactions that match the rule
 */
export function testRule(rule: Rule, transactions: Transaction[]): Transaction[] {
  return transactions.filter(transaction => matchesRule(transaction, rule));
}

/**
 * Validates a rule's structure and conditions
 * 
 * @param rule - The rule to validate
 * @returns Validation result with errors if any
 */
export function validateRule(rule: Partial<Rule>): { 
  valid: boolean; 
  errors: string[] 
} {
  const errors: string[] = [];
  
  // Check required fields
  if (!rule.name) {
    errors.push('Rule name is required');
  }
  
  if (!rule.target_category_id) {
    errors.push('Target category is required');
  }
  
  // Validate conditions
  if (!rule.conditions || !Array.isArray(rule.conditions) || rule.conditions.length === 0) {
    errors.push('At least one condition is required');
  } else {
    // Check each condition
    rule.conditions.forEach((condition, index) => {
      if (!condition.field) {
        errors.push(`Condition #${index + 1}: Field is required`);
      }
      
      if (!condition.operator) {
        errors.push(`Condition #${index + 1}: Operator is required`);
      }
      
      if (condition.value === undefined || condition.value === null || condition.value === '') {
        errors.push(`Condition #${index + 1}: Value is required`);
      }
      
      // Validate operator is valid for the field
      if (condition.field === ConditionField.AMOUNT) {
        const validOperators = [
          ConditionOperator.EQUALS,
          ConditionOperator.GREATER_THAN,
          ConditionOperator.LESS_THAN
        ];
        
        if (condition.operator && !validOperators.includes(condition.operator as ConditionOperator)) {
          errors.push(`Condition #${index + 1}: Invalid operator for amount field`);
        }
      }
      
      // Validate regex pattern
      if (condition.operator === ConditionOperator.REGEX && condition.value) {
        try {
          new RegExp(condition.value);
        } catch (error) {
          errors.push(`Condition #${index + 1}: Invalid regex pattern`);
        }
      }
    });
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

export default {
  matchesCondition,
  matchesRule,
  findMatchingRule,
  getCategoryForTransaction,
  testRule,
  validateRule,
  ConditionOperator,
  ConditionField
};
