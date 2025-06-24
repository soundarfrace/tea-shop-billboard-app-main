import React, { useState, useEffect } from 'react';
import { format, startOfToday, subDays } from 'date-fns';
import { IndianRupee, Calendar, BarChart2, Receipt, TrendingUp, Users, Clock, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { toast } from 'sonner';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [salesData, setSalesData] = useState<number>(0);
  const [ordersCount, setOrdersCount] = useState<number>(0);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [recentBills, setRecentBills] = useState<any[]>([]);
  const [monthlyStats, setMonthlyStats] = useState({ sales: 0, orders: 0 });
  
  useEffect(() => {
    loadSalesData();
    loadWeeklyData();
    loadRecentBills();
    loadMonthlyStats();
  }, [selectedDate]);
  
  const loadSalesData = () => {
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    
    // Get sales for the selected date
    const dailySales = parseFloat(localStorage.getItem(`calbus-sales-${formattedDate}`) || '0');
    setSalesData(dailySales);
    
    // Get orders count for the selected date
    const dailyOrders = parseInt(localStorage.getItem(`calbus-orders-${formattedDate}`) || '0');
    setOrdersCount(dailyOrders);
  };
  
  const loadWeeklyData = () => {
    const data = [];
    
    // Generate data for the last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = subDays(startOfToday(), i);
      const formattedDate = format(date, 'yyyy-MM-dd');
      const sales = parseFloat(localStorage.getItem(`calbus-sales-${formattedDate}`) || '0');
      const orders = parseInt(localStorage.getItem(`calbus-orders-${formattedDate}`) || '0');
      
      data.push({
        name: format(date, 'dd MMM'),
        sales,
        orders
      });
    }
    
    setWeeklyData(data);
  };

  const loadRecentBills = () => {
    const savedBills = JSON.parse(localStorage.getItem('calbus-bills') || '[]');
    const recent = savedBills.slice(-5).reverse(); // Get last 5 bills
    setRecentBills(recent);
  };

  const loadMonthlyStats = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    let monthlySales = 0;
    let monthlyOrders = 0;
    
    // Calculate for current month
    for (let day = 1; day <= now.getDate(); day++) {
      const date = new Date(currentYear, currentMonth, day);
      const formattedDate = format(date, 'yyyy-MM-dd');
      monthlySales += parseFloat(localStorage.getItem(`calbus-sales-${formattedDate}`) || '0');
      monthlyOrders += parseInt(localStorage.getItem(`calbus-orders-${formattedDate}`) || '0');
    }
    
    setMonthlyStats({ sales: monthlySales, orders: monthlyOrders });
  };
  
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
    setShowCalendar(false);
  };
  
  return (
    <div className="p-4 max-w-md mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Popover open={showCalendar} onOpenChange={setShowCalendar}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <Calendar className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={handleDateChange}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={() => navigate('/')}
              className="h-16 flex flex-col gap-1"
              variant="outline"
            >
              <Plus className="h-5 w-5" />
              <span className="text-xs">New Bill</span>
            </Button>
            <Button 
              onClick={() => navigate('/sales')}
              className="h-16 flex flex-col gap-1"
              variant="outline"
            >
              <BarChart2 className="h-5 w-5" />
              <span className="text-xs">View Sales</span>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Today's Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-tshop-primary text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <IndianRupee className="mr-1 h-4 w-4" />
              Today's Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{salesData.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <Receipt className="mr-1 h-4 w-4" />
              Orders Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ordersCount}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Overview */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <TrendingUp className="mr-1 h-4 w-4" />
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-lg font-bold">₹{monthlyStats.sales.toFixed(2)}</div>
              <div className="text-xs text-gray-500">{monthlyStats.orders} orders</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <Users className="mr-1 h-4 w-4" />
              Average Order
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              ₹{monthlyStats.orders > 0 ? (monthlyStats.sales / monthlyStats.orders).toFixed(2) : '0.00'}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Bills */}
      {recentBills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Recent Bills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentBills.map((bill, index) => (
                <div key={bill.id || index} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">₹{bill.amount.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">{bill.paymentMode?.toUpperCase()}</div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {format(new Date(bill.date), 'MMM dd, HH:mm')}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Weekly Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart2 className="mr-2" size={20} />
            Weekly Sales Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ChartContainer
              config={{
                sales: {
                  label: "Sales",
                  theme: {
                    light: "#7E69AB",
                    dark: "#7E69AB",
                  },
                },
                orders: {
                  label: "Orders",
                  theme: {
                    light: "#D6BCFA",
                    dark: "#D6BCFA",
                  },
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <XAxis 
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                  />
                  <YAxis 
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Bar
                    dataKey="sales"
                    fill="var(--color-sales)"
                    radius={[4, 4, 0, 0]}
                    barSize={16}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent labelKey="name" />}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
      
      {salesData <= 0 && ordersCount <= 0 && (
        <Card>
          <CardContent className="text-center p-8 text-gray-500">
            <p className="text-xl mb-2">No sales data for today</p>
            <p className="text-sm">Start adding bills to see your analytics</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
