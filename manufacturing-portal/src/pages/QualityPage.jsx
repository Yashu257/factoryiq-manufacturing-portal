import { useState } from 'react';
import { 
  ShieldCheck, 
  FileCheck, 
  AlertCircle, 
  Search,
  Filter,
  Plus,
  CheckCircle,
  Clock,
  XCircle,
  Award,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Upload,
  Camera
} from 'lucide-react';
import { mockQualityData } from '../data/mockData';
import { cn, formatDate } from '../utils/helpers';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Modal from '../components/common/Modal';

function StatusBadge({ status, type = 'default' }) {
  const styles = {
    default: {
      completed: 'bg-success-100 text-success-700',
      approved: 'bg-success-100 text-success-700',
      active: 'bg-success-100 text-success-700',
      in_progress: 'bg-primary-100 text-primary-700',
      in_review: 'bg-primary-100 text-primary-700',
      scheduled: 'bg-warning-100 text-warning-700',
      open: 'bg-danger-100 text-danger-700',
      expiring: 'bg-warning-100 text-warning-800',
    },
    severity: {
      critical: 'bg-danger-100 text-danger-700',
      major: 'bg-warning-100 text-warning-700',
      minor: 'bg-info-100 text-info-700',
    }
  };
  
  return (
    <span className={cn("badge", styles[type][status] || "bg-secondary-100 text-secondary-700")}>
      {status.replace('_', ' ')}
    </span>
  );
}

