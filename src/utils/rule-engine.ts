/**
 * Rule Processing Engine
 * 
 * This utility provides functions for evaluating rules against transactions
 * and applying rule actions to matching transactions.
 */

import type { Rule, Criterion, Action, PreviewTransaction } from '@/types/rule-types';
import { supabase } from '@/lib/supabase';

/**
 * Evaluates a single criterion against a transaction
 * @param criterion - The criterion to evaluate
 * @param transaction - The transaction to evaluate against
 * @returns Boolean indicating whether the criterion matches
 */
export const evaluateCriterion = (
  criterion: Criterion,
  transaction: PreviewTransaction
): boolean => {
  const { type, operator, value } = criterion;
  
  // Handle different field types
  switch (type) {
    case 'payee':
      return evaluateStringField(transaction.payee, operator, value);
    
    case 'memo':
      return evaluateStringField(transaction.memo, operator, value);
    
    case 'amount':
      return evaluateNumberField(transaction.amount, operator, value);
    
    case 'date':
      return evaluateDateField(transaction.date, operator, value);
    
    case 'account':
      return evaluateStringField(transaction.account, operator, value);
    
    default:
      console.warn(`Unknown criterion type: ${type}`);
      return false;
  }
};

/**
 * Evaluates a string field against a criterion
 * @param field - The field value to check
 * @param operator - The comparison operator
 * @param value - The value to compare against
 * @returns Boolean indicating whether the criterion matches
 */
export const evaluateStringField = (
  field: string,
  operator: string,
  value: string
): boolean => {
  if (!field) return false;
  
  switch (operator) {
    case 'contains':
      return field.toLowerCase().includes(value.toLowerCase());
    
    case 'equals':
      return field.toLowerCase() === value.toLowerCase();
    
    case 'starts_with':
      return field.toLowerCase().startsWith(value.toLowerCase());
    
    case 'ends_with':
      return field.toLowerCase().endsWith(value.toLowerCase());
    
    default:
      console.warn(`Unknown string operator: ${operator}`);
      return false;
  }
};

/**
 * Evaluates a number field against a criterion
 * @param field - The field value to check
 * @param operator - The comparison operator
 * @param value - The value to compare against
 * @returns Boolean indicating whether the criterion matches
 */
export const evaluateNumberField = (
  field: number,
  operator: string,
  value: string
): boolean => {
  if (field === undefined || field === null) return false;
  
  switch (operator) {
    case 'equals':
      return field === parseFloat(value);
    
    case 'greater_than':
      return field > parseFloat(value);
    
    case 'less_than':
      return field < parseFloat(value);
    
    case 'between': {
      const [min, max] = value.split(',').map(v => parseFloat(v.trim()));
      return field >= min && field <= max;
    }
    
    default:
      console.warn(`Unknown number operator: ${operator}`);
      return false;
  }
};

/**
 * Evaluates a date field against a criterion
 * @param field - The field value to check (ISO date string)
 * @param operator - The comparison operator
 * @param value - The value to compare against
 * @returns Boolean indicating whether the criterion matches
 */
export const evaluateDateField = (
  field: string,
  operator: string,
  value: string
): boolean => {
  if (!field) return false;
  
  const fieldDate = new Date(field);
  
  switch (operator) {
    case 'equals': {
      const valueDate = new Date(value);
      return fieldDate.toDateString() === valueDate.toDateString();
    }
    
    case 'after': {
      const valueDate = new Date(value);
      return fieldDate > valueDate;
    }
    
    case 'before': {
      const valueDate = new Date(value);
      return fieldDate < valueDate;
    }
    
    case 'between': {
      const [startStr, endStr] = value.split(',').map(v => v.trim());
      const startDate = new Date(startStr);
      const endDate = new Date(endStr);
      return fieldDate >= startDate && fieldDate <= endDate;
    }
    
    default:
      console.warn(`Unknown date operator: ${operator}`);
      return false;
  }
};

/**
 * Evaluates a rule against a transaction
 * @param rule - The rule to evaluate
 * @param transaction - The transaction to evaluate against
 * @returns Boolean indicating whether the rule matches
 */
export const evaluateRule = (
  rule: Rule,
  transaction: PreviewTransaction
): boolean => {
  // If rule has no criteria, it doesn't match
  if (!rule.criteria || rule.criteria.length === 0) {
    return false;
  }
  
  // Evaluate all criteria
  const results = rule.criteria.map(criterion => 
    evaluateCriterion(criterion, transaction)
  );
  
  // Apply AND logic (all criteria must match)
  return results.every(result => result);
};

/**
 * Applies rule actions to a transaction
 * @param actions - The actions to apply
 * @param transaction - The transaction to modify
 * @returns Modified transaction
 */
export const applyActions = (
  actions: Action[],
  transaction: any
): any => {
  // Create a copy of the transaction to modify
  const modifiedTransaction = { ...transaction };
  
  // Apply each action
  actions.forEach(action => {
    switch (action.type) {
      case 'category':
        modifiedTransaction.category = action.value;
        break;
      
      case 'flag':
        modifiedTransaction.flag = action.value;
        break;
      
      case 'memo':
        // For memo actions, we append to the existing memo
        if (modifiedTransaction.memo) {
          modifiedTransaction.memo += ` ${action.value}`;
        } else {
          modifiedTransaction.memo = action.value;
        }
        break;
      
      default:
        console.warn(`Unknown action type: ${action.type}`);
    }
  });
  
  return modifiedTransaction;
};

/**
 * Processes a transaction against all rules
 * @param transaction - The transaction to process
 * @param rules - Array of rules to check
 * @returns Modified transaction
 */
export const processTransaction = (
  transaction: PreviewTransaction,
  rules: Rule[]
): any => {
  // Sort rules by priority (if available)
  const sortedRules = [...rules].sort((a, b) => {
    const priorityA = (a as any).priority || 100;
    const priorityB = (b as any).priority || 100;
    return priorityA - priorityB;
  });
  
  // Create a copy of the transaction to modify
  let modifiedTransaction = { ...transaction };
  
  // Process each rule in order
  for (const rule of sortedRules) {
    // Skip inactive rules
    if (rule.status === 'inactive') continue;
    
    // Check if rule matches
    if (evaluateRule(rule, transaction)) {
      // Apply actions
      modifiedTransaction = applyActions(rule.actions, modifiedTransaction);
      
      // Log rule execution
      logRuleExecution(rule.id, transaction.id || 'preview', true);
    }
  }
  
  return modifiedTransaction;
};

/**
 * Logs rule execution to the database
 * @param ruleId - ID of the rule that was executed
 * @param transactionId - ID of the transaction that was processed
 * @param success - Whether the rule execution was successful
 * @param errorMessage - Optional error message if execution failed
 */
export const logRuleExecution = async (
  ruleId: string,
  transactionId: string,
  success: boolean,
  errorMessage?: string
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('rule_executions')
      .insert({
        rule_id: ruleId,
        transaction_id: transactionId,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        execution_time: new Date().toISOString(),
        success,
        error_message: errorMessage
      });
    
    if (error) {
      console.error('Error logging rule execution:', error);
    }
  } catch (error) {
    console.error('Error logging rule execution:', error);
  }
};

/**
 * Tests a rule against a preview transaction
 * @param rule - The rule to test
 * @param transaction - The transaction to test against
 * @returns Object containing match result and modified transaction
 */
export const testRule = (
  rule: Rule,
  transaction: PreviewTransaction
): { matches: boolean; result: any } => {
  const matches = evaluateRule(rule, transaction);
  const result = matches ? applyActions(rule.actions, transaction) : transaction;
  
  return { matches, result };
};
