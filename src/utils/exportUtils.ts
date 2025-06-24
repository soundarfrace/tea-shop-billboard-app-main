import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { utils, writeFile } from 'xlsx';

// Extended the jsPDF types to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface SalesData {
  date: Date;
  ordersCount: number;
  salesAmount: number;
}

// Function to export sales data to PDF
export const exportToPDF = (salesData: SalesData) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('Calbus Sales Report', 14, 22);
  
  // Add date
  doc.setFontSize(12);
  doc.text(`Date: ${format(salesData.date, 'dd MMM yyyy')}`, 14, 32);
  
  // Create table data
  const tableColumn = ['Description', 'Value'];
  const tableRows = [
    ['Date', format(salesData.date, 'dd MMM yyyy')],
    ['Total Orders', salesData.ordersCount.toString()],
    ['Total Sales Amount', `₹${salesData.salesAmount.toFixed(2)}`],
    ['Average Order Value', `₹${salesData.ordersCount > 0 ? 
      (salesData.salesAmount / salesData.ordersCount).toFixed(2) : 
      '0.00'}`]
  ];
  
  // Add table
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 40,
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 5
    },
    headStyles: {
      fillColor: [128, 0, 128],
      textColor: [255, 255, 255]
    }
  });
  
  // Save PDF
  const fileName = `sales-report-${format(salesData.date, 'yyyy-MM-dd')}`;
  doc.save(`${fileName}.pdf`);
};

// Function to export sales data to Excel
export const exportToExcel = (salesData: SalesData) => {
  // Create a new workbook
  const wb = utils.book_new();
  
  // Create data for the worksheet
  const wsData = [
    ['Calbus Sales Report'],
    [''],
    ['Date', format(salesData.date, 'dd MMM yyyy')],
    ['Total Orders', salesData.ordersCount],
    ['Total Sales Amount', salesData.salesAmount],
    ['Average Order Value', salesData.ordersCount > 0 ? 
      (salesData.salesAmount / salesData.ordersCount) : 0]
  ];
  
  // Create worksheet
  const ws = utils.aoa_to_sheet(wsData);
  
  // Add worksheet to workbook
  utils.book_append_sheet(wb, ws, 'Sales Report');
  
  // Generate Excel file
  const fileName = `sales-report-${format(salesData.date, 'yyyy-MM-dd')}`;
  writeFile(wb, `${fileName}.xlsx`);
};
