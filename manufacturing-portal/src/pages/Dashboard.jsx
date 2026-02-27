import { useState } from 'react';
import { 
  FolderKanban, 
  Factory, 
  ShieldCheck, 
  Truck, 
  Wrench, 
  Users, 
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { mockPrograms, mockKPIData, mockProductionData, mockQualityData } from '../data/mockData';
import { formatDate, getStatusColor, cn } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/common/Modal';

function StatCard({ title, value, subtitle, trend, trendUp, icon: Icon, color, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "card p-5 cursor-pointer transition-all duration-200 hover:shadow-md",
        onClick && "hover:border-primary-300"
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-secondary-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-secondary-900">{value}</h3>
          {subtitle && <p className="text-xs text-secondary-400 mt-1">{subtitle}</p>}
          {trend && (
            <div className={cn(
              "flex items-center gap-1 mt-2 text-sm",
              trendUp ? "text-success-600" : "text-danger-600"
            )}>
              <TrendingUp className={cn("w-4 h-4", !trendUp && "rotate-180")} />
              <span>{trend}</span>
            </div>
          )}
        </div>
        <div className={cn("p-3 rounded-xl", color)}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

function AlertItem({ type, message, time, program }) {
  const icons = {
    warning: AlertCircle,
    error: AlertCircle,
    info: Clock,
    success: CheckCircle,
  };
  const colors = {
    warning: 'text-warning-600 bg-warning-50',
    error: 'text-danger-600 bg-danger-50',
    info: 'text-primary-600 bg-primary-50',
    success: 'text-success-600 bg-success-50',
  };
  const Icon = icons[type];

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary-50 transition-colors">
      <div className={cn("p-2 rounded-lg", colors[type])}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-secondary-900 truncate">{message}</p>
        {program && <p className="text-xs text-secondary-500">{program}</p>}
        <p className="text-xs text-secondary-400 mt-1">{time}</p>
      </div>
    </div>
  );
}

function ProgramRow({ program, onClick }) {
  const statusColor = getStatusColor(program.status);
  
  return (
    <div 
      onClick={onClick}
      className="flex items-center gap-4 p-4 hover:bg-secondary-50 rounded-lg cursor-pointer transition-colors"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-secondary-900 truncate">{program.name}</h4>
          <span className={cn("badge badge-" + statusColor)}>
            {program.status.replace('_', ' ')}
          </span>
        </div>
        <p className="text-sm text-secondary-500">{program.customer} • {program.site}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-secondary-900">{program.progress}%</p>
        <p className="text-xs text-secondary-400">Due {formatDate(program.targetDate)}</p>
      </div>
      <div className="w-24">
        <div className="h-2 bg-secondary-200 rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full rounded-full transition-all",
              program.progress >= 75 ? "bg-success-500" : 
              program.progress >= 50 ? "bg-primary-500" : "bg-warning-500"
            )}
            style={{ width: `${program.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const kpi = mockKPIData.portfolio;
  const recentPrograms = mockPrograms.slice(0, 4);
  const operationalKPI = mockKPIData.operational;
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Dashboard</h1>
          <p className="text-secondary-500">Welcome back! Here's what's happening across your operations.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-secondary-500">Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Active Programs" 
          value={kpi.active}
          subtitle={`${kpi.totalPrograms} total programs`}
          trend="+2 this month"
          trendUp={true}
          icon={FolderKanban}
          color="bg-primary-600"
          onClick={() => navigate('/programs')}
        />
        <StatCard 
          title="On-Time Delivery" 
          value={`${kpi.onTimeDelivery}%`}
          subtitle="Target: 95%"
          trend="+3.2% vs last month"
          trendUp={true}
          icon={Truck}
          color="bg-success-600"
          onClick={() => navigate('/supply-chain')}
        />
        <StatCard 
          title="Quality Score" 
          value={kpi.qualityScore}
          subtitle="Out of 100 points"
          trend="-0.5% vs last month"
          trendUp={false}
          icon={ShieldCheck}
          color="bg-warning-600"
          onClick={() => navigate('/quality')}
        />
        <StatCard 
          title="OEE" 
          value={`${operationalKPI.oee}%`}
          subtitle="Overall Equipment Efficiency"
          trend="+1.8% vs last month"
          trendUp={true}
          icon={Factory}
          color="bg-secondary-600"
          onClick={() => navigate('/production')}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Programs Section */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-secondary-900">Active Programs</h2>
            <button 
              onClick={() => navigate('/programs')}
              className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-secondary-100">
            {recentPrograms.map(program => (
              <ProgramRow 
                key={program.id} 
                program={program} 
                onClick={() => navigate('/programs')}
              />
            ))}
          </div>
        </div>

        {/* Alerts Section */}
        <div className="card">
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">Recent Alerts</h2>
          <div className="space-y-1">
            <AlertItem 
              type="error" 
              message="Critical: Material Certificate Missing"
              program="PRG-001 - Aerospace Component"
              time="2 hours ago"
            />
            <AlertItem 
              type="warning" 
              message="Program Delay: EV Battery Housing"
              program="PRG-003 - Crash Test Failure"
              time="5 hours ago"
            />
            <AlertItem 
              type="warning" 
              message="Supplier Performance: Advanced Electronics"
              program="SC Performance Alert"
              time="8 hours ago"
            />
            <AlertItem 
              type="info" 
              message="Audit Scheduled: AS9100"
              program="Quality Management"
              time="1 day ago"
            />
            <AlertItem 
              type="success" 
              message="Milestone Completed: Prototype Build"
              program="PRG-001"
              time="2 days ago"
            />
          </div>
          <button 
            onClick={() => setIsAlertsModalOpen(true)}
            className="w-full mt-4 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            View All Alerts
          </button>
        </div>
      </div>

      {/* Secondary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Production Status */}
        <div className="card">
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">Production Status</h2>
          <div className="space-y-4">
            {mockProductionData.sites.map(site => (
              <div key={site.id} className="border-b border-secondary-100 last:border-0 pb-4 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-secondary-900">{site.name}</h4>
                  <span className={cn(
                    "badge",
                    site.status === 'operational' ? 'badge-success' : 'badge-warning'
                  )}>
                    {site.status}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-secondary-50 rounded-lg p-2">
                    <p className="text-lg font-semibold text-secondary-900">{site.output.actual}</p>
                    <p className="text-xs text-secondary-500">Output</p>
                  </div>
                  <div className="bg-secondary-50 rounded-lg p-2">
                    <p className="text-lg font-semibold text-secondary-900">{site.output.yield}%</p>
                    <p className="text-xs text-secondary-500">Yield</p>
                  </div>
                  <div className="bg-secondary-50 rounded-lg p-2">
                    <p className="text-lg font-semibold text-secondary-900">{site.lines.filter(l => l.status === 'running').length}/{site.lines.length}</p>
                    <p className="text-xs text-secondary-500">Lines Up</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quality Metrics */}
        <div className="card">
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">Quality Overview</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
              <span className="text-sm text-secondary-700">First Pass Yield</span>
              <span className="font-semibold text-success-600">{operationalKPI.firstPassYield}%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
              <span className="text-sm text-secondary-700">Open NCRs</span>
              <span className="font-semibold text-danger-600">{mockQualityData.ncr.filter(n => n.status === 'open').length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
              <span className="text-sm text-secondary-700">Active CAPAs</span>
              <span className="font-semibold text-warning-600">{mockQualityData.capa.filter(c => c.status === 'in_progress').length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
              <span className="text-sm text-secondary-700">Expiring Certifications</span>
              <span className="font-semibold text-warning-600">
                {mockQualityData.certifications.filter(c => c.status === 'expiring').length}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button 
              onClick={() => navigate('/programs')}
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-secondary-50 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <FolderKanban className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="font-medium text-secondary-900">View Programs</p>
                <p className="text-xs text-secondary-500">Track project progress</p>
              </div>
            </button>
            <button 
              onClick={() => navigate('/collaboration')}
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-secondary-50 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-success-600" />
              </div>
              <div>
                <p className="font-medium text-secondary-900">Team Collaboration</p>
                <p className="text-xs text-secondary-500">View discussions & documents</p>
              </div>
            </button>
            <button 
              onClick={() => navigate('/analytics')}
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-secondary-50 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-warning-600" />
              </div>
              <div>
                <p className="font-medium text-secondary-900">View Reports</p>
                <p className="text-xs text-secondary-500">Analytics & insights</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* View All Alerts Modal */}
      <Modal
        isOpen={isAlertsModalOpen}
        onClose={() => setIsAlertsModalOpen(false)}
        title="All Alerts"
        size="md"
      >
        <div className="space-y-2">
          <AlertItem 
            type="error" 
            message="Critical: Material Certificate Missing"
            program="PRG-001 - Aerospace Component"
            time="2 hours ago"
          />
          <AlertItem 
            type="warning" 
            message="Program Delay: EV Battery Housing"
            program="PRG-003 - Crash Test Failure"
            time="5 hours ago"
          />
          <AlertItem 
            type="warning" 
            message="Supplier Performance: Advanced Electronics"
            program="SC Performance Alert"
            time="8 hours ago"
          />
          <AlertItem 
            type="info" 
            message="Audit Scheduled: AS9100"
            program="Quality Management"
            time="1 day ago"
          />
          <AlertItem 
            type="success" 
            message="Milestone Completed: Prototype Build"
            program="PRG-001"
            time="2 days ago"
          />
          <AlertItem 
            type="error" 
            message="Equipment Maintenance Required"
            program="Production - Line 3"
            time="3 days ago"
          />
          <AlertItem 
            type="warning" 
            message="Inventory Low: Raw Materials"
            program="Supply Chain"
            time="4 days ago"
          />
          <AlertItem 
            type="success" 
            message="New Certification Acquired"
            program="Quality Management"
            time="5 days ago"
          />
        </div>
      </Modal>

      {/* Copyright Footer */}
      <div className="mt-8 pt-4 border-t border-secondary-200 text-center">
        <p className="text-sm text-secondary-500">Copyright belongs to Yashwanth created in 2026</p>
      </div>
    </div>
  );
}
