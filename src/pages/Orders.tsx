import { useState, useEffect } from 'react';
import { format, parseISO, startOfDay, endOfDay, isWithinInterval } from 'date-fns';
import { IndianRupee } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from '@/components/ui/calendar';

interface Bill {
  id: number;
  date: string;
  amount: number;
}

const Orders = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    // Load bills from localStorage
    try {
      const savedBills = JSON.parse(localStorage.getItem('calbus-bills') || '[]');
      setBills(savedBills);
    } catch (error) {
      console.error('Error loading bills:', error);
      setBills([]);
    }
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd MMM yyyy, h:mm a');
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Filter bills by selected date (using startOfDay/endOfDay for accuracy)
  const filteredBills = selectedDate
    ? bills.filter(bill => {
        try {
          const billDate = typeof bill.date === 'string' ? parseISO(bill.date) : new Date(bill.date);
          return isWithinInterval(billDate, {
            start: startOfDay(selectedDate),
            end: endOfDay(selectedDate)
          });
        } catch {
          return false;
        }
      })
    : [];

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Order History</h1>
      <div className="mb-4 flex flex-col items-center">
        <Calendar
          mode="single"
          selected={selectedDate ?? undefined}
          onSelect={date => setSelectedDate(date ?? null)}
          className="rounded-md border shadow"
        />
      </div>
      {selectedDate === null ? (
        <div className="text-center py-10 text-gray-500">
          <p className="text-xl mb-2">Please select a date to view order history</p>
        </div>
      ) : filteredBills.length > 0 ? (
        <div className="space-y-4">
          {filteredBills.map((bill) => (
            <Card key={bill.id} className="overflow-hidden">
              <div className="px-4 py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">Order #{bill.id}</p>
                  <p className="text-sm text-gray-500">{formatDate(bill.date)}</p>
                </div>
                <div className="flex items-center">
                  <IndianRupee className="w-3 h-3 mr-1" />
                  <span className="font-semibold">
                    {typeof bill.amount === 'number' ? bill.amount.toFixed(2) : '0.00'}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          <p className="text-xl mb-2">No orders for this date</p>
          <p className="text-sm">Select a different date to see order history</p>
        </div>
      )}
    </div>
  );
};

export default Orders;
