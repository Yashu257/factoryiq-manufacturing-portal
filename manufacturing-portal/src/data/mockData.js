export const mockPrograms = [
  {
    id: 'PRG-001',
    name: 'Aerospace Component Program',
    customer: 'Airbus Defense & Space',
    status: 'active',
    progress: 78,
    startDate: '2024-01-15',
    targetDate: '2025-06-30',
    owner: 'Sarah Chen',
    site: 'Phoenix Facility',
    milestones: [
      { id: 1, name: 'Design Review', status: 'completed', date: '2024-03-15' },
      { id: 2, name: 'Prototype Build', status: 'completed', date: '2024-06-30' },
      { id: 3, name: 'First Article Inspection', status: 'in_progress', date: '2024-12-15' },
      { id: 4, name: 'Production Readiness', status: 'pending', date: '2025-03-01' },
    ],
    risks: ['Supply chain delay on titanium alloy', 'Tooling calibration issues'],
  },
  {
    id: 'PRG-002',
    name: 'Medical Device Series M',
    customer: 'Medtronic',
    status: 'active',
    progress: 45,
    startDate: '2024-06-01',
    targetDate: '2025-12-31',
    owner: 'Mike Rodriguez',
    site: 'Irvine Facility',
    milestones: [
      { id: 1, name: 'Requirements Analysis', status: 'completed', date: '2024-07-15' },
      { id: 2, name: 'Concept Design', status: 'in_progress', date: '2024-10-30' },
      { id: 3, name: 'Detailed Design', status: 'pending', date: '2025-02-28' },
      { id: 4, name: 'Clinical Trials', status: 'pending', date: '2025-08-15' },
    ],
    risks: ['FDA submission timeline', 'Biocompatibility testing'],
  },
  {
    id: 'PRG-003',
    name: 'EV Battery Housing',
    customer: 'Tesla',
    status: 'delayed',
    progress: 62,
    startDate: '2024-03-01',
    targetDate: '2025-03-31',
    owner: 'Jennifer Park',
    site: 'Austin Facility',
    milestones: [
      { id: 1, name: 'Material Selection', status: 'completed', date: '2024-04-15' },
      { id: 2, name: 'Thermal Testing', status: 'completed', date: '2024-08-30' },
      { id: 3, name: 'Crash Simulation', status: 'delayed', date: '2024-12-01' },
      { id: 4, name: 'Production Pilot', status: 'pending', date: '2025-02-15' },
    ],
    risks: ['Crash test failures', 'Weight reduction requirements not met'],
  },
  {
    id: 'PRG-004',
    name: 'Satellite Communication Module',
    customer: 'SpaceX',
    status: 'active',
    progress: 35,
    startDate: '2024-08-01',
    targetDate: '2025-08-15',
    owner: 'David Kim',
    site: 'Seattle Facility',
    milestones: [
      { id: 1, name: 'Architecture Design', status: 'completed', date: '2024-09-15' },
      { id: 2, name: 'PCB Layout', status: 'in_progress', date: '2024-11-30' },
      { id: 3, name: 'EMI/EMC Testing', status: 'pending', date: '2025-02-28' },
      { id: 4, name: 'Flight Qualification', status: 'pending', date: '2025-06-30' },
    ],
    risks: ['Radiation hardening certification', 'Signal interference issues'],
  },
  {
    id: 'PRG-005',
    name: 'Industrial Robot Arm',
    customer: 'ABB Robotics',
    status: 'on_hold',
    progress: 15,
    startDate: '2024-09-01',
    targetDate: '2025-09-30',
    owner: 'Lisa Thompson',
    site: 'Detroit Facility',
    milestones: [
      { id: 1, name: 'Concept Development', status: 'completed', date: '2024-10-15' },
      { id: 2, name: 'Mechanical Design', status: 'on_hold', date: '2025-01-15' },
      { id: 3, name: 'Control Systems', status: 'pending', date: '2025-05-30' },
      { id: 4, name: 'Safety Certification', status: 'pending', date: '2025-08-15' },
    ],
    risks: ['Budget constraints', 'Safety standard changes'],
  },
];

