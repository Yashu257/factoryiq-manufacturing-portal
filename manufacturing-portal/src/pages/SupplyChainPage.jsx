import { useState } from 'react';
import { 
  Truck, 
  Package, 
  Users, 
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  Navigation,
  Calendar,
  FileText
} from 'lucide-react';
import { mockSupplyChainData, mockKPIData } from '../data/mockData';
import { cn, formatNumber, formatDate } from '../utils/helpers';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Modal from '../components/common/Modal';

const COLORS = ['#3b82f6', '#f59e0b', '#22c55e'];

function StatusBadge({ status }) {
  const colors = {
    active: 'badge-success',
    at_risk: 'badge-danger',
    running: 'badge-success',
    in_transit: 'badge-info',
    customs_hold: 'badge-warning',
    delayed: 'badge-danger',
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

export default function SupplyChainPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);

  const handleTrackShipment = (shipment) => {
    setSelectedShipment(shipment);
    setIsTrackModalOpen(true);
  };

  const poData = mockSupplyChainData.poStatus.map(item => ({
    name: item.status,
    value: item.count,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Supply Chain & Materials Visibility</h1>
          <p className="text-secondary-500">PO tracking, inventory, supplier performance, and inbound logistics</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-secondary-200">
        <div className="flex gap-6">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'suppliers', label: 'Suppliers' },
            { id: 'inventory', label: 'Inventory' },
            { id: 'shipments', label: 'Inbound Shipments' },
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
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Open POs</p>
                  <p className="text-xl font-bold text-primary-600">
                    {mockSupplyChainData.poStatus.find(p => p.status === 'Open')?.count || 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-success-600" />
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Supplier OTD</p>
                  <p className="text-xl font-bold text-success-600">
                    {mockKPIData.operational.supplierOtd}%
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
                  <p className="text-sm text-secondary-500">In Transit</p>
                  <p className="text-xl font-bold text-warning-600">
                    {mockSupplyChainData.inboundShipments.filter(s => s.status === 'in_transit').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-danger-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-danger-600" />
                </div>
                <div>
                  <p className="text-sm text-secondary-500">At Risk Suppliers</p>
                  <p className="text-xl font-bold text-danger-600">
                    {mockSupplyChainData.suppliers.filter(s => s.status === 'at_risk').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* PO Status Chart */}
            <div className="card">
              <h3 className="font-semibold text-secondary-900 mb-4">Purchase Order Status</h3>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={poData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {poData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                {poData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                    <span className="text-sm text-secondary-600">{entry.name}: {entry.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Shipments */}
            <div className="card">
              <h3 className="font-semibold text-secondary-900 mb-4">Inbound Shipments</h3>
              <div className="space-y-3">
                {mockSupplyChainData.inboundShipments.map(shipment => (
                  <div key={shipment.id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        shipment.status === 'in_transit' ? "bg-primary-100" :
                        shipment.status === 'customs_hold' ? "bg-warning-100" : "bg-danger-100"
                      )}>
                        <Truck className={cn(
                          "w-5 h-5",
                          shipment.status === 'in_transit' ? "text-primary-600" :
                          shipment.status === 'customs_hold' ? "text-warning-600" : "text-danger-600"
                        )} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-secondary-900">{shipment.po}</p>
                        <p className="text-xs text-secondary-500">{shipment.supplier}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={shipment.status} />
                      <p className="text-xs text-secondary-500 mt-1">ETA: {formatDate(shipment.eta)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Suppliers Tab */}
      {activeTab === 'suppliers' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
              <input
                type="text"
                placeholder="Search suppliers..."
                className="input pl-10 w-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-secondary-400" />
              <select className="input py-2">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="at_risk">At Risk</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockSupplyChainData.suppliers.map(supplier => (
              <div key={supplier.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-secondary-900">{supplier.name}</h3>
                    <p className="text-sm text-secondary-500">{supplier.id}</p>
                  </div>
                  <StatusBadge status={supplier.status} />
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-secondary-50 rounded-lg">
                    <p className="text-2xl font-bold text-secondary-900">{supplier.performance}</p>
                    <p className="text-xs text-secondary-500">Performance</p>
                  </div>
                  <div className="text-center p-3 bg-secondary-50 rounded-lg">
                    <p className={cn(
                      "text-2xl font-bold",
                      supplier.onTime >= 90 ? "text-success-600" : "text-warning-600"
                    )}>
                      {supplier.onTime}%
                    </p>
                    <p className="text-xs text-secondary-500">On-Time</p>
                  </div>
                  <div className="text-center p-3 bg-secondary-50 rounded-lg">
                    <p className={cn(
                      "text-2xl font-bold",
                      supplier.quality >= 95 ? "text-success-600" : "text-warning-600"
                    )}>
                      {supplier.quality}%
                    </p>
                    <p className="text-xs text-secondary-500">Quality</p>
                  </div>
                </div>

                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: 'Performance', value: supplier.performance },
                      { name: 'On-Time', value: supplier.onTime },
                      { name: 'Quality', value: supplier.quality },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" domain={[0, 100]} />
                      <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inventory Tab */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          {/* Inventory Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Raw Materials</p>
                  <p className="text-2xl font-bold text-secondary-900">
                    ${formatNumber(mockSupplyChainData.inventory.rawMaterials.value / 1000000, 1)}M
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-secondary-500">Turns</span>
                  <span className="font-medium">{mockSupplyChainData.inventory.rawMaterials.turns}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-500">Days</span>
                  <span className="font-medium">{mockSupplyChainData.inventory.rawMaterials.days}</span>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-warning-600" />
                </div>
                <div>
                  <p className="text-sm text-secondary-500">WIP</p>
                  <p className="text-2xl font-bold text-secondary-900">
                    ${formatNumber(mockSupplyChainData.inventory.wip.value / 1000000, 1)}M
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-secondary-500">Turns</span>
                  <span className="font-medium">{mockSupplyChainData.inventory.wip.turns}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-500">Days</span>
                  <span className="font-medium">{mockSupplyChainData.inventory.wip.days}</span>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-success-600" />
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Finished Goods</p>
                  <p className="text-2xl font-bold text-secondary-900">
                    ${formatNumber(mockSupplyChainData.inventory.finishedGoods.value / 1000000, 1)}M
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-secondary-500">Turns</span>
                  <span className="font-medium">{mockSupplyChainData.inventory.finishedGoods.turns}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-500">Days</span>
                  <span className="font-medium">{mockSupplyChainData.inventory.finishedGoods.days}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shipments Tab */}
      {activeTab === 'shipments' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
              <input
                type="text"
                placeholder="Search shipments..."
                className="input pl-10 w-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-secondary-400" />
              <select className="input py-2">
                <option value="all">All Status</option>
                <option value="in_transit">In Transit</option>
                <option value="customs_hold">Customs Hold</option>
                <option value="delayed">Delayed</option>
              </select>
            </div>
          </div>

          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-secondary-700">Shipment ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-secondary-700">PO Reference</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-secondary-700">Supplier</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-secondary-700">Status</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-secondary-700">ETA</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-secondary-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100">
                {mockSupplyChainData.inboundShipments.map(shipment => (
                  <tr key={shipment.id} className="hover:bg-secondary-50">
                    <td className="py-3 px-4 text-sm font-medium text-secondary-900">{shipment.id}</td>
                    <td className="py-3 px-4 text-sm text-secondary-900">{shipment.po}</td>
                    <td className="py-3 px-4 text-sm text-secondary-600">{shipment.supplier}</td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge status={shipment.status} />
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-secondary-600">
                      {formatDate(shipment.eta)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button 
                        onClick={() => handleTrackShipment(shipment)}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        Track
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Track Shipment Modal */}
      <Modal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
        title={`Shipment: ${selectedShipment?.id || ''}`}
        size="md"
      >
        {selectedShipment && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
              <div>
                <p className="text-sm text-secondary-500">PO Reference</p>
                <p className="font-medium text-secondary-900">{selectedShipment.po}</p>
              </div>
              <StatusBadge status={selectedShipment.status} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary-50 rounded-lg p-3">
                <p className="text-xs text-secondary-500">Supplier</p>
                <p className="font-medium text-secondary-900">{selectedShipment.supplier}</p>
              </div>
              <div className="bg-secondary-50 rounded-lg p-3">
                <p className="text-xs text-secondary-500">ETA</p>
                <p className="font-medium text-secondary-900">{formatDate(selectedShipment.eta)}</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-secondary-900 mb-3 flex items-center gap-2">
                <Navigation className="w-4 h-4" />
                Tracking Timeline
              </h4>
              <div className="space-y-3">
                {[
                  { status: 'Shipped', date: 'Nov 20, 2024', time: '08:30 AM', location: 'Shanghai Port', completed: true },
                  { status: 'In Transit', date: 'Nov 22, 2024', time: '02:15 PM', location: 'Pacific Ocean', completed: selectedShipment.status !== 'customs_hold' },
                  { status: 'Customs Clearance', date: 'Nov 25, 2024', time: 'Pending', location: 'Los Angeles Port', completed: selectedShipment.status === 'in_transit' || selectedShipment.status === 'delayed' },
                  { status: 'Delivered', date: selectedShipment.eta, time: 'Expected', location: 'Facility Warehouse', completed: false },
                ].map((event, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={cn(
                      "w-3 h-3 rounded-full mt-1.5",
                      event.completed ? "bg-success-500" : "bg-secondary-300"
                    )} />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className={cn(
                          "font-medium text-sm",
                          event.completed ? "text-secondary-900" : "text-secondary-500"
                        )}>
                          {event.status}
                        </p>
                        <span className="text-xs text-secondary-400">{event.date}</span>
                      </div>
                      <p className="text-xs text-secondary-500">{event.location} • {event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
