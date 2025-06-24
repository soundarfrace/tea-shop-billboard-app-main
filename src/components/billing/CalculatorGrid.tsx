import CalculatorButton from './CalculatorButton';
import { Delete } from 'lucide-react';

interface CalculatorGridProps {
  onButtonClick: (btn: { value: string; variant: string; }) => void;
  onOpenSaveDialog: () => void;
  currentTotal: number;
}

const CalculatorGrid = ({ onButtonClick, onOpenSaveDialog, currentTotal }: CalculatorGridProps) => {
  return (
    <div className="grid grid-cols-4 grid-rows-5 gap-3 w-full max-w-sm mx-auto">
      {/* Row 1 */}
      <CalculatorButton label="AC" value="clear" variant="primary" onClick={onButtonClick} />
      <CalculatorButton label={<Delete className="w-6 h-6 mx-auto" />} value="backspace" variant="secondary" onClick={onButtonClick} />
      <CalculatorButton label="%" value="percent" variant="secondary" onClick={onButtonClick} />
      <CalculatorButton label="÷" value="/" variant="operator" onClick={onButtonClick} />

      {/* Row 2 */}
      <CalculatorButton label="7" value="7" variant="number" onClick={onButtonClick} />
      <CalculatorButton label="8" value="8" variant="number" onClick={onButtonClick} />
      <CalculatorButton label="9" value="9" variant="number" onClick={onButtonClick} />
      <CalculatorButton label="×" value="*" variant="operator" onClick={onButtonClick} />

      {/* Row 3 */}
      <CalculatorButton label="4" value="4" variant="number" onClick={onButtonClick} />
      <CalculatorButton label="5" value="5" variant="number" onClick={onButtonClick} />
      <CalculatorButton label="6" value="6" variant="number" onClick={onButtonClick} />
      <CalculatorButton label="-" value="-" variant="operator" onClick={onButtonClick} />

      {/* Row 4 */}
      <CalculatorButton label="1" value="1" variant="number" onClick={onButtonClick} />
      <CalculatorButton label="2" value="2" variant="number" onClick={onButtonClick} />
      <CalculatorButton label="3" value="3" variant="number" onClick={onButtonClick} />
      <CalculatorButton label="+" value="+" variant="operator" onClick={onButtonClick} />
      
      {/* Row 5 */}
      <CalculatorButton label="0" value="0" variant="number" onClick={onButtonClick} />
      <CalculatorButton label="." value="." variant="number" onClick={onButtonClick} />

      <button
        disabled={currentTotal === 0 || isNaN(currentTotal)}
        onClick={onOpenSaveDialog}
        className={`
          ${currentTotal === 0 || isNaN(currentTotal) ? "opacity-50 cursor-not-allowed text-gray-300" : "text-white"}
          bg-[#27397C] hover:bg-[#1d285c]
          h-20 rounded-full text-2xl font-semibold transition-all focus:outline-none shadow-sm active:scale-95 select-none flex items-center justify-center
          col-span-2 px-12 border-0
        `}
      >
        <span>Sale</span>
      </button>
    </div>
  );
};

export default CalculatorGrid; 