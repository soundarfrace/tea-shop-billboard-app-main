import { useEffect, forwardRef } from 'react';

interface BillingDisplayProps {
  currentTotal: number;
  displayExpression: string;
  onDisplayExpressionChange: (value: string) => void;
}

const BillingDisplay = forwardRef<HTMLInputElement, BillingDisplayProps>(
  ({ currentTotal, displayExpression, onDisplayExpressionChange }, ref) => {
    useEffect(() => {
      if (ref && typeof ref !== 'function' && ref.current) {
        ref.current.scrollLeft = ref.current.scrollWidth;
      }
    }, [displayExpression, ref]);

    return (
      <>
        {/* Top: Live Total Display */}
        <div className="pt-3 px-4 w-full">
          <div className="flex flex-col items-end mb-3">
            <div className="text-right text-primary text-xs pb-1 font-semibold"></div>
            <div className="bg-muted rounded-xl px-4 py-3 min-h-[60px] w-full flex items-center justify-end overflow-hidden">
              <span className="text-primary text-5xl font-mono select-all text-right">
                ₹ {currentTotal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>
        {/* Display Bar - Expression Field */}
        <div className="px-4 w-full pb-2">
          <div className="flex flex-col items-end">
            <div className="text-right text-muted-foreground text-xs pb-1"></div>
            <div className="bg-card border rounded-xl px-4 py-3 min-h-[100px] w-full overflow-hidden flex items-center">
              <input
                ref={ref}
                type="text"
                value={displayExpression}
                onChange={(e) => onDisplayExpressionChange(e.target.value)}
                className="text-foreground text-3xl font-mono bg-transparent outline-none w-full h-full text-right"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
);

BillingDisplay.displayName = 'BillingDisplay';

export default BillingDisplay;
