
import React, { useState, useCallback, useMemo } from 'react';
import './App.css'; // Ensure App.css is imported for all styles

// --- ICON DUMMIES (replace with actual SVG/Icon Library) ---
const Icon = ({ name, className = '', size = 20, color = 'currentColor' }) => {
  const icons = {
    Home: <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>,
    Search: <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>,
    ArrowUp: <path d="M12 5l7 7-7 7m0-14v14"/>,
    ArrowDown: <path d="M12 19l-7-7 7-7m0 14V5"/>,
    Contract: <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6m-4 10H8m8 0v-6m0-2h-8m8-2V4"/>,
    Edit: <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>,
    Eye: <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>,
    Plus: <path d="M12 4v16m-8-8h16"/>,
    User: <path d="M12 4a4 4 0 100 8 4 4 0 000-8zM6 20v-2a6 6 0 016-6h0a6 6 0 016 6v2H6z"/>,
    Bell: <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9zM10.3 21a1.999 1.999 0 003.4 0"/>,
    Dashboard: <path d="M3 12h18M3 6h18M3 18h18"/>,
    Settings: <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 5.636l-.707.707M6.343 6.343l-.707-.707m12.728 0l-.707.707m-9.192 12.728l-.707.707M12 15a3 3 0 100-6 3 3 0 000 6z"/>,
    Analytics: <path d="M3 3v18h18M18 6l-6 6-3-3-4 4"/>,
    Alert: <path d="M12 9v4m0 4h.01M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>,
    // Add more as needed
  };
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke={color}
         className={className} style={{ width: size, height: size }}>
      {icons[name]}
    </svg>
  );
};
// --- END ICON DUMMIES ---

// --- RBAC Configuration ---
const ROLES = {
  'F&I_MANAGER': 'F&I Product Manager',
  'CSR': 'Customer Service Representative',
  'DEALERSHIP_USER': 'Dealership Portal User',
  'VEHICLE_OWNER': 'Vehicle Owner',
  'SYSTEM_ARCHITECT': 'System Architect',
};

