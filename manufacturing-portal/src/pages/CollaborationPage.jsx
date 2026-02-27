import { useState } from 'react';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  Edit3,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Paperclip,
  Clock,
  CheckCircle,
  FileEdit,
  Download,
  Eye,
  Upload,
  X,
  FolderOpen
} from 'lucide-react';
import { mockCollaborationData } from '../data/mockData';
import { cn, formatDate } from '../utils/helpers';
import Modal from '../components/common/Modal';

function StatusBadge({ status }) {
  const colors = {
    approved: 'badge-success',
    active: 'badge-success',
    in_review: 'badge-warning',
    draft: 'badge-secondary',
    resolved: 'badge-success',
    pending: 'badge-warning',
  };
  return (
    <span className={cn("badge", colors[status] || 'badge-secondary')}>
      {status.replace('_', ' ')}
    </span>
  );
}

export default function CollaborationPage() {
  const [activeTab, setActiveTab] = useState('documents');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isViewDocModalOpen, setIsViewDocModalOpen] = useState(false);
  const [isNewThreadModalOpen, setIsNewThreadModalOpen] = useState(false);
  const [isNewECRModalOpen, setIsNewECRModalOpen] = useState(false);
  const [docForm, setDocForm] = useState({
    name: '',
    type: 'Specification',
    description: '',
    file: null
  });

  const filteredDocs = mockCollaborationData.documents.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDoc = (doc) => {
    setSelectedDoc(doc);
    setIsViewDocModalOpen(true);
  };

  const handleDownloadDoc = (doc) => {
    // Simulate file download
    const blob = new Blob(['Document content for ' + doc.name], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${doc.name.replace(/\s+/g, '_')}_v${doc.version}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Collaboration, Documents & Knowledge</h1>
          <p className="text-secondary-500">Document management, team collaboration threads, and knowledge base</p>
        </div>
        <button 
          onClick={() => setIsDocModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Document
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-secondary-200">
        <div className="flex gap-6">
          {[
            { id: 'documents', label: 'Documents', icon: FileText },
            { id: 'threads', label: 'Discussion Threads', icon: MessageSquare },
            { id: 'ecr', label: 'Changes (ECR/ECO)', icon: Edit3 },
            { id: 'knowledge', label: 'Knowledge Base', icon: Users },
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

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-secondary-400" />
              <select className="input py-2">
                <option value="all">All Types</option>
                <option value="specification">Specifications</option>
                <option value="test-plan">Test Plans</option>
                <option value="fmea">FMEAs</option>
                <option value="work-instruction">Work Instructions</option>
              </select>
            </div>
          </div>

          {/* Document Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocs.map(doc => (
              <div key={doc.id} className="card hover:shadow-md transition-shadow cursor-pointer group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                    <FileText className="w-6 h-6 text-primary-600" />
                  </div>
                  <StatusBadge status={doc.status} />
                </div>
                
                <h3 className="font-semibold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {doc.name}
                </h3>
                
                <div className="flex items-center gap-4 text-sm text-secondary-500 mb-4">
                  <span>{doc.type}</span>
                  <span>•</span>
                  <span>v{doc.version}</span>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-secondary-200">
                  <span className="text-xs text-secondary-400">{formatDate(doc.date)}</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleViewDoc(doc)}
                      className="p-2 hover:bg-secondary-100 rounded-lg transition-colors" 
                      title="View"
                    >
                      <Eye className="w-4 h-4 text-secondary-600" />
                    </button>
                    <button 
                      onClick={() => handleDownloadDoc(doc)}
                      className="p-2 hover:bg-secondary-100 rounded-lg transition-colors" 
                      title="Download"
                    >
                      <Download className="w-4 h-4 text-secondary-600" />
                    </button>
                    <button 
                      onClick={() => alert(`Edit document: ${doc.name}`)}
                      className="p-2 hover:bg-secondary-100 rounded-lg transition-colors" 
                      title="Edit"
                    >
                      <FileEdit className="w-4 h-4 text-secondary-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Document Stats */}
          <div className="card">
            <h3 className="font-semibold text-secondary-900 mb-4">Document Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-secondary-50 rounded-lg">
                <p className="text-2xl font-bold text-secondary-900">{mockCollaborationData.documents.length}</p>
                <p className="text-sm text-secondary-500">Total Documents</p>
              </div>
              <div className="text-center p-4 bg-success-50 rounded-lg">
                <p className="text-2xl font-bold text-success-600">
                  {mockCollaborationData.documents.filter(d => d.status === 'approved').length}
                </p>
                <p className="text-sm text-secondary-500">Approved</p>
              </div>
              <div className="text-center p-4 bg-warning-50 rounded-lg">
                <p className="text-2xl font-bold text-warning-600">
                  {mockCollaborationData.documents.filter(d => d.status === 'in_review').length}
                </p>
                <p className="text-sm text-secondary-500">In Review</p>
              </div>
              <div className="text-center p-4 bg-secondary-50 rounded-lg">
                <p className="text-2xl font-bold text-secondary-600">
                  {mockCollaborationData.documents.filter(d => d.status === 'draft').length}
                </p>
                <p className="text-sm text-secondary-500">Drafts</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Threads Tab */}
      {activeTab === 'threads' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
              <input
                type="text"
                placeholder="Search discussions..."
                className="input pl-10 w-full"
              />
            </div>
            <button 
              onClick={() => setIsNewThreadModalOpen(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Thread
            </button>
          </div>

          <div className="space-y-4">
            {mockCollaborationData.threads.map(thread => (
              <div key={thread.id} className="card hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary-900 mb-1">{thread.subject}</h3>
                      <div className="flex items-center gap-4 text-sm text-secondary-500">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {thread.participants} participants
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          {thread.messages} messages
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {thread.lastActivity}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={thread.status} />
                    <button className="p-2 hover:bg-secondary-100 rounded-lg transition-colors">
                      <MoreHorizontal className="w-5 h-5 text-secondary-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ECR Tab */}
      {activeTab === 'ecr' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-secondary-600">
              Engineering Change Requests and Change Orders
            </p>
            <button 
              onClick={() => setIsNewECRModalOpen(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New ECR
            </button>
          </div>

          <div className="space-y-4">
            {mockCollaborationData.ecrs.map(ecr => (
              <div key={ecr.id} className="card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center",
                      ecr.impact === 'major' ? "bg-danger-100" : "bg-warning-100"
                    )}>
                      <Edit3 className={cn(
                        "w-6 h-6",
                        ecr.impact === 'major' ? "text-danger-600" : "text-warning-600"
                      )} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-secondary-900">{ecr.title}</h3>
                        <span className={cn(
                          "text-xs px-2 py-1 rounded-full font-medium",
                          ecr.impact === 'major' ? "bg-danger-100 text-danger-700" : "bg-warning-100 text-warning-700"
                        )}>
                          {ecr.impact} impact
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-secondary-500">
                        <span>{ecr.id}</span>
                        <span>•</span>
                        <span>{formatDate(ecr.date)}</span>
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={ecr.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Knowledge Base Tab */}
      {activeTab === 'knowledge' && (
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-secondary-400" />
            <input
              type="text"
              placeholder="Search knowledge base, procedures, FAQs..."
              className="input pl-14 py-4 text-lg w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Manufacturing Processes', icon: Users, count: 24, color: 'bg-blue-100 text-blue-600' },
              { title: 'Test Procedures', icon: CheckCircle, count: 18, color: 'bg-green-100 text-green-600' },
              { title: 'Training Materials', icon: FileText, count: 32, color: 'bg-purple-100 text-purple-600' },
              { title: 'FAQs', icon: MessageSquare, count: 56, color: 'bg-yellow-100 text-yellow-600' },
              { title: 'Contact Directory', icon: Users, count: 12, color: 'bg-pink-100 text-pink-600' },
              { title: 'SLA Documentation', icon: Clock, count: 8, color: 'bg-orange-100 text-orange-600' },
            ].map((category, index) => {
              const Icon = category.icon;
              return (
                <div key={index} className="card hover:shadow-md transition-shadow cursor-pointer group">
                  <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center mb-4", category.color)}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-semibold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-sm text-secondary-500">{category.count} articles</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* View Document Modal */}
      <Modal
        isOpen={isViewDocModalOpen}
        onClose={() => setIsViewDocModalOpen(false)}
        title={selectedDoc?.name || 'Document'}
        size="lg"
      >
        {selectedDoc && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-secondary-900">{selectedDoc.name}</p>
                  <p className="text-xs text-secondary-500">{selectedDoc.type} • v{selectedDoc.version}</p>
                </div>
              </div>
              <StatusBadge status={selectedDoc.status} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary-50 rounded-lg p-3">
                <p className="text-xs text-secondary-500">Created</p>
                <p className="font-medium text-secondary-900">{formatDate(selectedDoc.date)}</p>
              </div>
              <div className="bg-secondary-50 rounded-lg p-3">
                <p className="text-xs text-secondary-500">Size</p>
                <p className="font-medium text-secondary-900">2.4 MB</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-secondary-900 mb-2">Document Preview</h4>
              <div className="bg-secondary-50 rounded-lg p-4 h-40 flex items-center justify-center">
                <p className="text-secondary-400 text-sm">Document preview not available</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-secondary-900 mb-2">Revision History</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-secondary-50 rounded">
                  <span>v{selectedDoc.version} - Current</span>
                  <span className="text-secondary-500">{formatDate(selectedDoc.date)}</span>
                </div>
                <div className="flex justify-between p-2 bg-secondary-50 rounded">
                  <span>v{parseFloat(selectedDoc.version) - 0.1} - Previous</span>
                  <span className="text-secondary-500">Oct 15, 2024</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* New Document Modal */}
      <Modal 
        isOpen={isDocModalOpen} 
        onClose={() => setIsDocModalOpen(false)}
        title="Upload New Document"
        size="md"
      >
        <form className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Document Name *
            </label>
            <input
              type="text"
              value={docForm.name}
              onChange={(e) => setDocForm({...docForm, name: e.target.value})}
              className="input w-full"
              placeholder="Enter document name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Type *
              </label>
              <select
                value={docForm.type}
                onChange={(e) => setDocForm({...docForm, type: e.target.value})}
                className="input w-full"
                required
              >
                <option value="Specification">Specification</option>
                <option value="Test Plan">Test Plan</option>
                <option value="FMEA">FMEA</option>
                <option value="Report">Report</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Program
              </label>
              <select className="input w-full">
                <option value="">Optional</option>
                <option value="PRG-001">PRG-001</option>
                <option value="PRG-002">PRG-002</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Description
            </label>
            <textarea
              value={docForm.description}
              onChange={(e) => setDocForm({...docForm, description: e.target.value})}
              className="input w-full h-16 resize-none"
              placeholder="Brief description..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Upload File *
            </label>
            <div className="border-2 border-dashed border-secondary-300 rounded-lg p-4 text-center hover:border-primary-300 transition-colors cursor-pointer bg-secondary-50">
              <FolderOpen className="w-8 h-8 text-secondary-400 mx-auto mb-2" />
              <p className="text-xs text-secondary-600">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-secondary-400">
                PDF, DOCX, XLSX (max 50MB)
              </p>
              <input 
                type="file" 
                className="hidden" 
                accept=".pdf,.docx,.xlsx"
                onChange={(e) => setDocForm({...docForm, file: e.target.files[0]})}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-secondary-200">
            <button
              type="button"
              onClick={() => setIsDocModalOpen(false)}
              className="btn-secondary py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                setIsDocModalOpen(false);
                alert('Document uploaded successfully!');
              }}
              className="btn-primary flex items-center gap-2 py-2"
            >
              <Upload className="w-4 h-4" />
              Upload
            </button>
          </div>
        </form>
      </Modal>

      {/* New Thread Modal */}
      <Modal
        isOpen={isNewThreadModalOpen}
        onClose={() => setIsNewThreadModalOpen(false)}
        title="Start New Discussion"
        size="md"
      >
        <form className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Subject *
            </label>
            <input
              type="text"
              className="input w-full"
              placeholder="Enter discussion subject"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Program
            </label>
            <select className="input w-full">
              <option value="">Select Program</option>
              <option value="PRG-001">PRG-001 - Aerospace Component</option>
              <option value="PRG-002">PRG-002 - Medical Device</option>
              <option value="PRG-003">PRG-003 - EV Battery</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Participants
            </label>
            <select className="input w-full">
              <option value="">Select Participants</option>
              <option value="team">Engineering Team</option>
              <option value="qa">Quality Assurance</option>
              <option value="sc">Supply Chain</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Message
            </label>
            <textarea
              className="input w-full h-20 resize-none"
              placeholder="Start the discussion..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-secondary-200">
            <button
              type="button"
              onClick={() => setIsNewThreadModalOpen(false)}
              className="btn-secondary py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                setIsNewThreadModalOpen(false);
                alert('Discussion thread created!');
              }}
              className="btn-primary py-2"
            >
              Start Discussion
            </button>
          </div>
        </form>
      </Modal>

      {/* New ECR Modal */}
      <Modal
        isOpen={isNewECRModalOpen}
        onClose={() => setIsNewECRModalOpen(false)}
        title="Create New ECR"
        size="md"
      >
        <form className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              ECR Title *
            </label>
            <input
              type="text"
              className="input w-full"
              placeholder="Enter ECR title"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Program *
              </label>
              <select className="input w-full" required>
                <option value="">Select</option>
                <option value="PRG-001">PRG-001</option>
                <option value="PRG-002">PRG-002</option>
                <option value="PRG-003">PRG-003</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Impact *
              </label>
              <select className="input w-full" required>
                <option value="minor">Minor</option>
                <option value="major">Major</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Description
            </label>
            <textarea
              className="input w-full h-16 resize-none"
              placeholder="Describe the change request..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Reason for Change
            </label>
            <input
              type="text"
              className="input w-full"
              placeholder="Enter reason"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-secondary-200">
            <button
              type="button"
              onClick={() => setIsNewECRModalOpen(false)}
              className="btn-secondary py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                setIsNewECRModalOpen(false);
                alert('ECR created successfully!');
              }}
              className="btn-primary py-2"
            >
              Submit ECR
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
