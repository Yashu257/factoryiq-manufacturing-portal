import { useState } from 'react';
import { 
  FolderKanban, 
  Search, 
  Filter, 
  Plus,
  ChevronDown,
  ChevronUp,
  Calendar,
  Users,
  MapPin,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { mockPrograms } from '../data/mockData';
import { formatDate, getStatusColor, cn } from '../utils/helpers';
import Modal from '../components/common/Modal';

function StatusBadge({ status }) {
  const color = getStatusColor(status);
  return (
    <span className={cn("badge", `badge-${color}`)}>
      {status.replace('_', ' ')}
    </span>
  );
}

function ProgramCard({ program, isExpanded, onToggle }) {
  return (
    <div className="card p-0 overflow-hidden">
      <div 
        className="p-5 cursor-pointer hover:bg-secondary-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-secondary-900">{program.name}</h3>
              <StatusBadge status={program.status} />
              <span className="text-xs text-secondary-500">{program.id}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-secondary-500">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {program.customer}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Due {formatDate(program.targetDate)}
              </span>
              <span>{program.site}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-2xl font-bold text-secondary-900">{program.progress}%</p>
              <p className="text-xs text-secondary-500">Progress</p>
            </div>
            <button className="p-2 hover:bg-secondary-200 rounded-lg transition-colors">
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="h-2 bg-secondary-200 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all",
                program.progress >= 75 ? "bg-success-500" : 
                program.progress >= 50 ? "bg-primary-500" : 
                program.status === 'delayed' ? "bg-danger-500" : "bg-warning-500"
              )}
              style={{ width: `${program.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-secondary-200 p-5 bg-secondary-50/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Milestones */}
            <div>
              <h4 className="font-medium text-secondary-900 mb-3">Milestones</h4>
              <div className="space-y-2">
                {program.milestones.map((milestone) => (
                  <div key={milestone.id} className="flex items-center gap-3 p-2 bg-white rounded-lg">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                      milestone.status === 'completed' ? "bg-success-100" :
                      milestone.status === 'in_progress' ? "bg-primary-100" :
                      milestone.status === 'delayed' ? "bg-danger-100" : "bg-secondary-100"
                    )}>
                      {milestone.status === 'completed' ? (
                        <CheckCircle className="w-4 h-4 text-success-600" />
                      ) : milestone.status === 'in_progress' ? (
                        <Clock className="w-4 h-4 text-primary-600" />
                      ) : (
                        <div className="w-2 h-2 bg-secondary-400 rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-secondary-900">{milestone.name}</p>
                      <p className="text-xs text-secondary-500">{formatDate(milestone.date)}</p>
                    </div>
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-full",
                      milestone.status === 'completed' ? "bg-success-100 text-success-700" :
                      milestone.status === 'in_progress' ? "bg-primary-100 text-primary-700" :
                      milestone.status === 'delayed' ? "bg-danger-100 text-danger-700" :
                      "bg-secondary-100 text-secondary-700"
                    )}>
                      {milestone.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Details & Risks */}
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-secondary-900 mb-3">Program Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-secondary-500">Program Manager</span>
                    <span className="font-medium text-secondary-900">{program.owner}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-500">Start Date</span>
                    <span className="font-medium text-secondary-900">{formatDate(program.startDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-500">Target Date</span>
                    <span className="font-medium text-secondary-900">{formatDate(program.targetDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-500">Facility</span>
                    <span className="font-medium text-secondary-900">{program.site}</span>
                  </div>
                </div>
              </div>

              {program.risks.length > 0 && (
                <div>
                  <h4 className="font-medium text-secondary-900 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-warning-600" />
                    Risk Flags
                  </h4>
                  <ul className="space-y-1">
                    {program.risks.map((risk, index) => (
                      <li key={index} className="text-sm text-secondary-600 flex items-start gap-2">
                        <span className="text-warning-500 mt-1">•</span>
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProgramsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [isNewProgramModalOpen, setIsNewProgramModalOpen] = useState(false);
  const [programForm, setProgramForm] = useState({
    name: '',
    customer: '',
    site: 'Phoenix Facility',
    owner: '',
    startDate: '',
    targetDate: ''
  });

  const filteredPrograms = mockPrograms.filter(program => {
    const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || program.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockPrograms.length,
    active: mockPrograms.filter(p => p.status === 'active').length,
    delayed: mockPrograms.filter(p => p.status === 'delayed').length,
    onHold: mockPrograms.filter(p => p.status === 'on_hold').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Programs & Projects</h1>
          <p className="text-secondary-500">Track R&D, NPI, and production programs across all sites</p>
        </div>
        <button 
          onClick={() => setIsNewProgramModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Program
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <p className="text-sm text-secondary-500">Total Programs</p>
          <p className="text-2xl font-bold text-secondary-900">{stats.total}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-secondary-500">Active</p>
          <p className="text-2xl font-bold text-success-600">{stats.active}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-secondary-500">Delayed</p>
          <p className="text-2xl font-bold text-danger-600">{stats.delayed}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-secondary-500">On Hold</p>
          <p className="text-2xl font-bold text-secondary-600">{stats.onHold}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
          <input
            type="text"
            placeholder="Search programs, customers, or IDs..."
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
            <option value="active">Active</option>
            <option value="delayed">Delayed</option>
            <option value="on_hold">On Hold</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Program List */}
      <div className="space-y-4">
        {filteredPrograms.map((program) => (
          <ProgramCard
            key={program.id}
            program={program}
            isExpanded={expandedId === program.id}
            onToggle={() => setExpandedId(expandedId === program.id ? null : program.id)}
          />
        ))}
        {filteredPrograms.length === 0 && (
          <div className="card py-12 text-center">
            <p className="text-secondary-500">No programs found matching your criteria</p>
          </div>
        )}
      </div>

      {/* New Program Modal */}
      <Modal
        isOpen={isNewProgramModalOpen}
        onClose={() => setIsNewProgramModalOpen(false)}
        title="Create New Program"
        size="md"
      >
        <form className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Program Name *
            </label>
            <input
              type="text"
              value={programForm.name}
              onChange={(e) => setProgramForm({...programForm, name: e.target.value})}
              className="input w-full"
              placeholder="Enter program name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Customer *
              </label>
              <input
                type="text"
                value={programForm.customer}
                onChange={(e) => setProgramForm({...programForm, customer: e.target.value})}
                className="input w-full"
                placeholder="Customer name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Facility *
              </label>
              <select
                value={programForm.site}
                onChange={(e) => setProgramForm({...programForm, site: e.target.value})}
                className="input w-full"
                required
              >
                <option value="Phoenix Facility">Phoenix Facility</option>
                <option value="Irvine Facility">Irvine Facility</option>
                <option value="Austin Facility">Austin Facility</option>
                <option value="Seattle Facility">Seattle Facility</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Program Manager *
            </label>
            <input
              type="text"
              value={programForm.owner}
              onChange={(e) => setProgramForm({...programForm, owner: e.target.value})}
              className="input w-full"
              placeholder="Manager name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                value={programForm.startDate}
                onChange={(e) => setProgramForm({...programForm, startDate: e.target.value})}
                className="input w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Target Date *
              </label>
              <input
                type="date"
                value={programForm.targetDate}
                onChange={(e) => setProgramForm({...programForm, targetDate: e.target.value})}
                className="input w-full"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-secondary-200">
            <button
              type="button"
              onClick={() => setIsNewProgramModalOpen(false)}
              className="btn-secondary py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                setIsNewProgramModalOpen(false);
                alert('Program created successfully!');
              }}
              className="btn-primary py-2"
            >
              Create Program
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
