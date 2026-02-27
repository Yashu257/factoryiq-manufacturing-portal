import { useState } from 'react';
import { 
  Factory, 
  Play, 
  Pause, 
  AlertTriangle, 
  TrendingUp,
  Users,
  Package,
  Wrench,
  ChevronRight,
  Activity,
  X,
  Download,
  Filter,
  Search
} from 'lucide-react';
import { mockProductionData } from '../data/mockData';
import { cn, formatNumber, formatDate } from '../utils/helpers';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import Modal from '../components/common/Modal';

const oeeTrendData = [
  { day: 'Mon', oee: 82, availability: 88, performance: 91, quality: 98 },
  { day: 'Tue', oee: 85, availability: 90, performance: 92, quality: 97 },
  { day: 'Wed', oee: 81, availability: 87, performance: 89, quality: 99 },
  { day: 'Thu', oee: 88, availability: 92, performance: 94, quality: 98 },
  { day: 'Fri', oee: 86, availability: 91, performance: 93, quality: 97 },
  { day: 'Sat', oee: 79, availability: 85, performance: 88, quality: 98 },
  { day: 'Sun', oee: 75, availability: 80, performance: 85, quality: 99 },
];

const defectData = [
  { name: 'Dimensional', count: 12 },
  { name: 'Surface', count: 8 },
  { name: 'Assembly', count: 5 },
  { name: 'Material', count: 3 },
];