export default function QualityPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [isNCRModalOpen, setIsNCRModalOpen] = useState(false);
  const [ncrForm, setNcrForm] = useState({
    title: '',
    program: '',
    severity: 'minor',
    description: '',
    reportedBy: '',
    photos: []
  });

  const cpkData = mockQualityData.spcData.cpk.map((value, index) => ({
    week: mockQualityData.spcData.dates[index],
    cpk: value,
    target: 1.33
  }));

  const filteredNCRs = mockQualityData.ncr.filter(ncr => 
    ncr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ncr.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Quality Management & Compliance</h1>
          <p className="text-secondary-500">NCR/CAPA tracking, audits, certifications, and SPC</p>
        </div>
        <button 
          onClick={() => setIsNCRModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New NCR
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-secondary-200">
        <div className="flex gap-6">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'ncr', label: 'NCRs & CAPAs' },
            { id: 'audits', label: 'Audits & Certifications' },
            { id: 'spc', label: 'SPC Analytics' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "py-3 px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === tab.id 
                  ? "border-primary-500 text-primary-600" 
                  : "border-transparent text-secondary-500 hover:text-secondary-700"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-danger-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-danger-600" />
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Open NCRs</p>
                  <p className="text-xl font-bold text-danger-600">
                    {mockQualityData.ncr.filter(n => n.status === 'open').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-warning-600" />
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Active CAPAs</p>
                  <p className="text-xl font-bold text-warning-600">
                    {mockQualityData.capa.filter(c => c.status === 'in_progress').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-success-600" />
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Active Certs</p>
                  <p className="text-xl font-bold text-success-600">
                    {mockQualityData.certifications.filter(c => c.status === 'active').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Avg Cpk</p>
                  <p className="text-xl font-bold text-primary-600">
                    {(mockQualityData.spcData.cpk.reduce((a,b) => a+b, 0) / mockQualityData.spcData.cpk.length).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Access Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent NCRs */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-secondary-900">Recent NCRs</h3>
                <button 
                  onClick={() => setActiveTab('ncr')}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {mockQualityData.ncr.slice(0, 4).map(ncr => (
                  <div key={ncr.id} className="flex items-start gap-3 p-3 bg-secondary-50 rounded-lg">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                      ncr.severity === 'critical' ? "bg-danger-100" :
                      ncr.severity === 'major' ? "bg-warning-100" : "bg-info-100"
                    )}>
                      <AlertCircle className={cn(
                        "w-4 h-4",
                        ncr.severity === 'critical' ? "text-danger-600" :
                        ncr.severity === 'major' ? "text-warning-600" : "text-info-600"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-secondary-900 truncate">{ncr.title}</span>
                        <StatusBadge status={ncr.status} />
                      </div>
                      <div className="flex items-center gap-3 text-xs text-secondary-500 mt-1">
                        <span>{ncr.id}</span>
                        <span>•</span>
                        <span>{ncr.program}</span>
                        <span>•</span>
                        <span>{formatDate(ncr.date)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications Status */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-secondary-900">Certifications</h3>
                <button 
                  onClick={() => setActiveTab('audits')}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {mockQualityData.certifications.map(cert => (
                  <div key={cert.id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center",
                        cert.status === 'active' ? "bg-success-100" : "bg-warning-100"
                      )}>
                        <FileCheck className={cn(
                          "w-4 h-4",
                          cert.status === 'active' ? "text-success-600" : "text-warning-600"
                        )} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-secondary-900">{cert.name}</p>
                        <p className="text-xs text-secondary-500">
                          Expires: {formatDate(cert.expiryDate)}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={cert.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NCRs & CAPAs Tab */}
      {activeTab === 'ncr' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
              <input
                type="text"
                placeholder="Search NCRs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-secondary-400" />
              <select className="input py-2">
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          {/* NCR Table */}
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-secondary-700">ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-secondary-700">Title</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-secondary-700">Program</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-secondary-700">Severity</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-secondary-700">Status</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-secondary-700">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100">
                {filteredNCRs.map(ncr => (
                  <tr key={ncr.id} className="hover:bg-secondary-50">
                    <td className="py-3 px-4 text-sm font-medium text-secondary-900">{ncr.id}</td>
                    <td className="py-3 px-4 text-sm text-secondary-900">{ncr.title}</td>
                    <td className="py-3 px-4 text-center text-sm text-secondary-600">{ncr.program}</td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge status={ncr.severity} type="severity" />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge status={ncr.status} />
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-secondary-500">{formatDate(ncr.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* CAPAs Section */}
          <div className="card">
            <h3 className="font-semibold text-secondary-900 mb-4">Active CAPAs</h3>
            <div className="space-y-3">
              {mockQualityData.capa.map(capa => (
                <div key={capa.id} className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      capa.status === 'implemented' ? "bg-success-100" : "bg-primary-100"
                    )}>
                      <CheckCircle className={cn(
                        "w-5 h-5",
                        capa.status === 'implemented' ? "text-success-600" : "text-primary-600"
                      )} />
                    </div>
                    <div>
                      <p className="font-medium text-secondary-900">{capa.title}</p>
                      <p className="text-sm text-secondary-500">
                        {capa.id} • {formatDate(capa.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-secondary-600">
                      Effectiveness: <span className={cn(
                        "font-medium",
                        capa.effectiveness === 'verified' ? "text-success-600" : "text-warning-600"
                      )}>{capa.effectiveness}</span>
                    </span>
                    <StatusBadge status={capa.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Audits Tab */}
      {activeTab === 'audits' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Audits */}
          <div className="card">
            <h3 className="font-semibold text-secondary-900 mb-4">Audit Schedule</h3>
            <div className="space-y-3">
              {mockQualityData.audits.map(audit => (
                <div key={audit.id} className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-secondary-900">{audit.type} Audit</p>
                      <p className="text-sm text-secondary-500">{audit.auditor} • {formatDate(audit.date)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={audit.status} />
                    {audit.score && (
                      <p className="text-sm font-medium text-success-600 mt-1">Score: {audit.score}%</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications Detail */}
          <div className="card">
            <h3 className="font-semibold text-secondary-900 mb-4">Certification Details</h3>
            <div className="space-y-4">
              {mockQualityData.certifications.map(cert => (
                <div key={cert.id} className="p-4 border border-secondary-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-secondary-900">{cert.name}</h4>
                    <StatusBadge status={cert.status} />
                  </div>
                  <div className="w-full bg-secondary-200 rounded-full h-2 mb-2">
                    <div 
                      className={cn(
                        "h-2 rounded-full",
                        cert.status === 'active' ? "bg-success-500" : "bg-warning-500"
                      )}
                      style={{ width: cert.status === 'active' ? '100%' : '30%' }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-secondary-500">Expires: {formatDate(cert.expiryDate)}</span>
                    {cert.status === 'expiring' && (
                      <span className="text-warning-600 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        Renewal Required
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SPC Tab */}
      {activeTab === 'spc' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="font-semibold text-secondary-900 mb-4">Process Capability (Cpk) Trend</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cpkData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="week" stroke="#64748b" />
                  <YAxis domain={[0, 2]} stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '8px'
                    }} 
                  />
                  <Line type="monotone" dataKey="cpk" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} name="Cpk" />
                  <Line type="monotone" dataKey="target" stroke="#22c55e" strokeDasharray="5 5" strokeWidth={2} dot={false} name="Target (1.33)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-success-50 rounded-lg">
                <p className="text-2xl font-bold text-success-600">
                  {mockQualityData.spcData.cpk.filter(v => v >= 1.33).length}
                </p>
                <p className="text-sm text-secondary-600">Weeks Above Target</p>
              </div>
              <div className="p-3 bg-primary-50 rounded-lg">
                <p className="text-2xl font-bold text-primary-600">
                  {(mockQualityData.spcData.cpk.reduce((a,b) => a+b, 0) / mockQualityData.spcData.cpk.length).toFixed(2)}
                </p>
                <p className="text-sm text-secondary-600">Average Cpk</p>
              </div>
              <div className="p-3 bg-warning-50 rounded-lg">
                <p className="text-2xl font-bold text-warning-600">
                  {mockQualityData.spcData.cpk.filter(v => v < 1.33).length}
                </p>
                <p className="text-sm text-secondary-600">Weeks Below Target</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New NCR Modal */}
      <Modal
        isOpen={isNCRModalOpen}
        onClose={() => setIsNCRModalOpen(false)}
        title="Create New NCR"
        size="md"
      >
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                NCR Title *
              </label>
              <input
                type="text"
                value={ncrForm.title}
                onChange={(e) => setNcrForm({...ncrForm, title: e.target.value})}
                className="input w-full"
                placeholder="Enter NCR title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Program *
              </label>
              <select
                value={ncrForm.program}
                onChange={(e) => setNcrForm({...ncrForm, program: e.target.value})}
                className="input w-full"
                required
              >
                <option value="">Select Program</option>
                <option value="PRG-001">PRG-001 - Aerospace Component</option>
                <option value="PRG-002">PRG-002 - Medical Device Series M</option>
                <option value="PRG-003">PRG-003 - EV Battery Housing</option>
                <option value="PRG-004">PRG-004 - Satellite Communication</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Severity *
              </label>
              <select
                value={ncrForm.severity}
                onChange={(e) => setNcrForm({...ncrForm, severity: e.target.value})}
                className="input w-full"
                required
              >
                <option value="minor">Minor</option>
                <option value="major">Major</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Reported By *
              </label>
              <input
                type="text"
                value={ncrForm.reportedBy}
                onChange={(e) => setNcrForm({...ncrForm, reportedBy: e.target.value})}
                className="input w-full"
                placeholder="Your name"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Description *
            </label>
            <textarea
              value={ncrForm.description}
              onChange={(e) => setNcrForm({...ncrForm, description: e.target.value})}
              className="input w-full h-16 resize-none"
              placeholder="Describe the non-conformance issue..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Attach Photos
            </label>
            <div className="border-2 border-dashed border-secondary-300 rounded-lg p-3 text-center hover:border-primary-300 transition-colors cursor-pointer">
              <Camera className="w-6 h-6 text-secondary-400 mx-auto mb-1" />
              <p className="text-xs text-secondary-600">
                Click to upload photos
              </p>
              <p className="text-xs text-secondary-400">
                JPG, PNG, PDF (max 10MB)
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-secondary-200">
            <button
              type="button"
              onClick={() => setIsNCRModalOpen(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                // Handle form submission here
                setIsNCRModalOpen(false);
                alert('NCR created successfully!');
              }}
              className="btn-primary"
            >
              Create NCR
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