// --- Sample Data ---
const dummyVSCData = [
  {
    id: 'VSC-001',
    contractNumber: 'VSC-2023-001-A',
    plan: 'Premium Gold Plus',
    vehicle: '2022 Toyota Camry',
    owner: 'Alice Wonderland',
    dealership: 'Wonderland Motors',
    status: 'Approved',
    startDate: '2023-01-15',
    endDate: '2028-01-14',
    coverageAmount: 15000,
    currentMilestone: 'Underwriting Complete',
    workflow: [
      { name: 'Contract Initiation', status: 'completed', slaDue: '2023-01-16', completedOn: '2023-01-15' },
      { name: 'Underwriting Review', status: 'completed', slaDue: '2023-01-18', completedOn: '2023-01-17' },
      { name: 'Approval', status: 'completed', slaDue: '2023-01-20', completedOn: '2023-01-19' },
      { name: 'Customer Acknowledgment', status: 'in_progress', slaDue: '2023-01-22' },
      { name: 'Policy Issuance', status: 'pending', slaDue: '2023-01-25' },
    ],
    auditLog: [
      { timestamp: '2023-01-19T10:30:00Z', user: 'F&I_MANAGER', action: 'Approved contract', details: 'Final approval issued.' },
      { timestamp: '2023-01-17T14:15:00Z', user: 'SYSTEM_ARCHITECT', action: 'AI fraud check', details: 'No anomalies detected by AI.' },
      { timestamp: '2023-01-16T09:00:00Z', user: 'DEALERSHIP_USER', action: 'Submitted for underwriting', details: 'Initial contract details submitted.' },
    ]
  },
  {
    id: 'VSC-002',
    contractNumber: 'VSC-2023-002-B',
    plan: 'Basic Silver',
    vehicle: '2019 Honda Civic',
    owner: 'Bob The Builder',
    dealership: 'Build-It Motors',
    status: 'In Progress',
    startDate: '2023-02-01',
    endDate: '2027-02-01',
    coverageAmount: 8000,
    currentMilestone: 'Underwriting Review',
    workflow: [
      { name: 'Contract Initiation', status: 'completed', slaDue: '2023-02-02', completedOn: '2023-02-01' },
      { name: 'Underwriting Review', status: 'in_progress', slaDue: '2023-02-04' },
      { name: 'Approval', status: 'pending', slaDue: '2023-02-06' },
      { name: 'Customer Acknowledgment', status: 'pending', slaDue: '2023-02-08' },
      { name: 'Policy Issuance', status: 'pending', slaDue: '2023-02-10' },
    ],
    auditLog: [
      { timestamp: '2023-02-01T11:00:00Z', user: 'DEALERSHIP_USER', action: 'Contract initiated', details: 'New VSC created.' },
    ]
  },
  {
    id: 'VSC-003',
    contractNumber: 'VSC-2023-003-C',
    plan: 'Roadside Assistance',
    vehicle: '2020 Ford F-150',
    owner: 'Charlie Chaplin',
    dealership: 'Silent Films Auto',
    status: 'Pending',
    startDate: '2023-03-01',
    endDate: '2026-03-01',
    coverageAmount: 5000,
    currentMilestone: 'Contract Initiation',
    workflow: [
      { name: 'Contract Initiation', status: 'in_progress', slaDue: '2023-03-02' },
      { name: 'Underwriting Review', status: 'pending', slaDue: '2023-03-04' },
      { name: 'Approval', status: 'pending', slaDue: '2023-03-06' },
      { name: 'Customer Acknowledgment', status: 'pending', slaDue: '2023-03-08' },
      { name: 'Policy Issuance', status: 'pending', slaDue: '2023-03-10' },
    ],
    auditLog: [
      { timestamp: '2023-03-01T09:45:00Z', user: 'DEALERSHIP_USER', action: 'Started new contract draft', details: 'Basic info added.' },
    ]
  },
  {
    id: 'VSC-004',
    contractNumber: 'VSC-2023-004-D',
    plan: 'Ultimate Protection',
    vehicle: '2023 Tesla Model S',
    owner: 'Diana Prince',
    dealership: 'Justice League Auto',
    status: 'Rejected',
    startDate: '2023-04-01',
    endDate: '2028-04-01',
    coverageAmount: 20000,
    currentMilestone: 'Approval',
    workflow: [
      { name: 'Contract Initiation', status: 'completed', slaDue: '2023-04-02', completedOn: '2023-04-01' },
      { name: 'Underwriting Review', status: 'completed', slaDue: '2023-04-04', completedOn: '2023-04-03' },
      { name: 'Approval', status: 'rejected', slaDue: '2023-04-06' },
      { name: 'Customer Acknowledgment', status: 'pending', slaDue: '2023-04-08' },
      { name: 'Policy Issuance', status: 'pending', slaDue: '2023-04-10' },
    ],
    auditLog: [
      { timestamp: '2023-04-05T16:00:00Z', user: 'F&I_MANAGER', action: 'Rejected contract', details: 'Vehicle model not covered by current policy. Manual override required.' },
      { timestamp: '2023-04-03T10:00:00Z', user: 'SYSTEM_ARCHITECT', action: 'AI fraud check', details: 'Vehicle specifications flagged for manual review.' },
    ]
  },
  {
    id: 'VSC-005',
    contractNumber: 'VSC-2023-005-E',
    plan: 'Powertrain Plus',
    vehicle: '2021 Hyundai Kona',
    owner: 'Eve Harrington',
    dealership: 'All About Auto',
    status: 'Exception',
    startDate: '2023-05-01',
    endDate: '2027-05-01',
    coverageAmount: 12000,
    currentMilestone: 'Underwriting Review',
    workflow: [
      { name: 'Contract Initiation', status: 'completed', slaDue: '2023-05-02', completedOn: '2023-05-01' },
      { name: 'Underwriting Review', status: 'exception', slaDue: '2023-05-04' },
      { name: 'Approval', status: 'pending', slaDue: '2023-05-06' },
      { name: 'Customer Acknowledgment', status: 'pending', slaDue: '2023-05-08' },
      { name: 'Policy Issuance', status: 'pending', slaDue: '2023-05-10' },
    ],
    auditLog: [
      { timestamp: '2023-05-03T13:00:00Z', user: 'CSR', action: 'Flagged for exception', details: 'Customer requested plan modification after submission. Requires manager review.' },
    ]
  }
];