export const mockProductionData = {
  sites: [
    {
      id: 'SITE-001',
      name: 'Phoenix Facility',
      location: 'Phoenix, AZ',
      status: 'operational',
      lines: [
        { id: 'L1', name: 'Assembly Line A', status: 'running', utilization: 87, oee: 82, wip: 124 },
        { id: 'L2', name: 'Assembly Line B', status: 'running', utilization: 92, oee: 88, wip: 89 },
        { id: 'L3', name: 'CNC Line', status: 'maintenance', utilization: 0, oee: 0, wip: 45 },
      ],
      shifts: {
        current: 'Day Shift',
        operators: 45,
        supervisors: 6,
      },
      output: {
        planned: 1200,
        actual: 1156,
        yield: 96.3,
      },
    },
    {
      id: 'SITE-002',
      name: 'Irvine Facility',
      location: 'Irvine, CA',
      status: 'operational',
      lines: [
        { id: 'L4', name: 'Clean Room 1', status: 'running', utilization: 95, oee: 91, wip: 67 },
        { id: 'L5', name: 'Clean Room 2', status: 'running', utilization: 88, oee: 85, wip: 78 },
      ],
      shifts: {
        current: 'Day Shift',
        operators: 32,
        supervisors: 4,
      },
      output: {
        planned: 800,
        actual: 784,
        yield: 98.0,
      },
    },
  ],
  defects: [
    { type: 'Dimensional', count: 12, severity: 'minor' },
    { type: 'Surface Finish', count: 8, severity: 'minor' },
    { type: 'Assembly Error', count: 5, severity: 'major' },
    { type: 'Material Defect', count: 3, severity: 'critical' },
  ],
};

export const mockQualityData = {
  audits: [
    { id: 'AUD-001', type: 'ISO 9001', status: 'completed', date: '2024-10-15', score: 94, auditor: 'External' },
    { id: 'AUD-002', type: 'AS9100', status: 'in_progress', date: '2024-11-20', score: null, auditor: 'External' },
    { id: 'AUD-003', type: 'Internal QMS', status: 'scheduled', date: '2024-12-10', score: null, auditor: 'Internal' },
  ],
  certifications: [
    { id: 'CERT-001', name: 'ISO 9001:2015', status: 'active', expiryDate: '2027-10-15' },
    { id: 'CERT-002', name: 'AS9100D', status: 'active', expiryDate: '2027-08-20' },
    { id: 'CERT-003', name: 'ISO 13485', status: 'active', expiryDate: '2026-12-31' },
    { id: 'CERT-004', name: 'NADCAP', status: 'expiring', expiryDate: '2025-01-15' },
  ],
  ncr: [
    { id: 'NCR-001', title: 'Dimensional Out of Spec', status: 'open', date: '2024-11-10', program: 'PRG-001', severity: 'major' },
    { id: 'NCR-002', title: 'Surface Roughness Issue', status: 'closed', date: '2024-10-25', program: 'PRG-002', severity: 'minor' },
    { id: 'NCR-003', title: 'Material Certificate Missing', status: 'open', date: '2024-11-18', program: 'PRG-001', severity: 'critical' },
    { id: 'NCR-004', title: 'Label Misalignment', status: 'closed', date: '2024-11-05', program: 'PRG-004', severity: 'minor' },
  ],
  capa: [
    { id: 'CAPA-001', title: 'Improve Welding Process', status: 'implemented', date: '2024-09-30', effectiveness: 'verified' },
    { id: 'CAPA-002', title: 'Update Inspection Procedure', status: 'in_progress', date: '2024-11-15', effectiveness: 'pending' },
  ],
  spcData: {
    cpk: [1.45, 1.52, 1.38, 1.67, 1.71, 1.63, 1.58, 1.69, 1.72, 1.65],
    dates: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10'],
  },
};

export const mockSupplyChainData = {
  poStatus: [
    { status: 'Open', count: 45, value: 2450000 },
    { status: 'Partial', count: 23, value: 1200000 },
    { status: 'Closed', count: 156, value: 8900000 },
  ],
  suppliers: [
    { id: 'SUP-001', name: 'Titanium Industries', status: 'active', performance: 94, onTime: 96, quality: 98 },
    { id: 'SUP-002', name: 'Precision Metals Co', status: 'active', performance: 88, onTime: 91, quality: 95 },
    { id: 'SUP-003', name: 'Advanced Electronics', status: 'at_risk', performance: 72, onTime: 78, quality: 89 },
    { id: 'SUP-004', name: 'Global Fasteners Inc', status: 'active', performance: 91, onTime: 94, quality: 92 },
  ],
  inventory: {
    rawMaterials: { value: 4500000, turns: 8.5, days: 43 },
    wip: { value: 3200000, turns: 12.3, days: 30 },
    finishedGoods: { value: 2100000, turns: 15.2, days: 24 },
  },
  inboundShipments: [
    { id: 'SHIP-001', po: 'PO-2024-0892', supplier: 'Titanium Industries', eta: '2024-11-25', status: 'in_transit' },
    { id: 'SHIP-002', po: 'PO-2024-0893', supplier: 'Precision Metals Co', eta: '2024-11-28', status: 'customs_hold' },
    { id: 'SHIP-003', po: 'PO-2024-0894', supplier: 'Advanced Electronics', eta: '2024-12-02', status: 'delayed' },
  ],
};

