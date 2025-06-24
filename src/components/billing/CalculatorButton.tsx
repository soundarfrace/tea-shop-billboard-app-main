import { getButtonClasses } from '@/utils/calculatorUtils';
import React from 'react';

interface CalculatorButtonProps {
  label: React.ReactNode;
  value: string;
  variant: string;
  span?: number;
  onClick: (btn: { value: string; variant: string }) => void;
}

const CalculatorButton = ({ label, value, variant, span, onClick }: CalculatorButtonProps) => {
  return (
    <button
      onClick={() => onClick({ value, variant })}
      className={`
        ${getButtonClasses(variant)}
        flex items-center justify-center
        rounded-full
        text-3xl
        font-semibold
        transition-all
        focus:outline-none
        h-20
        shadow-sm
        active:scale-95
        select-none
        border border-gray-300
        w-full
        ${span ? `col-span-${span}` : ''}
      `}
    >
      <span style={{ lineHeight: '1' }}>{label}</span>
    </button>
  );
};

export default CalculatorButton;