const dummyKPIs = [
  { id: 'kpi1', label: 'Total VSC Contracts', value: '1,234', trend: 'up', percentage: '2.5%' },
  { id: 'kpi2', label: 'Claims Processed (YTD)', value: '789', trend: 'up', percentage: '5.1%' },
  { id: 'kpi3', label: 'Pending Approvals', value: '42', trend: 'down', percentage: '-0.8%' },
  { id: 'kpi4', label: 'Avg. Claim Cycle Time', value: '3.2 Days', trend: 'down', percentage: '-1.2%' },
  { id: 'kpi5', label: 'New Contracts (Last 30 Days)', value: '115', trend: 'up', percentage: '12.3%' },
  { id: 'kpi6', label: 'Customer Satisfaction Score', value: '4.7/5', trend: 'up', percentage: '0.1%' },
  { id: 'kpi7', label: 'Policy Issuance Rate', value: '92.8%', trend: 'up', percentage: '0.5%' },
];

const VSC_STATUS_MAP = {
  'Approved': 'status-approved',
  'In Progress': 'status-in-progress',
  'Pending': 'status-pending',
  'Rejected': 'status-rejected',
  'Exception': 'status-exception',
};

const getStatusClass = (status) => VSC_STATUS_MAP[status] || '';

// --- Components ---