export const mockAfterSalesData = {
  rmas: [
    { id: 'RMA-001', customer: 'Airbus', product: 'Panel Assembly', reason: 'Defective', status: 'received', date: '2024-11-10' },
    { id: 'RMA-002', customer: 'Medtronic', product: 'Housing Unit', reason: 'Wrong Spec', status: 'diagnosing', date: '2024-11-15' },
    { id: 'RMA-003', customer: 'Tesla', product: 'Bracket Set', reason: 'Damaged', status: 'repairing', date: '2024-11-08' },
    { id: 'RMA-004', customer: 'ABB', product: 'Mount Plate', reason: 'Missing Parts', status: 'shipped', date: '2024-11-05' },
  ],
  warranties: [
    { id: 'WAR-001', product: 'Aerospace Panel', status: 'active', expiry: '2026-11-15', claims: 2 },
    { id: 'WAR-002', product: 'Medical Housing', status: 'active', expiry: '2027-05-20', claims: 0 },
    { id: 'WAR-003', product: 'EV Battery Case', status: 'expiring', expiry: '2024-12-31', claims: 1 },
  ],
  spareParts: [
    { id: 'SP-001', name: 'Seal Kit A', stock: 145, reorder: 50, status: 'adequate' },
    { id: 'SP-002', name: 'Filter Set B', stock: 23, reorder: 30, status: 'low' },
    { id: 'SP-003', name: 'Gasket Pack C', stock: 8, reorder: 20, status: 'critical' },
  ],
};

export const mockCollaborationData = {
  documents: [
    { id: 'DOC-001', name: 'Design Specification v2.3', type: 'Specification', status: 'approved', version: '2.3', date: '2024-11-10' },
    { id: 'DOC-002', name: 'Test Plan Q4 2024', type: 'Test Plan', status: 'in_review', version: '1.1', date: '2024-11-15' },
    { id: 'DOC-003', name: 'Process FMEA', type: 'FMEA', status: 'approved', version: '3.0', date: '2024-10-20' },
    { id: 'DOC-004', name: 'Assembly Work Instruction', type: 'Work Instruction', status: 'draft', version: '0.5', date: '2024-11-18' },
  ],
  threads: [
    { id: 'TH-001', subject: 'Design Review Feedback - PRG-001', participants: 5, messages: 12, lastActivity: '2024-11-20', status: 'active' },
    { id: 'TH-002', subject: 'Material Change Request', participants: 3, messages: 8, lastActivity: '2024-11-19', status: 'resolved' },
    { id: 'TH-003', subject: 'Quality Issue Investigation', participants: 7, messages: 24, lastActivity: '2024-11-20', status: 'active' },
  ],
  ecrs: [
    { id: 'ECR-001', title: 'Update Material Specification', status: 'approved', impact: 'minor', date: '2024-11-10' },
    { id: 'ECR-002', title: 'Modify Assembly Sequence', status: 'in_review', impact: 'major', date: '2024-11-15' },
  ],
};

export const mockKPIData = {
  portfolio: {
    totalPrograms: 12,
    active: 8,
    delayed: 2,
    onHold: 1,
    completed: 1,
    onTimeDelivery: 87,
    qualityScore: 94.5,
    customerSatisfaction: 4.2,
  },
  financial: {
    revenueYTD: 48500000,
    revenueTarget: 52000000,
    margin: 24.5,
    bookings: 62000000,
  },
  operational: {
    oee: 85.3,
    firstPassYield: 96.8,
    onTimeShip: 91.2,
    supplierOtd: 93.5,
  },
  trends: [
    { month: 'Jan', revenue: 3800, margin: 22.5, otd: 88 },
    { month: 'Feb', revenue: 3900, margin: 23.1, otd: 89 },
    { month: 'Mar', revenue: 4100, margin: 23.8, otd: 90 },
    { month: 'Apr', revenue: 3950, margin: 22.9, otd: 87 },
    { month: 'May', revenue: 4200, margin: 24.2, otd: 92 },
    { month: 'Jun', revenue: 4300, margin: 24.8, otd: 93 },
    { month: 'Jul', revenue: 4400, margin: 25.1, otd: 91 },
    { month: 'Aug', revenue: 4350, margin: 24.5, otd: 90 },
    { month: 'Sep', revenue: 4500, margin: 25.3, otd: 94 },
    { month: 'Oct', revenue: 4650, margin: 25.8, otd: 95 },
    { month: 'Nov', revenue: 4700, margin: 26.1, otd: 93 },
  ],
};

export const mockUsers = [
  { id: 1, name: 'Admin User', email: 'admin@nexgile.com', role: 'admin', avatar: 'AU' },
  { id: 2, name: 'Engineer User', email: 'engineer@nexgile.com', role: 'engineer', avatar: 'EU' },
  { id: 3, name: 'Manager User', email: 'manager@nexgile.com', role: 'manager', avatar: 'MU' },
];