function SiteCard({ site }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-secondary-900">{site.name}</h3>
          <p className="text-sm text-secondary-500">{site.location}</p>
        </div>
        <span className={cn(
          "badge",
          site.status === 'operational' ? 'badge-success' : 'badge-warning'
        )}>
          {site.status}
        </span>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-secondary-50 rounded-lg p-3 text-center">
          <p className="text-xl font-bold text-secondary-900">{site.output.actual}</p>
          <p className="text-xs text-secondary-500">Actual Output</p>
        </div>
        <div className="bg-secondary-50 rounded-lg p-3 text-center">
          <p className="text-xl font-bold text-success-600">{site.output.yield}%</p>
          <p className="text-xs text-secondary-500">Yield</p>
        </div>
        <div className="bg-secondary-50 rounded-lg p-3 text-center">
          <p className="text-xl font-bold text-secondary-900">{site.output.planned - site.output.actual}</p>
          <p className="text-xs text-secondary-500">Variance</p>
        </div>
      </div>

      {/* Lines */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-secondary-700 mb-2">Production Lines</p>
        {site.lines.map(line => (
          <div key={line.id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-2 h-2 rounded-full",
                line.status === 'running' ? "bg-success-500" :
                line.status === 'maintenance' ? "bg-warning-500" : "bg-danger-500"
              )} />
              <span className="text-sm font-medium text-secondary-900">{line.name}</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              {line.status === 'running' && (
                <>
                  <span className="text-secondary-600">OEE: {line.oee}%</span>
                  <span className="text-secondary-600">WIP: {line.wip}</span>
                </>
              )}
              <span className={cn(
                "text-xs px-2 py-1 rounded-full",
                line.status === 'running' ? "bg-success-100 text-success-700" :
                line.status === 'maintenance' ? "bg-warning-100 text-warning-700" :
                "bg-danger-100 text-danger-700"
              )}>
                {line.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Shift Info */}
      <div className="mt-4 pt-4 border-t border-secondary-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-secondary-600">
              <Users className="w-4 h-4" />
              {site.shifts.operators} operators
            </span>
            <span className="text-secondary-600">
              {site.shifts.supervisors} supervisors
            </span>
          </div>
          <span className="text-secondary-500">{site.shifts.current}</span>
        </div>
      </div>
    </div>
  );
}

export default function ProductionPage() {
  const [selectedDefect, setSelectedDefect] = useState(null);
  const [isDefectModalOpen, setIsDefectModalOpen] = useState(false);

  const handleViewDefect = (defect) => {
    setSelectedDefect(defect);
    setIsDefectModalOpen(true);
  };
  const [selectedSite, setSelectedSite] = useState(mockProductionData.sites[0].id);

  // Get site-specific data
  const currentSite = mockProductionData.sites.find(s => s.id === selectedSite) || mockProductionData.sites[0];
  const isPhoenix = selectedSite === 'phoenix';
  
  // Dynamic stats based on selected facility
  const siteStats = {
    output: isPhoenix ? '1,940' : '1,256',
    oee: isPhoenix ? '85.3%' : '78.5%',
    wip: isPhoenix ? '403' : '287',
    defects: isPhoenix ? '28' : '15'
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Production Visibility</h1>
          <p className="text-secondary-500">{currentSite.name} - Real-time production dashboard</p>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
            className="input"
          >
            {mockProductionData.sites.map(site => (
              <option key={site.id} value={site.id}>{site.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Production Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Factory className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-secondary-500">Total Output</p>
              <p className="text-xl font-bold text-secondary-900">{siteStats.output}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-success-600" />
            </div>
            <div>
              <p className="text-sm text-secondary-500">Avg OEE</p>
              <p className="text-xl font-bold text-success-600">{siteStats.oee}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-warning-600" />
            </div>
            <div>
              <p className="text-sm text-secondary-500">Total WIP</p>
              <p className="text-xl font-bold text-warning-600">{siteStats.wip}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-danger-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-danger-600" />
            </div>
            <div>
              <p className="text-sm text-secondary-500">Defects Today</p>
              <p className="text-xl font-bold text-danger-600">{siteStats.defects}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* OEE Trend Chart */}
        <div className="card">
          <h3 className="font-semibold text-secondary-900 mb-4">OEE Trend (Last 7 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={oeeTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }} 
                />
                <Line type="monotone" dataKey="oee" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} name="OEE" />
                <Line type="monotone" dataKey="availability" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e' }} name="Availability" />
                <Line type="monotone" dataKey="performance" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b' }} name="Performance" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Defect Pareto */}
        <div className="card">
          <h3 className="font-semibold text-secondary-900 mb-4">Defect Analysis (Pareto)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={defectData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#64748b" />
                <YAxis dataKey="name" type="category" stroke="#64748b" width={100} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="count" fill="#ef4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Site Cards */}
      <div>
        <h2 className="text-lg font-semibold text-secondary-900 mb-4">Facility Status</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockProductionData.sites.map(site => (
            <SiteCard key={site.id} site={site} />
          ))}
        </div>
      </div>

      {/* Defect Table */}
      <div className="card">
        <h3 className="font-semibold text-secondary-900 mb-4">Today's Defect Log</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-secondary-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-secondary-700">Defect Type</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-secondary-700">Count</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-secondary-700">Severity</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-secondary-700">Top Station</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-secondary-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {mockProductionData.defects.map((defect, index) => (
                <tr key={index} className="border-b border-secondary-100 last:border-0 hover:bg-secondary-50">
                  <td className="py-3 px-4 text-sm text-secondary-900">{defect.type}</td>
                  <td className="py-3 px-4 text-center text-sm text-secondary-900">{defect.count}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={cn(
                      "badge",
                      defect.severity === 'critical' ? 'badge-danger' :
                      defect.severity === 'major' ? 'badge-warning' : 'badge-info'
                    )}>
                      {defect.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-sm text-secondary-600">Station {3 + index}</td>
                  <td className="py-3 px-4 text-center">
                    <button 
                      onClick={() => handleViewDefect(defect)}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Defect Detail Modal */}
      <Modal
        isOpen={isDefectModalOpen}
        onClose={() => setIsDefectModalOpen(false)}
        title={`Defect: ${selectedDefect?.type || ''}`}
        size="md"
      >
        {selectedDefect && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary-50 rounded-lg p-3">
                <p className="text-xs text-secondary-500">Count</p>
                <p className="text-xl font-bold text-secondary-900">{selectedDefect.count}</p>
              </div>
              <div className="bg-secondary-50 rounded-lg p-3">
                <p className="text-xs text-secondary-500">Severity</p>
                <span className={cn(
                  "badge",
                  selectedDefect.severity === 'critical' ? 'badge-danger' :
                  selectedDefect.severity === 'major' ? 'badge-warning' : 'badge-info'
                )}>
                  {selectedDefect.severity}
                </span>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-secondary-900 mb-2">Root Cause Analysis</h4>
              <p className="text-sm text-secondary-600">Initial analysis suggests tooling wear on Station {Math.floor(Math.random() * 5) + 1}. Temperature variance detected during shift change.</p>
            </div>
            
            <div>
              <h4 className="font-medium text-secondary-900 mb-2">Corrective Actions</h4>
              <ul className="text-sm text-secondary-600 space-y-1">
                <li>• Tool replacement scheduled for next maintenance window</li>
                <li>• Operator retraining on temperature monitoring</li>
                <li>• Increased inspection frequency (100% → 200%)</li>
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
