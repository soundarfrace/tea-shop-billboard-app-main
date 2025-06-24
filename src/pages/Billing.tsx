import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import BillingDisplay from '@/components/billing/BillingDisplay';
import CalculatorGrid from '@/components/billing/CalculatorGrid';
import BillConfirmDialog from '@/components/billing/BillConfirmDialog';
import { parseAndSum } from '@/utils/calculatorUtils';
import { useCalculatorHistory } from '@/hooks/useCalculatorHistory';

const Billing = () => {
  const [displayValue, setDisplayValue] = useState('0');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [payMode, setPayMode] = useState<"cash" | "card" | "upi">("cash");
  const inputRef = useRef<HTMLInputElement>(null);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  
  const {
    addToHistory,
    navigateHistory,
    getCurrentEntry,
    isAtStart,
    isAtEnd
  } = useCalculatorHistory();

  useEffect(() => {
    if (inputRef.current && cursorPosition !== null) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
      setCursorPosition(null); 
    }
  }, [cursorPosition]);

  const getCurrentTotal = () => {
    if (!displayValue || displayValue === "Error") return 0;
    return parseAndSum(displayValue);
  };

  const handleButtonClick = (btn: { value: string; variant: string }) => {
    if (getCurrentEntry()) {
      toast.info("Return to current calculation to make changes", { duration: 1000 });
      return;
    }

    if (!inputRef.current) return;
    const { selectionStart, selectionEnd } = inputRef.current;
    if (selectionStart === null || selectionEnd === null) return;

    const insert = (value: string) => {
      let insertValue = value;
      if (btn.variant === 'operator') {
        if (value === '*') insertValue = '\u00d7';
        else if (value === '/') insertValue = '\u00f7';
      }

      // Prevent multiple decimals
      if (value === '.') {
        const part = displayValue.slice(0, selectionStart).split(/[\+\-\u00d7\u00f7]/).pop() || '';
        const afterCursor = displayValue.slice(selectionStart).split(/[\+\-\u00d7\u00f7]/)[0] || '';
        if ((part + afterCursor).includes('.')) return;
      }
      
      let newDisplayValue = displayValue.slice(0, selectionStart) + insertValue + displayValue.slice(selectionEnd);
      if (displayValue === '0' && value !== '.') {
        newDisplayValue = insertValue;
      }
      
      setDisplayValue(newDisplayValue);
      setCursorPosition(selectionStart + insertValue.length);
    };

    const backspace = () => {
      let newDisplayValue;
      let newCursorPos;
      if (selectionStart !== selectionEnd) {
        newDisplayValue = displayValue.slice(0, selectionStart) + displayValue.slice(selectionEnd);
        newCursorPos = selectionStart;
      } else {
        if (selectionStart === 0) return;
        newDisplayValue = displayValue.slice(0, selectionStart - 1) + displayValue.slice(selectionStart);
        newCursorPos = selectionStart - 1;
      }
      if (newDisplayValue === '') {
        setDisplayValue('0');
        setCursorPosition(1);
      } else {
        setDisplayValue(newDisplayValue);
        setCursorPosition(newCursorPos);
      }
    };

    switch (btn.value) {
      case 'clear':
        setDisplayValue('0');
        break;
      case 'backspace':
        backspace();
        break;
      case 'percent':
        toast.info("This function not supported yet.", { duration: 1200 });
        break;
      case '.':
      case '+':
      case '-':
      case '*':
      case '/':
        insert(btn.value);
        break;
      default:
        if (btn.variant === 'number') {
          insert(btn.value);
        }
        break;
    }
  };

  const openSaveDialog = () => {
    const total = getCurrentTotal();
    if (total === 0 || isNaN(total)) {
      toast.error("Enter a valid amount greater than 0 before billing.", { duration: 1000 });
      return;
    }
    setIsConfirmOpen(true);
  };

  const saveBill = () => {
    const total = getCurrentTotal();
    if (isNaN(total) || total === 0) {
      toast.error("Enter a valid amount greater than 0 before billing.", { duration: 1000 });
      return;
    }
    const bill = {
      id: Date.now(),
      date: new Date(),
      amount: total,
      paymentMode: payMode
    };
    const savedBills = JSON.parse(localStorage.getItem('calbus-bills') || '[]');
    localStorage.setItem('calbus-bills', JSON.stringify([...savedBills, bill]));
    const todayOrdersKey = `calbus-orders-${format(new Date(), 'yyyy-MM-dd')}`;
    const todayOrders = parseInt(localStorage.getItem(todayOrdersKey) || '0');
    localStorage.setItem(todayOrdersKey, (todayOrders + 1).toString());
    const todaySalesKey = `calbus-sales-${format(new Date(), 'yyyy-MM-dd')}`;
    const todaySales = parseFloat(localStorage.getItem(todaySalesKey) || '0');
    localStorage.setItem(todaySalesKey, (todaySales + total).toString());
    toast.success(`Bill saved successfully!`, { duration: 1000 });
    setDisplayValue('0');
    setPayMode('cash');
  };

  return (
    <div className="container mx-auto max-w-md bg-background flex flex-col p-4">
      <BillingDisplay 
        ref={inputRef}
        currentTotal={getCurrentTotal()} 
        displayExpression={displayValue}
        onDisplayExpressionChange={setDisplayValue}
      />
      <div className="pt-20 pb-4">
        <CalculatorGrid 
          onButtonClick={handleButtonClick}
          onOpenSaveDialog={openSaveDialog}
          currentTotal={getCurrentTotal()}
        />
        <BillConfirmDialog
          isOpen={isConfirmOpen}
          onOpenChange={setIsConfirmOpen}
          currentTotal={getCurrentTotal()}
          payMode={payMode}
          onPayModeChange={setPayMode}
          onConfirm={saveBill}
        />
      </div>
    </div>
  );
};

export default Billing;
