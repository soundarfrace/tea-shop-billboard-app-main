
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Banknote, CreditCard, Smartphone, X, IndianRupee, ArrowRight } from "lucide-react";

type PaymentMode = 'cash' | 'card' | 'upi';

interface PaymentModeDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (mode: PaymentMode) => void;
  amount: number;
}

const PaymentModeDialog = ({ open, onClose, onConfirm, amount }: PaymentModeDialogProps) => {
  const handlePaymentSelect = (mode: PaymentMode) => {
    onConfirm(mode);
    onClose();
  };

  const paymentMethods = [
    {
      id: 'cash',
      label: 'Cash Payment',
      description: 'Pay with physical cash',
      icon: Banknote,
      gradient: 'from-emerald-500 to-green-600',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600'
    },
    {
      id: 'card',
      label: 'Card Payment',
      description: 'Debit or Credit Card',
      icon: CreditCard,
      gradient: 'from-blue-500 to-indigo-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      id: 'upi',
      label: 'UPI Payment',
      description: 'Quick digital payment',
      icon: Smartphone,
      gradient: 'from-purple-500 to-violet-600',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden bg-white">
        {/* Header with Amount */}
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="absolute right-4 top-4 h-8 w-8 text-white/80 hover:text-white hover:bg-white/10 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="text-center">
            <DialogTitle className="text-2xl font-bold mb-4 text-white">
              Choose Payment Method
            </DialogTitle>
            
            <div className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20">
              <IndianRupee className="w-6 h-6 text-emerald-400 mr-2" />
              <span className="text-3xl font-bold text-white">{amount.toFixed(2)}</span>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
        </div>
        
        {/* Payment Methods */}
        <div className="p-8 bg-gray-50">
          <div className="space-y-4">
            {paymentMethods.map((method, index) => {
              const Icon = method.icon;
              
              return (
                <button
                  key={method.id}
                  onClick={() => handlePaymentSelect(method.id as PaymentMode)}
                  className="group w-full flex items-center p-6 bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:scale-95"
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <div className={`p-4 rounded-xl ${method.iconBg} mr-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-6 w-6 ${method.iconColor}`} />
                  </div>
                  
                  <div className="flex-1 text-left">
                    <div className="font-bold text-gray-900 text-lg mb-1">
                      {method.label}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {method.description}
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${method.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <ArrowRight className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* Cancel Button */}
          <button
            onClick={onClose}
            className="w-full mt-8 p-4 text-gray-500 hover:text-gray-700 font-medium transition-colors rounded-xl hover:bg-gray-100"
          >
            Cancel Payment
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModeDialog;
