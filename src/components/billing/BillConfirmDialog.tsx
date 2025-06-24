
import { Receipt } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from "@/components/ui/alert-dialog";

interface BillConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentTotal: number;
  payMode: "cash" | "card" | "upi";
  onPayModeChange: (mode: "cash" | "card" | "upi") => void;
  onConfirm: () => void;
}

const BillConfirmDialog = ({ 
  isOpen, 
  onOpenChange, 
  currentTotal, 
  payMode, 
  onPayModeChange, 
  onConfirm 
}: BillConfirmDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Sales</AlertDialogTitle>
          {/* <AlertDialogDescription>
            This bill will be saved and cannot be undone.
          </AlertDialogDescription> */}
        </AlertDialogHeader>
        <div className="flex justify-center gap-4 mt-2 mb-4">
          {[
            { label: "Cash", value: "cash" },
            { label: "Card", value: "card" },
            { label: "UPI", value: "upi" }
          ].map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => onPayModeChange(option.value as "cash" | "card" | "upi")}
              className={`flex-1 border-2 rounded-xl px-6 py-3 font-semibold transition
              ${
                payMode === option.value
                  ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                  : "border-gray-200 bg-gray-50 text-gray-500 hover:border-blue-300"
              }
            `}
              style={{ minWidth: "90px" }}
              aria-pressed={payMode === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onOpenChange(false);
              onConfirm();
            }}
          >
            Yes, Save
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BillConfirmDialog;
