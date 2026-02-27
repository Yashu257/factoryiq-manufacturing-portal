import { useState } from 'react';
import { 
  Wrench, 
  RefreshCw, 
  Shield,
  Package,
  Search,
  Filter,
  Plus,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  ChevronRight,
  FileText,
  Download,
  Eye,
  History,
  User
} from 'lucide-react';
import { mockAfterSalesData } from '../data/mockData';
import { cn, formatDate } from '../utils/helpers';
import Modal from '../components/common/Modal';

function StatusBadge({ status }) {
  const colors = {
    received: 'badge-info',
    diagnosing: 'badge-warning',
    repairing: 'badge-primary',
    testing: 'badge-warning',
    shipped: 'badge-success',
    active: 'badge-success',
    expiring: 'badge-warning',
    adequate: 'badge-success',
    low: 'badge-warning',
    critical: 'badge-danger',
  };
  return (
    <span className={cn("badge", colors[status] || 'badge-secondary')}>
      {status.replace('_', ' ')}
    </span>
  );
}

export default function AfterSalesPage() {
  const [activeTab, setActiveTab] = useState('rma');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRMA, setSelectedRMA] = useState(null);
  const [isRMAModalOpen, setIsRMAModalOpen] = useState(false);
  const [isNewRMAModalOpen, setIsNewRMAModalOpen] = useState(false);
  const [newRMAForm, setNewRMAForm] = useState({
    customer: '',
    product: '',
    reason: 'Defective'
  });

  const handleViewRMA = (rma) => {
    setSelectedRMA(rma);
    setIsRMAModalOpen(true);
  };

  const filteredRMAs = mockAfterSalesData.rmas.filter(rma => {
    const matchesSearch = rma.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rma.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || rma.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">After-Sales Service</h1>
          <p className="text-secondary-500">RMA tracking, warranty claims, and spare parts management</p>
        </div>
        <button 
          onClick={() => setIsNewRMAModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New RMA
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-secondary-200">
        <div className="flex gap-6">
          {[
            { id: 'rma', label: 'RMA', icon: RefreshCw },
            { id: 'warranty', label: 'Warranty', icon: Shield },
            { id: 'spare-parts', label: 'Spare Parts', icon: Package },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors",
                  activeTab === tab.id 
                    ? "border-primary-500 text-primary-600" 
                    : "border-transparent text-secondary-500 hover:text-secondary-700"
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* RMA Tab */}
      {activeTab === 'rma' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card p-4">
              <p className="text-sm text-secondary-500">Total RMAs</p>
              <p className="text-2xl font-bold text-secondary-900">{mockAfterSalesData.rmas.length}</p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-secondary-500">In Progress</p>
              <p className="text-2xl font-bold text-warning-600">
                {mockAfterSalesData.rmas.filter(r => r.status === 'diagnosing' || r.status === 'repairing').length}
              </p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-secondary-500">Shipped</p>
              <p className="text-2xl font-bold text-success-600">
                {mockAfterSalesData.rmas.filter(r => r.status === 'shipped').length}
              </p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-secondary-500">Avg Turnaround</p>
              <p className="text-2xl font-bold text-primary-600">4.2 days</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
              <input
                type="text"
                placeholder="Search RMAs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-secondary-400" />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input py-2"
              >
                <option value="all">All Status</option>
                <option value="received">Received</option>
                <option value="diagnosing">Diagnosing</option>
                <option value="repairing">Repairing</option>
                <option value="shipped">Shipped</option>
              </select>
            </div>
          </div>

          {/* RMA Table */}
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-secondary-700">RMA ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-secondary-700">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-secondary-700">Product</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-secondary-700">Reason</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-secondary-700">Status</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-secondary-700">Date</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-secondary-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100">
                {filteredRMAs.map(rma => (
                  <tr key={rma.id} className="hover:bg-secondary-50">
                    <td className="py-3 px-4 text-sm font-medium text-secondary-900">{rma.id}</td>
                    <td className="py-3 px-4 text-sm text-secondary-900">{rma.customer}</td>
                    <td className="py-3 px-4 text-sm text-secondary-600">{rma.product}</td>
                    <td className="py-3 px-4 text-center text-sm text-secondary-600">{rma.reason}</td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge status={rma.status} />
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-secondary-500">{formatDate(rma.date)}</td>
                    <td className="py-3 px-4 text-center">
                      <button 
                        onClick={() => handleViewRMA(rma)}
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

          {/* RMA Workflow */}
          <div className="card">
            <h3 className="font-semibold text-secondary-900 mb-4">RMA Workflow</h3>
            <div className="flex items-center justify-between">
              {[
                { step: 1, label: 'Intake', icon: Package, status: 'completed' },
                { step: 2, label: 'Triage', icon: AlertCircle, status: 'completed' },
                { step: 3, label: 'Diagnosis', icon: Search, status: 'in_progress' },
                { step: 4, label: 'Repair', icon: Wrench, status: 'pending' },
                { step: 5, label: 'Test', icon: CheckCircle, status: 'pending' },
                { step: 6, label: 'Ship', icon: Truck, status: 'pending' },
              ].map((step, index, array) => {
                const Icon = step.icon;
                return (
                  <div key={step.step} className="flex items-center">
                    <div className={cn(
                      "flex flex-col items-center",
                      step.status === 'completed' ? "text-success-600" :
                      step.status === 'in_progress' ? "text-primary-600" : "text-secondary-400"
                    )}>
                      <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center mb-2",
                        step.status === 'completed' ? "bg-success-100" :
                        step.status === 'in_progress' ? "bg-primary-100" : "bg-secondary-100"
                      )}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-medium">{step.label}</span>
                    </div>
                    {index < array.length - 1 && (
                      <ChevronRight className="w-5 h-5 text-secondary-300 mx-2" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Warranty Tab */}
      {activeTab === 'warranty' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockAfterSalesData.warranties.map(warranty => (
              <div key={warranty.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-secondary-900">{warranty.product}</h3>
                    <p className="text-sm text-secondary-500">{warranty.id}</p>
                  </div>
                  <StatusBadge status={warranty.status} />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-500">Expiry Date</span>
                    <span className="font-medium text-secondary-900">{formatDate(warranty.expiry)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-500">Claims Filed</span>
                    <span className="font-medium text-secondary-900">{warranty.claims}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-secondary-200">
                  <div className="w-full bg-secondary-200 rounded-full h-2">
                    <div 
                      className={cn(
                        "h-2 rounded-full",
                        warranty.status === 'active' ? "bg-success-500" : "bg-warning-500"
                      )}
                      style={{ width: warranty.status === 'active' ? '75%' : '25%' }}
                    />
                  </div>
                  <p className="text-xs text-secondary-500 mt-2 text-center">
                    {warranty.status === 'active' ? '18 months remaining' : '1 month remaining'}
                  </p>
                </div>

                <button className="w-full mt-4 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                  View Claims
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Spare Parts Tab */}
      {activeTab === 'spare-parts' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card p-4">
              <p className="text-sm text-secondary-500">Total SKUs</p>
              <p className="text-2xl font-bold text-secondary-900">{mockAfterSalesData.spareParts.length}</p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-secondary-500">Low Stock</p>
              <p className="text-2xl font-bold text-warning-600">
                {mockAfterSalesData.spareParts.filter(s => s.status === 'low').length}
              </p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-secondary-500">Critical Stock</p>
              <p className="text-2xl font-bold text-danger-600">
                {mockAfterSalesData.spareParts.filter(s => s.status === 'critical').length}
              </p>
            </div>
          </div>

          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-secondary-700">Part ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-secondary-700">Name</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-secondary-700">Stock</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-secondary-700">Reorder Point</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-secondary-700">Status</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-secondary-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100">
                {mockAfterSalesData.spareParts.map(part => (
                  <tr key={part.id} className="hover:bg-secondary-50">
                    <td className="py-3 px-4 text-sm font-medium text-secondary-900">{part.id}</td>
                    <td className="py-3 px-4 text-sm text-secondary-900">{part.name}</td>
                    <td className="py-3 px-4 text-center text-sm text-secondary-900">{part.stock}</td>
                    <td className="py-3 px-4 text-center text-sm text-secondary-600">{part.reorder}</td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge status={part.status} />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                        Order
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RMA Detail Modal */}
      <Modal
        isOpen={isRMAModalOpen}
        onClose={() => setIsRMAModalOpen(false)}
        title={`RMA: ${selectedRMA?.id || ''}`}
        size="md"
      >
        {selectedRMA && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
              <div>
                <p className="text-sm text-secondary-500">Customer</p>
                <p className="font-medium text-secondary-900">{selectedRMA.customer}</p>
              </div>
              <StatusBadge status={selectedRMA.status} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary-50 rounded-lg p-3">
                <p className="text-xs text-secondary-500">Product</p>
                <p className="font-medium text-secondary-900">{selectedRMA.product}</p>
              </div>
              <div className="bg-secondary-50 rounded-lg p-3">
                <p className="text-xs text-secondary-500">Reason</p>
                <p className="font-medium text-secondary-900">{selectedRMA.reason}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-secondary-900 mb-2 flex items-center gap-2">
                <History className="w-4 h-4" />
                RMA Timeline
              </h4>
              <div className="space-y-2">
                {[
                  { step: 'RMA Requested', date: formatDate(selectedRMA.date), status: 'completed' },
                  { step: 'Product Received', date: 'Nov 12, 2024', status: 'completed' },
                  { step: 'Diagnosis', date: selectedRMA.status === 'diagnosing' ? 'In Progress' : 'Nov 14, 2024', status: selectedRMA.status === 'diagnosing' ? 'current' : 'completed' },
                  { step: 'Repair/Replacement', date: selectedRMA.status === 'repairing' ? 'In Progress' : 'Pending', status: selectedRMA.status === 'repairing' ? 'current' : 'pending' },
                  { step: 'Ship to Customer', date: selectedRMA.status === 'shipped' ? formatDate(selectedRMA.date) : 'Pending', status: selectedRMA.status === 'shipped' ? 'completed' : 'pending' },
                ].map((event, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      event.status === 'completed' ? "bg-success-500" :
                      event.status === 'current' ? "bg-primary-500" : "bg-secondary-300"
                    )} />
                    <div className="flex-1 flex justify-between">
                      <span className={cn(
                        "text-sm",
                        event.status === 'completed' ? "text-secondary-900" :
                        event.status === 'current' ? "text-primary-600 font-medium" : "text-secondary-400"
                      )}>{event.step}</span>
                      <span className="text-xs text-secondary-500">{event.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-secondary-900 mb-2">Notes</h4>
              <p className="text-sm text-secondary-600">Customer reported {selectedRMA.reason.toLowerCase()} issue. Initial inspection confirmed the problem. Awaiting parts for repair.</p>
            </div>
          </div>
        )}
      </Modal>

      {/* New RMA Modal */}
      <Modal
        isOpen={isNewRMAModalOpen}
        onClose={() => setIsNewRMAModalOpen(false)}
        title="Create New RMA"
        size="md"
      >
        <form className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Customer Name *
            </label>
            <input
              type="text"
              value={newRMAForm.customer}
              onChange={(e) => setNewRMAForm({...newRMAForm, customer: e.target.value})}
              className="input w-full"
              placeholder="Enter customer name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Product *
            </label>
            <input
              type="text"
              value={newRMAForm.product}
              onChange={(e) => setNewRMAForm({...newRMAForm, product: e.target.value})}
              className="input w-full"
              placeholder="Enter product name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Reason for Return *
            </label>
            <select
              value={newRMAForm.reason}
              onChange={(e) => setNewRMAForm({...newRMAForm, reason: e.target.value})}
              className="input w-full"
              required
            >
              <option value="Defective">Defective</option>
              <option value="Wrong Spec">Wrong Spec</option>
              <option value="Damaged">Damaged</option>
              <option value="Missing Parts">Missing Parts</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Description
            </label>
            <textarea
              className="input w-full h-16 resize-none"
              placeholder="Describe the issue..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-secondary-200">
            <button
              type="button"
              onClick={() => setIsNewRMAModalOpen(false)}
              className="btn-secondary py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                setIsNewRMAModalOpen(false);
                alert('RMA created successfully!');
              }}
              className="btn-primary py-2"
            >
              Create RMA
            </button>
          </div>
        </form>
      </Modal>

      {/* Copyright Footer */}
      <div className="mt-8 pt-4 border-t border-secondary-200 text-center">
        <p className="text-sm text-secondary-500">Copyright belongs to Yashwanth created in 2026</p>
      </div>
    </div>
  );
}