const Header = ({ currentUser, onSearch, onSelectRole, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const allSearchableItems = useMemo(() => {
    return dummyVSCData.map(vsc => ({
      type: 'VSC Contract',
      id: vsc.id,
      label: `${vsc.contractNumber} - ${vsc.vehicle} (${vsc.owner})`,
      params: { id: vsc.id }
    }));
  }, []);

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length > 2) {
      const filteredSuggestions = allSearchableItems.filter(item =>
        item.label.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5); // Limit suggestions
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [allSearchableItems]);

  const handleSelectSuggestion = useCallback((suggestion) => {
    setSearchTerm('');
    setSuggestions([]);
    onNavigate({ screen: 'VSC_DETAIL', params: suggestion.params });
  }, [onNavigate]);

  return (
    <header className="header">
      <a href="#" className="logo" onClick={() => onNavigate({ screen: 'DASHBOARD' })} style={{ textDecoration: 'none' }}>VSC Flow</a>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search contracts, claims, customers..."
          className="search-input"
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && suggestions.length > 0) {
              handleSelectSuggestion(suggestions[0]); // Select first suggestion on Enter
            }
          }}
          style={{ paddingRight: 'var(--spacing-md)' }}
        />
        {suggestions.length > 0 && (
          <div className="search-suggestions">
            {suggestions.map((s, index) => (
              <div
                key={index}
                className="search-suggestion-item"
                onClick={() => handleSelectSuggestion(s)}
              >
                {s.label} <span style={{ color: 'var(--text-light)' }}>({s.type})</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <nav className="flex items-center">
        <a href="#" className="nav-item" onClick={() => onNavigate({ screen: 'DASHBOARD' })}><Icon name="Dashboard" size={18} style={{ marginRight: 'var(--spacing-xs)' }} /> Dashboard</a>
        <a href="#" className="nav-item"><Icon name="Bell" size={18} style={{ marginRight: 'var(--spacing-xs)' }} /> Notifications</a>
        <div className="nav-item" style={{ marginLeft: 'var(--spacing-lg)' }}>
          <Icon name="User" size={18} style={{ marginRight: 'var(--spacing-xs)' }} />
          <span>{currentUser?.name} ({currentUser?.role})</span>
          <select
            value={currentUser?.role}
            onChange={(e) => onSelectRole(e.target.value)}
            style={{ marginLeft: 'var(--spacing-sm)', padding: 'var(--spacing-xs)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)' }}
          >
            {Object.values(ROLES).map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
      </nav>
    </header>
  );
};

const KPIWidget = ({ label, value, trend, percentage, isRealtime = false }) => (
  <div className={`card-glass kpi-card ${isRealtime ? 'realtime-pulse' : ''}`} style={{ borderRadius: 'var(--radius-lg)' }}>
    <div className="kpi-card-value">{value}</div>
    <div className="kpi-card-label">{label}</div>
    {trend && (
      <div className={`kpi-card-trend ${trend === 'up' ? 'up' : 'down'}`}>
        {percentage}
        <Icon name={trend === 'up' ? 'ArrowUp' : 'ArrowDown'} size={12} style={{ marginLeft: 'var(--spacing-xs)' }} />
      </div>
    )}
  </div>
);

const VSCStatusCard = ({ vsc, onClick, currentUser }) => {
  const canEdit = useMemo(() => currentUser?.role === ROLES['F&I_MANAGER'] || currentUser?.role === ROLES['DEALERSHIP_USER'], [currentUser]);
  const canViewDetail = true; // All roles can view details

  const handleEditClick = useCallback((e) => {
    e.stopPropagation(); // Prevent card click from triggering
    alert(`Editing VSC: ${vsc.contractNumber}`);
    // In a real app, this would navigate to an edit form
  }, [vsc]);

  return (
    <div
      className={`card-glass vsc-card ${getStatusClass(vsc.status)} cursor-pointer`}
      onClick={() => canViewDetail && onClick(vsc.id)}
      style={{
        borderRadius: 'var(--radius-md)',
        borderLeftColor: `var(--status-${vsc.status.toLowerCase().replace(' ', '-')}-border)`,
        backgroundColor: 'var(--glass-bg)',
        flexDirection: 'column',
        justifyContent: 'space-between', // For bottom actions
        position: 'relative',
        minHeight: '140px'
      }}
    >
      <div>
        <div className="vsc-card-header">
          <h3 className="vsc-card-title" style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-xs)', color: 'var(--text-main)' }}>
            {vsc.contractNumber}
          </h3>
          <span className={`vsc-card-status ${getStatusClass(vsc.status)}`}>
            {vsc.status}
          </span>
        </div>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-sm)' }}>
          {vsc.vehicle} - Owner: {vsc.owner}
        </p>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-light)' }}>
          Coverage: ${vsc.coverageAmount?.toLocaleString()} | Current: {vsc.currentMilestone}
        </p>
      </div>

      <div className="vsc-card-actions" style={{ position: 'absolute', bottom: 'var(--spacing-md)', right: 'var(--spacing-md)' }}>
        {canEdit && (
          <button
            className="button button-secondary"
            onClick={handleEditClick}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <Icon name="Edit" size={16} style={{ marginRight: 'var(--spacing-xs)' }} /> Edit
          </button>
        )}
        <button
          className="button button-primary"
          onClick={() => onClick(vsc.id)}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <Icon name="Eye" size={16} style={{ marginRight: 'var(--spacing-xs)' }} /> View
        </button>
      </div>
    </div>
  );
};

const ChartCard = ({ title, chartType, dataLabel, currentUser }) => {
  const canView = useMemo(() => currentUser?.role !== ROLES['VEHICLE_OWNER'], [currentUser]); // Example RBAC for charts

  if (!canView) {
    return (
      <div className="card-glass chart-card" style={{ borderRadius: 'var(--radius-lg)' }}>
        <Icon name="Alert" size={40} color="var(--text-light)" />
        <p className="chart-card-placeholder" style={{ fontSize: 'var(--font-size-lg)' }}>Access Denied</p>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-light)' }}>You do not have permission to view this chart.</p>
      </div>
    );
  }

  return (
    <div className="card-glass chart-card" style={{ borderRadius: 'var(--radius-lg)' }}>
      <h3 className="section-title" style={{ marginBottom: 'var(--spacing-sm)', borderBottom: 'none' }}>{title}</h3>
      <Icon name="Analytics" size={40} color="var(--text-light)" />
      <p className="chart-card-placeholder">
        {chartType} Chart Placeholder
        <span style={{ fontSize: 'var(--font-size-sm)', display: 'block' }}>({dataLabel})</span>
      </p>
    </div>
  );
};

