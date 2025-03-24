/**
 * Rule Import/Export Utility
 * 
 * This utility provides functions for importing and exporting rules
 * in a portable format (JSON).
 */

import type { Rule } from '@/types/rule-types';
import { rulesApi } from '@/services/api';

// Define the export format
export interface RuleExport {
  version: string;
  exportDate: string;
  rules: Omit<Rule, 'id' | 'lastModified'>[];
}

/**
 * Exports rules to a JSON string
 * @param rules - Array of rules to export
 * @returns JSON string containing the exported rules
 */
export const exportRules = (rules: Rule[]): string => {
  // Create export object
  const exportObj: RuleExport = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    rules: rules.map(rule => {
      // Omit id and lastModified
      const { id, lastModified, ...rest } = rule;
      return rest;
    })
  };
  
  // Convert to JSON string
  return JSON.stringify(exportObj, null, 2);
};

/**
 * Exports rules to a downloadable file
 * @param rules - Array of rules to export
 * @param filename - Optional filename (defaults to 'categorization-rules.json')
 */
export const downloadRulesExport = (
  rules: Rule[],
  filename = 'categorization-rules.json'
): void => {
  // Create export JSON
  const exportJson = exportRules(rules);
  
  // Create download link
  const blob = new Blob([exportJson], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  
  // Trigger download
  document.body.appendChild(a);
  a.click();
  
  // Clean up
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Validates imported rules
 * @param importData - The data to validate
 * @returns Boolean indicating whether the import is valid
 */
export const validateRuleImport = (importData: any): boolean => {
  // Check if import has required fields
  if (!importData || !importData.version || !importData.rules || !Array.isArray(importData.rules)) {
    return false;
  }
  
  // Check if rules have required fields
  for (const rule of importData.rules) {
    if (!rule.name || !rule.criteria || !rule.actions) {
      return false;
    }
    
    // Check if criteria are valid
    if (!Array.isArray(rule.criteria)) {
      return false;
    }
    
    for (const criterion of rule.criteria) {
      if (!criterion.type || !criterion.operator || criterion.value === undefined) {
        return false;
      }
    }
    
    // Check if actions are valid
    if (!Array.isArray(rule.actions)) {
      return false;
    }
    
    for (const action of rule.actions) {
      if (!action.type || action.value === undefined) {
        return false;
      }
    }
  }
  
  return true;
};

/**
 * Imports rules from a JSON string
 * @param jsonString - JSON string containing rules to import
 * @returns Array of imported rules (without IDs)
 */
export const parseRuleImport = (
  jsonString: string
): Omit<Rule, 'id'>[] | null => {
  try {
    // Parse JSON
    const importData = JSON.parse(jsonString) as RuleExport;
    
    // Validate import
    if (!validateRuleImport(importData)) {
      console.error('Invalid rule import format');
      return null;
    }
    
    // Extract rules
    return importData.rules.map(rule => ({
      ...rule,
      status: rule.status || 'inactive', // Default to inactive for safety
    }));
  } catch (error) {
    console.error('Error parsing rule import:', error);
    return null;
  }
};

/**
 * Imports rules from a file
 * @param file - File object containing rules to import
 * @returns Promise resolving to array of imported rules
 */
export const importRulesFromFile = async (
  file: File
): Promise<Omit<Rule, 'id'>[] | null> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const jsonString = event.target?.result as string;
      const rules = parseRuleImport(jsonString);
      resolve(rules);
    };
    
    reader.onerror = () => {
      console.error('Error reading file');
      resolve(null);
    };
    
    reader.readAsText(file);
  });
};

/**
 * Saves imported rules to the database
 * @param rules - Array of rules to save
 * @returns Promise resolving to array of saved rules
 */
export const saveImportedRules = async (
  rules: Omit<Rule, 'id'>[]
): Promise<Rule[]> => {
  const savedRules: Rule[] = [];
  
  // Save each rule
  for (const rule of rules) {
    const { data } = await rulesApi.createRule(rule);
    if (data) {
      savedRules.push(data);
    }
  }
  
  return savedRules;
};
