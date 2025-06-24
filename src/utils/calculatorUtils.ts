/**
 * Safely evaluates a mathematical expression and returns the result.
 * Supports +, -, *, / operations with real-time calculation.
 */
export function parseAndSum(expr: string): number {
  if (!expr || expr.trim() === '' || expr === '0') return 0;
  
  try {
    // Clean the expression - replace display symbols with actual operators
    let cleanExpr = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/(\d+(?:\.\d+)?)%(?![\d.])/g, '($1/100)')
      .trim();
    
    // Remove trailing operators
    cleanExpr = cleanExpr.replace(/[+\-*/]\s*$/, '');
    
    // If expression is empty after cleaning, return 0
    if (!cleanExpr) return 0;
    
    // Handle simple cases
    if (!/[+\-*/]/.test(cleanExpr)) {
      const num = parseFloat(cleanExpr);
      return isNaN(num) ? 0 : num;
    }
    
    // Safely evaluate the expression using Function constructor instead of eval
    const result = Function('"use strict"; return (' + cleanExpr + ')')();
    
    // Check if result is a valid number
    if (isNaN(result) || !isFinite(result)) return 0;
    
    return result;
  } catch {
    // If evaluation fails, return 0
    return 0;
  }
}

export function getButtonClasses(variant: string): string {
  switch (variant) {
    case 'primary':
      return "bg-primary text-primary-foreground hover:bg-primary/90";
    case 'operator':
      return "bg-[#FF9800] text-white hover:bg-[#fb8c00]";
    case 'number':
      return "bg-secondary text-secondary-foreground hover:bg-secondary/80";
    case 'scientific':
      return "bg-accent text-accent-foreground hover:bg-accent/80";
    default:
      return "bg-muted text-muted-foreground hover:bg-muted/80";
  }
}

export interface CalculatorButton {
  label: string;
  value: string;
  variant: string;
  span?: number;
}
