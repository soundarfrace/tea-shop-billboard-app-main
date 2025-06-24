import React, { useState, useEffect } from 'react';
import { format, subDays, eachDayOfInterval, startOfDay, endOfDay } from 'date-fns';
import { IndianRupee, Calendar, FileText, FileSpreadsheet, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { exportToPDF, exportToExcel } from '@/utils/exportUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Bill {
  id: number;
  date: string;
  amount: number;
  paymentMode?: "cash" | "card" | "upi";
}

interface DateRange {
  from: Date;
  to?: Date;
}

const Sales = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(),
    to: new Date()
  });
  const [salesData, setDailySales] = useState<number>(0);
  const [ordersCount, setOrdersCount] = useState<number>(0);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [bills, setBills] = useState<Bill[]>([]);
  const [filteredBills, setFilteredBills] = useState<Bill[]>([]);
  const [activeTab, setActiveTab] = useState<string>("sales");

  // Paymode-wise state
  const [paymodeTotals, setPaymodeTotals] = useState<{
    cash: number;
    card: number;
    upi: number;
  }>({ cash: 0, card: 0, upi: 0 });

  useEffect(() => {
    loadSalesData();
    loadBills();
    loadPaymodeWiseSales();
  }, [dateRange]);

  const loadSalesData = () => {
    if (!dateRange.from) return;

    const endDate = dateRange.to || dateRange.from;
    const dates = eachDayOfInterval({
      start: startOfDay(dateRange.from),
      end: endOfDay(endDate)
    });

    let totalSales = 0;
    let totalOrders = 0;

    dates.forEach(date => {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const dailySales = parseFloat(localStorage.getItem(`calbus-sales-${formattedDate}`) || '0');
      const dailyOrders = parseInt(localStorage.getItem(`calbus-orders-${formattedDate}`) || '0');

      totalSales += dailySales;
      totalOrders += dailyOrders;
    });

    setDailySales(totalSales);
    setOrdersCount(totalOrders);
  };

  const loadBills = () => {
    // Load all bills from localStorage
    try {
      const savedBills = JSON.parse(localStorage.getItem('calbus-bills') || '[]');
      // Sort bills by date (newest first)
      const sortedBills = savedBills.sort((a: Bill, b: Bill) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setBills(sortedBills);
      
      // Filter bills based on date range
      filterBillsByDateRange(sortedBills);
    } catch (error) {
      console.error('Error loading bills:', error);
      setBills([]);
      setFilteredBills([]);
    }
  };

  const filterBillsByDateRange = (billsToFilter: Bill[]) => {
    if (!dateRange.from) {
      setFilteredBills(billsToFilter);
      return;
    }

    const fromDate = startOfDay(dateRange.from);
    const toDate = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);

    const filtered = billsToFilter.filter((bill) => {
      const billDate = new Date(bill.date);
      return billDate >= fromDate && billDate <= toDate;
    });

    setFilteredBills(filtered);
  };

  // --- Paymode wise sales calculation ---
  const loadPaymodeWiseSales = () => {
    // Load all bills
    let savedBills: Bill[] = [];
    try {
      savedBills = JSON.parse(localStorage.getItem('calbus-bills') || '[]');
    } catch {
      savedBills = [];
    }

    // Filter bills by selected date range (inclusive)
    const fromDate = dateRange.from ? startOfDay(dateRange.from) : undefined;
    const toDate = dateRange.to ? endOfDay(dateRange.to) : fromDate;
    const filteredBills = savedBills.filter((bill) => {
      const billDate = new Date(bill.date);
      return fromDate && toDate
        ? billDate >= fromDate && billDate <= toDate
        : true;
    });

    // Sum amounts by paymode
    const totals = { cash: 0, card: 0, upi: 0 };
    filteredBills.forEach((bill) => {
      const mode = bill.paymentMode || "cash"; // fallback to cash if missing
      if (mode === "cash" || mode === "card" || mode === "upi") {
        totals[mode] += typeof bill.amount === "number" ? bill.amount : 0;
      }
    });
    setPaymodeTotals(totals);
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range) {
      setDateRange(range);
    }
  };

  const goToPreviousDay = () => {
    if (dateRange.from) {
      const newFrom = subDays(dateRange.from, 1);
      const newTo = dateRange.to ? subDays(dateRange.to, 1) : newFrom;
      setDateRange({ from: newFrom, to: newTo });
    }
  };

  const goToToday = () => {
    const today = new Date();
    setDateRange({ from: today, to: today });
  };

  const handleExportPDF = () => {
    try {
      if (salesData <= 0) {
        toast.error('No sales data to export');
        return;
      }

      exportToPDF({
        date: dateRange.from,
        ordersCount,
        salesAmount: salesData
      });

      toast.success('Sales report exported as PDF');
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      toast.error('Failed to export sales report');
    }
  };

  const handleExportExcel = () => {
    try {
      if (salesData <= 0) {
        toast.error('No sales data to export');
        return;
      }

      exportToExcel({
        date: dateRange.from,
        ordersCount,
        salesAmount: salesData
      });

      toast.success('Sales report exported as Excel');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('Failed to export sales report');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd MMM yyyy, h:mm a');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getDateDisplayText = () => {
    if (!dateRange.from) return 'Select dates';
    if (!dateRange.to || format(dateRange.from, 'yyyy-MM-dd') === format(dateRange.to, 'yyyy-MM-dd')) {
      return format(dateRange.from, 'dd MMM yyyy');
    }
    return `${format(dateRange.from, 'dd MMM')} - ${format(dateRange.to, 'dd MMM yyyy')}`;
  };

  const handleSendWhatsApp = () => {
    if (salesData <= 0) {
      toast.error('No sales data to send');
      return;
    }

    // Format the sales message
    const message = `*Calbus Sales Report*\n\n📅 *Date:* ${getDateDisplayText()}\n💰 *Total Sales:* ₹${salesData.toFixed(2)}\n📦 *Total Orders:* ${ordersCount}\n📊 *Average Order Value:* ₹${ordersCount > 0 ? (salesData / ordersCount).toFixed(2) : '0.00'}\n\n*Payment Breakdown:*\n💵 Cash: ₹${paymodeTotals.cash.toFixed(2)}\n💳 Card: ₹${paymodeTotals.card.toFixed(2)}\n📱 UPI: ₹${paymodeTotals.upi.toFixed(2)}`;

    // Create WhatsApp URL (without specific number, opens to share)
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    toast.success('WhatsApp opened with sales report');
  };

  return (
    <div className="p-3 max-w-md mx-auto bg-background dark:bg-background">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-lg font-semibold text-foreground">Sales & Orders</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8"
            onClick={handleSendWhatsApp}
            disabled={salesData <= 0}
          >
            <MessageCircle className="h-4 w-4 text-green-600" />
          </Button>
          
          <Popover open={showCalendar} onOpenChange={setShowCalendar}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Calendar className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="range"
                selected={dateRange}
                onSelect={(range) => {
                  handleDateRangeChange(range);
                  if (range?.from && range?.to) {
                    setShowCalendar(false);
                  }
                }}
                numberOfMonths={1}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Tabs */}
      <Tabs 
        defaultValue="sales" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="mb-4"
      >
        <TabsList className="grid w-full grid-cols-2 h-12 p-1 bg-gray-100 dark:bg-zinc-800 rounded-xl">
          <TabsTrigger 
            value="sales"
            className="relative rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white data-[state=active]:shadow-sm text-gray-600 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white"
          >
            <span className="relative z-10">Sales Report</span>
          </TabsTrigger>
          <TabsTrigger 
            value="orders"
            className="relative rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white data-[state=active]:shadow-sm text-gray-600 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white"
          >
            <span className="relative z-10">Order History</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales" className="space-y-3 mt-4">
          {/* Date Navigation */}
          <div className="flex justify-between items-center">
            <Button variant="outline" size="sm" onClick={goToPreviousDay} className="text-xs h-7 px-2">
              Previous
            </Button>
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-zinc-300">Selected Period</p>
              <p className="text-sm font-medium dark:text-zinc-100">{getDateDisplayText()}</p>
            </div>
            <Button variant="outline" size="sm" onClick={goToToday} className="text-xs h-7 px-2">
              Today
            </Button>
          </div>
          
          {/* Sales Cards */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-tshop-primary dark:bg-zinc-900">
              <CardHeader className="pb-1 pt-3 px-3">
                <CardTitle className="text-sm text-black dark:text-white">Total Sales</CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <div className="flex items-center text-lg font-bold text-black dark:text-white">
                  <IndianRupee className="mr-1 h-4 w-4" />
                  <span>{salesData.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="dark:bg-zinc-900">
              <CardHeader className="pb-1 pt-3 px-3">
                <CardTitle className="text-sm dark:text-white">Total Orders</CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <div className="text-lg font-bold dark:text-white">
                  {ordersCount}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Paymode breakdown */}
          <div className="rounded-xl bg-white dark:bg-zinc-900 shadow-xs p-3 mb-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-gray-600 dark:text-zinc-300">Payment mode breakdown</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/30 px-2 py-2 flex flex-col items-center">
                <span className="text-xs text-gray-600 dark:text-emerald-200">Cash</span>
                <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-300 text-sm">
                  <IndianRupee className="w-3 h-3" />
                  {paymodeTotals.cash.toFixed(2)}
                </span>
              </div>
              <div className="rounded-lg bg-blue-50 dark:bg-blue-900/30 px-2 py-2 flex flex-col items-center">
                <span className="text-xs text-gray-600 dark:text-blue-200">Card</span>
                <span className="flex items-center gap-1 font-bold text-blue-700 dark:text-blue-300 text-sm">
                  <IndianRupee className="w-3 h-3" />
                  {paymodeTotals.card.toFixed(2)}
                </span>
              </div>
              <div className="rounded-lg bg-violet-50 dark:bg-violet-900/30 px-2 py-2 flex flex-col items-center">
                <span className="text-xs text-gray-600 dark:text-violet-200">UPI</span>
                <span className="flex items-center gap-1 font-bold text-violet-700 dark:text-violet-300 text-sm">
                  <IndianRupee className="w-3 h-3" />
                  {paymodeTotals.upi.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Export buttons */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1 text-xs h-8"
              onClick={handleExportPDF}
              disabled={salesData <= 0}
            >
              <FileText className="mr-1" size={14} />
              PDF
            </Button>
            <Button 
              variant="outline"
              size="sm"
              className="flex-1 text-xs h-8"
              onClick={handleExportExcel}
              disabled={salesData <= 0}
            >
              <FileSpreadsheet className="mr-1" size={14} />
              Excel
            </Button>
          </div>
          
          {/* Sales Details */}
          {salesData > 0 ? (
            <Card className="dark:bg-zinc-900">
              <CardHeader className="pb-2 pt-3 px-3">
                <CardTitle className="text-sm dark:text-white">Sales Details</CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <div className="space-y-1">
                  <div className="flex justify-between py-1 border-b text-xs border-gray-200 dark:border-zinc-700">
                    <span>Period</span>
                    <span>{getDateDisplayText()}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b text-xs border-gray-200 dark:border-zinc-700">
                    <span>Orders</span>
                    <span>{ordersCount}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b text-xs border-gray-200 dark:border-zinc-700">
                    <span>Average Order Value</span>
                    <div className="flex items-center">
                      <IndianRupee className="mr-1 h-3 w-3" />
                      <span>
                        {ordersCount > 0 ? (salesData / ordersCount).toFixed(2) : '0.00'}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between py-1 font-medium text-xs">
                    <span>Total Sales</span>
                    <div className="flex items-center">
                      <IndianRupee className="mr-1 h-3 w-3" />
                      <span>{salesData.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <p className="text-sm mb-1">No sales data for this period</p>
              <p className="text-xs">Add bills to see sales data</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="orders" className="space-y-3 mt-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-semibold">Order History</h2>
            <div className="text-xs text-gray-500">
              {getDateDisplayText()}
            </div>
          </div>
          {filteredBills.length > 0 ? (
            <div className="space-y-2">
              {filteredBills.map((bill) => (
                <Card key={bill.id} className="overflow-hidden dark:bg-zinc-900">
                  <div className="px-3 py-2 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium dark:text-white">Order #{bill.id}</p>
                      <p className="text-xs text-gray-500 dark:text-zinc-300">{formatDate(bill.date)}</p>
                      {bill.paymentMode && (
                        <p className="text-xs text-gray-400 dark:text-zinc-400 capitalize mt-1">
                          {bill.paymentMode}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center">
                      <IndianRupee className="w-3 h-3 mr-1" />
                      <span className="text-sm font-semibold dark:text-white">
                        {typeof bill.amount === 'number' ? bill.amount.toFixed(2) : '0.00'}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <p className="text-sm mb-1">No orders for this period</p>
              <p className="text-xs">Change date range to see more orders</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Sales;