const MilestoneTracker = ({ workflowStages }) => {
  const now = new Date();

  return (
    <div className="card-glass p-md my-md" style={{ borderRadius: 'var(--radius-md)' }}>
      <h3 className="section-title" style={{ marginBottom: 'var(--spacing-lg)' }}>Workflow Progress</h3>
      <div className="milestone-tracker">
        {workflowStages?.map((stage, index) => {
          const isCompleted = stage.status === 'completed';
          const isInProgress = stage.status === 'in_progress';
          const isCurrent = isInProgress || (!isCompleted && index > 0 && workflowStages?.[index - 1]?.status === 'completed'); // Simplified current logic
          const slaDueDate = stage.slaDue ? new Date(stage.slaDue) : null;
          const slaBreached = slaDueDate && !isCompleted && slaDueDate < now;

          return (
            <div key={stage.name} className="milestone-step">
              <div
                className={`milestone-circle ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                style={{
                  backgroundColor: isCompleted ? 'var(--accent-green)' : (isCurrent ? 'var(--accent-blue)' : 'var(--border-color)'),
                  borderColor: isCompleted ? 'var(--accent-green)' : (isCurrent ? 'var(--accent-blue)' : 'var(--border-color)'),
                  color: isCompleted || isCurrent ? 'var(--bg-secondary)' : 'var(--text-light)'
                }}
              >
                {index + 1}
              </div>
              <div className="milestone-label">{stage.name}</div>
              {stage.slaDue && (
                <div className={`milestone-sla ${slaBreached ? 'breached' : ''}`}>
                  SLA Due: {new Date(stage.slaDue).toLocaleDateString()}
                  {slaBreached && ' (Breached!)'}
                </div>
              )}
              {stage.completedOn && (
                <div className="milestone-sla" style={{ color: 'var(--accent-green)' }}>
                  Completed: {new Date(stage.completedOn).toLocaleDateString()}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const AuditFeed = ({ auditLog, currentUser }) => {
  const canViewLogs = useMemo(() => currentUser?.role !== ROLES['VEHICLE_OWNER'], [currentUser]); // Example RBAC for logs

  if (!canViewLogs) {
    return (
      <div className="card-glass p-md my-md text-center" style={{ borderRadius: 'var(--radius-md)' }}>
        <Icon name="Alert" size={30} color="var(--text-light)" />
        <p style={{ color: 'var(--text-secondary)' }}>You do not have permission to view audit logs.</p>
      </div>
    );
  }

  return (
    <div className="card-glass p-md my-md" style={{ borderRadius: 'var(--radius-md)' }}>
      <h3 className="section-title" style={{ marginBottom: 'var(--spacing-md)' }}>News / Audit Feed</h3>
      <div className="news-audit-feed">
        {auditLog?.length > 0 ? (
          auditLog?.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map((entry, index) => (
            <div key={index} className="audit-item">
              <div className="audit-icon">
                <Icon name="User" size={16} color="var(--bg-secondary)" />
              </div>
              <div className="audit-content">
                <strong>{entry.user}:</strong> {entry.action} - <span>{entry.details}</span>
                <div className="audit-meta">{new Date(entry.timestamp).toLocaleString()}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state" style={{ margin: '0' }}>
            <Icon name="Contract" size={40} className="empty-state-icon" />
            <div className="empty-state-title">No Recent Activity</div>
            <p className="empty-state-description">There are no audit events recorded for this contract yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const VSCDetailScreen = ({ vscId, onBack, currentUser }) => {
  const vsc = useMemo(() => dummyVSCData.find(d => d.id === vscId), [vscId]);

  const canEdit = useMemo(() => currentUser?.role === ROLES['F&I_MANAGER'] || currentUser?.role === ROLES['DEALERSHIP_USER'], [currentUser]);
  const canDelete = useMemo(() => currentUser?.role === ROLES['F&I_MANAGER'], [currentUser]);
  const canApprove = useMemo(() => currentUser?.role === ROLES['F&I_MANAGER'], [currentUser]);

  const handleAction = useCallback((action) => {
    alert(`${action} VSC ${vsc?.contractNumber}`);
    // Implement actual logic for edit, delete, approve
  }, [vsc]);

  if (!vsc) {
    return (
      <div className="detail-page-container fade-in">
        <div className="breadcrumbs">
          <a href="#" onClick={onBack}>Dashboard</a> <span>/</span> <span>Not Found</span>
        </div>
        <div className="empty-state" style={{ margin: 'var(--spacing-xl) 0' }}>
          <Icon name="Alert" size={60} className="empty-state-icon" />
          <div className="empty-state-title">VSC Contract Not Found</div>
          <p className="empty-state-description">The requested Vehicle Service Contract could not be found. It might have been deleted or never existed.</p>
          <button className="button button-primary" onClick={onBack}>Go to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-page-container fade-in">
      <div className="breadcrumbs">
        <a href="#" onClick={onBack} style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}>Dashboard</a> <span>/</span> <span>{vsc.contractNumber}</span>
      </div>
      <div className="detail-header" style={{ marginTop: 'var(--spacing-md)' }}>
        <h1 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--text-main)' }}>{vsc.contractNumber} - {vsc.vehicle}</h1>
        <div className="flex gap-md">
          {canApprove && vsc.status === 'Pending' && (
            <button className="button button-primary" onClick={() => handleAction('Approve')}>Approve</button>
          )}
          {canEdit && (
            <button className="button button-secondary" onClick={() => handleAction('Edit')}>
              <Icon name="Edit" size={16} style={{ marginRight: 'var(--spacing-xs)' }} /> Edit Contract
            </button>
          )}
          {canDelete && (
            <button className="button button-secondary" onClick={() => handleAction('Delete')} style={{ color: 'var(--accent-red)', borderColor: 'var(--accent-red)' }}>Delete</button>
          )}
        </div>
      </div>

      <div className="card-glass p-md my-md" style={{ borderRadius: 'var(--radius-md)' }}>
        <h3 className="section-title" style={{ marginBottom: 'var(--spacing-md)' }}>Record Summary</h3>
        <div className="record-summary-grid">
          <div className="summary-item">
            <div className="summary-label">Status</div>
            <div className={`summary-value ${getStatusClass(vsc.status)}`}>{vsc.status}</div>
          </div>
          <div className="summary-item">
            <div className="summary-label">Owner</div>
            <div className="summary-value">{vsc.owner}</div>
          </div>
          <div className="summary-item">
            <div className="summary-label">Dealership</div>
            <div className="summary-value">{vsc.dealership}</div>
          </div>
          <div className="summary-item">
            <div className="summary-label">Plan</div>
            <div className="summary-value">{vsc.plan}</div>
          </div>
          <div className="summary-item">
            <div className="summary-label">Coverage Amount</div>
            <div className="summary-value">${vsc.coverageAmount?.toLocaleString()}</div>
          </div>
          <div className="summary-item">
            <div className="summary-label">Start Date</div>
            <div className="summary-value">{new Date(vsc.startDate).toLocaleDateString()}</div>
          </div>
          <div className="summary-item">
            <div className="summary-label">End Date</div>
            <div className="summary-value">{new Date(vsc.endDate).toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      <MilestoneTracker workflowStages={vsc.workflow} />

      <AuditFeed auditLog={vsc.auditLog} currentUser={currentUser} />

      {/* Placeholder for Related Records/Documents */}
      <div className="card-glass p-md my-md" style={{ borderRadius: 'var(--radius-md)' }}>
        <h3 className="section-title" style={{ marginBottom: 'var(--spacing-md)' }}>Related Records & Documents</h3>
        <p style={{ color: 'var(--text-light)' }}>
          View related claims, customer profiles, and contract documents here. (e.g., Claim-2023-05-A, ID-Proof.pdf)
          <br />
          <button className="button button-secondary" style={{ marginTop: 'var(--spacing-md)' }}>View All Related</button>
        </p>
      </div>

    </div>
  );
};

const DashboardScreen = ({ onSelectVSC, currentUser, onNewContract }) => {
  const contractCount = dummyVSCData.length;
  const pendingApprovals = dummyVSCData.filter(vsc => vsc.status === 'Pending').length;
  const inProgressContracts = dummyVSCData.filter(vsc => vsc.status === 'In Progress').length;
  const approvedContracts = dummyVSCData.filter(vsc => vsc.status === 'Approved').length;

  const canCreateNew = useMemo(() => currentUser?.role === ROLES['DEALERSHIP_USER'] || currentUser?.role === ROLES['F&I_MANAGER'], [currentUser]);

  return (
    <div className="main-content fade-in">
      <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h2 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--text-main)' }}>VSC Overview</h2>
        {canCreateNew && (
          <button className="button button-primary" onClick={onNewContract} style={{ display: 'flex', alignItems: 'center' }}>
            <Icon name="Plus" size={16} style={{ marginRight: 'var(--spacing-xs)' }} /> New Contract
          </button>
        )}
      </div>

      <div className="dashboard-grid" style={{ padding: '0', marginBottom: 'var(--spacing-xl)' }}>
        {dummyKPIs.map(kpi => (
          <KPIWidget
            key={kpi.id}
            label={kpi.label}
            value={kpi.value}
            trend={kpi.trend}
            percentage={kpi.percentage}
            isRealtime={kpi.isRealtime}
          />
        ))}
      </div>

      <h2 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--text-main)', marginBottom: 'var(--spacing-lg)' }}>Contracts by Status</h2>
      <div className="dashboard-grid" style={{ padding: '0', marginBottom: 'var(--spacing-xl)' }}>
        {dummyVSCData.length > 0 ? (
          dummyVSCData.map(vsc => (
            <VSCStatusCard key={vsc.id} vsc={vsc} onClick={onSelectVSC} currentUser={currentUser} />
          ))
        ) : (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            <Icon name="Contract" size={60} className="empty-state-icon" />
            <div className="empty-state-title">No Vehicle Service Contracts Found</div>
            <p className="empty-state-description">It looks like there are no VSC contracts in the system yet. Start by creating a new one!</p>
            {canCreateNew && (
              <button className="button button-primary" onClick={onNewContract}>
                <Icon name="Plus" size={16} style={{ marginRight: 'var(--spacing-xs)' }} /> Create New Contract
              </button>
            )}
          </div>
        )}
      </div>

      <h2 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--text-main)', marginBottom: 'var(--spacing-lg)' }}>Performance Analytics</h2>
      <div className="dashboard-grid" style={{ padding: '0', marginBottom: 'var(--spacing-xl)' }}>
        <ChartCard title="Contract Status Distribution" chartType="Donut" dataLabel="VSC Statuses" currentUser={currentUser} />
        <ChartCard title="Monthly Contract Volume" chartType="Bar" dataLabel="Contracts per month" currentUser={currentUser} />
        <ChartCard title="Claims Processing Times" chartType="Line" dataLabel="Avg. days to close claim" currentUser={currentUser} />
        <ChartCard title="SLA Compliance Rate" chartType="Gauge" dataLabel="Workflow compliance" currentUser={currentUser} />
      </div>

    </div>
  );
};

// --- Main App Component ---
function App() {
  const [view, setView] = useState({ screen: 'DASHBOARD', params: {} });
  const [currentUser, setCurrentUser] = useState({
    id: 'admin1',
    name: 'F&I Manager',
    role: ROLES['F&I_MANAGER'], // Default user role
  });

  const handleNavigate = useCallback((newView) => {
    setView(newView);
  }, []);

  const handleSelectVSC = useCallback((vscId) => {
    handleNavigate({ screen: 'VSC_DETAIL', params: { id: vscId } });
  }, [handleNavigate]);

  const handleBackToDashboard = useCallback(() => {
    handleNavigate({ screen: 'DASHBOARD' });
  }, [handleNavigate]);

  const handleSelectRole = useCallback((role) => {
    setCurrentUser(prev => ({ ...prev, role }));
  }, []);

  const handleNewContract = useCallback(() => {
    alert('Navigating to New Contract Form');
    // In a real app, this would navigate to a full-screen new contract creation form
    // handleNavigate({ screen: 'NEW_CONTRACT_FORM', params: {} });
  }, []);

  return (
    <div className="app-container">
      <Header
        currentUser={currentUser}
        onSearch={() => alert('Search initiated')}
        onSelectRole={handleSelectRole}
        onNavigate={handleNavigate}
      />

      {view.screen === 'DASHBOARD' && (
        <DashboardScreen
          onSelectVSC={handleSelectVSC}
          currentUser={currentUser}
          onNewContract={handleNewContract}
        />
      )}

      {view.screen === 'VSC_DETAIL' && (
        <VSCDetailScreen
          vscId={view.params?.id}
          onBack={handleBackToDashboard}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}

export default App;