import { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Download,
  Calendar,
  Filter,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  LineChart as LineChartIcon,
  Activity
} from 'lucide-react';
import { mockKPIData, mockPrograms } from '../data/mockData';
import { cn, formatNumber } from '../utils/helpers';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

function StatCard({ title, value, trend, trendUp, subtitle }) {
  return (
    <div className="card">
      <p className="text-sm text-secondary-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-secondary-900">{value}</h3>
      {subtitle && <p className="text-xs text-secondary-400 mt-1">{subtitle}</p>}
      {trend && (
        <div className={cn(
          "flex items-center gap-1 mt-2 text-sm",
          trendUp ? "text-success-600" : "text-danger-600"
        )}>
          {trendUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('ytd');
  const [reportType, setReportType] = useState('financial');

  // Export function to download analytics report as CSV
  const handleExport = () => {
    const csvContent = [
      ['Metric', 'Value', 'Trend'],
      ['Total Programs', portfolio.totalPrograms, '+2 vs last month'],
      ['On-Time Delivery', `${portfolio.onTimeDelivery}%`, '+3.2% vs last month'],
      ['Quality Score', portfolio.qualityScore, '-0.5% vs last month'],
      ['Customer Satisfaction', `${portfolio.customerSatisfaction}/5`, '+0.2 vs last quarter'],
      ['Revenue YTD', `$${formatNumber(financial.revenueYTD / 1000000, 1)}M`, ''],
      ['Gross Margin', `${financial.margin}%`, '+1.2% vs last year'],
      ['Bookings YTD', `$${formatNumber(financial.bookings / 1000000, 1)}M`, '+15% vs last year'],
      ['Overall OEE', `${operational.oee}%`, '+1.8% vs last month'],
      ['First Pass Yield', `${operational.firstPassYield}%`, '+0.5% vs last month'],
      ['On-Time Shipment', `${operational.onTimeShip}%`, '+2.1% vs last month'],
      ['Supplier OTD', `${operational.supplierOtd}%`, '-0.8% vs last month'],
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `analytics_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const portfolio = mockKPIData.portfolio;
  const financial = mockKPIData.financial;
  const operational = mockKPIData.operational;
  const trends = mockKPIData.trends;

  const programStatusData = [
    { name: 'Active', value: portfolio.active },
    { name: 'Delayed', value: portfolio.delayed },
    { name: 'On Hold', value: portfolio.onHold },
    { name: 'Completed', value: portfolio.completed },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Analytics & Reporting</h1>
          <p className="text-secondary-500">Executive dashboards, KPIs, and program analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input py-2"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="qtd">Quarter to Date</option>
            <option value="ytd">Year to Date</option>
            <option value="custom">Custom Range</option>
          </select>
          <button 
            onClick={handleExport}
            className="btn-outline flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Portfolio Overview */}
      <div>
        <h2 className="text-lg font-semibold text-secondary-900 mb-4">Portfolio Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard 
            title="Total Programs" 
            value={portfolio.totalPrograms}
            subtitle="Active projects"
            trend="+2 vs last month"
            trendUp={true}
          />
          <StatCard 
            title="On-Time Delivery" 
            value={`${portfolio.onTimeDelivery}%`}
            subtitle="Target: 95%"
            trend="+3.2% vs last month"
            trendUp={true}
          />
          <StatCard 
            title="Quality Score" 
            value={portfolio.qualityScore}
            subtitle="Out of 100"
            trend="-0.5% vs last month"
            trendUp={false}
          />
          <StatCard 
            title="Customer Satisfaction" 
            value={`${portfolio.customerSatisfaction}/5`}
            subtitle="Based on 45 responses"
            trend="+0.2 vs last quarter"
            trendUp={true}
          />
        </div>
      </div>

      {/* Financial Performance */}
      <div>
        <h2 className="text-lg font-semibold text-secondary-900 mb-4">Financial Performance</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card">
            <p className="text-sm text-secondary-500 mb-1">Revenue YTD</p>
            <h3 className="text-2xl font-bold text-secondary-900">${formatNumber(financial.revenueYTD / 1000000, 1)}M</h3>
            <div className="w-full bg-secondary-200 rounded-full h-2 mt-3">
              <div 
                className="h-2 bg-primary-500 rounded-full"
                style={{ width: `${(financial.revenueYTD / financial.revenueTarget) * 100}%` }}
              />
            </div>
            <p className="text-xs text-secondary-400 mt-2">
              {((financial.revenueYTD / financial.revenueTarget) * 100).toFixed(1)}% of ${formatNumber(financial.revenueTarget / 1000000, 1)}M target
            </p>
          </div>
          <StatCard 
            title="Gross Margin" 
            value={`${financial.margin}%`}
            subtitle="Industry avg: 22%"
            trend="+1.2% vs last year"
            trendUp={true}
          />
          <StatCard 
            title="Bookings YTD" 
            value={`$${formatNumber(financial.bookings / 1000000, 1)}M`}
            subtitle="New business"
            trend="+15% vs last year"
            trendUp={true}
          />
          <StatCard 
            title="Backlog" 
            value={`$${formatNumber((financial.bookings - financial.revenueYTD) / 1000000, 1)}M`}
            subtitle="Future revenue"
            trend="+8% vs last month"
            trendUp={true}
          />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-secondary-900">Revenue & Margin Trends</h3>
            <div className="flex items-center gap-2">
              <LineChartIcon className="w-5 h-5 text-secondary-400" />
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis yAxisId="left" stroke="#64748b" />
                <YAxis yAxisId="right" orientation="right" stroke="#64748b" domain={[20, 30]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
                <Bar yAxisId="left" dataKey="revenue" fill="#3b82f6" name="Revenue ($M)" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="margin" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e' }} name="Margin (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Program Distribution */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-secondary-900">Program Status Distribution</h3>
            <PieChartIcon className="w-5 h-5 text-secondary-400" />
          </div>
          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={programStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {programStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Operational KPIs */}
      <div>
        <h2 className="text-lg font-semibold text-secondary-900 mb-4">Operational Excellence</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard 
            title="Overall OEE" 
            value={`${operational.oee}%`}
            subtitle="World class: 85%"
            trend="+1.8% vs last month"
            trendUp={true}
          />
          <StatCard 
            title="First Pass Yield" 
            value={`${operational.firstPassYield}%`}
            subtitle="Quality metric"
            trend="+0.5% vs last month"
            trendUp={true}
          />
          <StatCard 
            title="On-Time Shipment" 
            value={`${operational.onTimeShip}%`}
            subtitle="Delivery performance"
            trend="+2.1% vs last month"
            trendUp={true}
          />
          <StatCard 
            title="Supplier OTD" 
            value={`${operational.supplierOtd}%`}
            subtitle="Supply chain metric"
            trend="-0.8% vs last month"
            trendUp={false}
          />
        </div>
      </div>

      {/* On-Time Delivery Trend */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-secondary-900">On-Time Delivery Trend</h3>
          <BarChartIcon className="w-5 h-5 text-secondary-400" />
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis domain={[80, 100]} stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="otd" fill="#22c55e" name="On-Time Delivery %" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Reports */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-secondary-900">Quick Reports</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Program Status Report', icon: Activity, color: 'bg-blue-100 text-blue-600' },
            { name: 'Quality Metrics Report', icon: BarChart3, color: 'bg-green-100 text-green-600' },
            { name: 'Production Dashboard', icon: LineChartIcon, color: 'bg-yellow-100 text-yellow-600' },
            { name: 'Financial Summary', icon: PieChartIcon, color: 'bg-purple-100 text-purple-600' },
          ].map((report, index) => {
            const Icon = report.icon;
            return (
              <button
                key={index}
                className="flex items-center gap-3 p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors text-left"
              >
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", report.color)}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-medium text-secondary-900 text-sm">{report.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Copyright Footer */}
      <div className="mt-8 pt-4 border-t border-secondary-200 text-center">
        <p className="text-sm text-secondary-500">Copyright belongs to Yashwanth created in 2026</p>
      </div>
    </div>
  );
}
