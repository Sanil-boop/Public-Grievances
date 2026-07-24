import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Filter, CheckCircle, Clock, Search, MapPin, 
  Check, AlertCircle, Camera, MessageSquare, 
  Download, LayoutList, LayoutGrid, Edit3, Trash2, X, Save
} from 'lucide-react';
import styles from './DepartmentDashboard.module.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function DepartmentDashboard() {
  const { state: paramState, district, city } = useParams();
  const { state, actions } = useApp();
  const complaints = useMemo(() => state.complaints || [], [state.complaints]);

  const [viewMode, setViewMode] = useState('list'); // 'list' | 'kanban'
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  
  // New Update Form State
  const [updateText, setUpdateText] = useState('');
  const [updateStatus, setUpdateStatus] = useState('');
  const [updatePhoto, setUpdatePhoto] = useState(null);

  // Edit Update State
  const [editingUpdateId, setEditingUpdateId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editStatus, setEditStatus] = useState('');

  // Filter complaints by URL params and local filters
  const filteredComplaints = useMemo(() => {
    return complaints.filter(c => {
      // 1. Geography filter (forced by URL)
      const cState = (c.location?.state || '').toLowerCase();
      const cDistrict = (c.location?.district || '').toLowerCase();
      const cCity = (c.location?.city || '').toLowerCase();
      
      const matchGeo = 
        cState === (paramState || '').toLowerCase() &&
        cDistrict === (district || '').toLowerCase() &&
        cCity === (city || '').toLowerCase();
      
      if (!matchGeo) return false;

      // 2. Status & Priority filter
      const matchStatus = filterStatus === 'all' || c.status === filterStatus;
      const matchPriority = filterPriority === 'all' || (c.priority || '').toLowerCase() === filterPriority;
      
      return matchStatus && matchPriority;
    });
  }, [complaints, paramState, district, city, filterStatus, filterPriority]);

  const stats = {
    total: filteredComplaints.length,
    pending: filteredComplaints.filter(c => c.status === 'pending').length,
    inProgress: filteredComplaints.filter(c => c.status === 'in-progress').length,
    resolved: filteredComplaints.filter(c => c.status === 'resolved').length,
    urgent: filteredComplaints.filter(c => (c.priority || '').toLowerCase() === 'urgent').length
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUpdatePhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const submitUpdate = async () => {
    if (!selectedComplaint) return;
    
    await actions.addComplaintUpdate(selectedComplaint.id, {
      status: updateStatus || selectedComplaint.status,
      message: updateText.trim() || 'Status updated by department.',
      photo: updatePhoto
    });

    setUpdateText('');
    setUpdatePhoto(null);
    setUpdateStatus('');
    // Reloading local state isn't strictly necessary as actions updates the state
    setSelectedComplaint(state.complaints.find(c => c.id === selectedComplaint.id));
  };

  const openComplaint = (c) => {
    setSelectedComplaint(c);
    setUpdateStatus(c.status);
    setUpdateText('');
    setUpdatePhoto(null);
  };

  const exportCSV = () => {
    const headers = ['ID', 'Category', 'Priority', 'Status', 'Location', 'Timestamp', 'Text'];
    const rows = filteredComplaints.map(c => [
      c.id,
      c.categoryName,
      c.priority || 'Normal',
      c.status,
      `${c.location?.area || ''} ${c.location?.city || ''}`,
      new Date(c.createdAt).toLocaleString(),
      `"${c.text.replace(/"/g, '""')}"`
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `complaints_${city}_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper for SLA styling
  const getSlaStatus = (complaint) => {
    if (complaint.status === 'resolved') return { text: 'Resolved', class: styles.slaOk };
    const ageHours = (new Date() - new Date(complaint.createdAt)) / (1000 * 60 * 60);
    const p = (complaint.priority || '').toLowerCase();
    
    let limit = 72; // normal default
    if (p === 'urgent') limit = 12;
    if (p === 'high') limit = 24;
    
    if (ageHours > limit) return { text: 'Overdue', class: styles.slaDanger };
    if (ageHours > limit * 0.75) return { text: 'Approaching SLA', class: styles.slaWarn };
    return { text: 'On Track', class: styles.slaOk };
  };

  return (
    <motion.div 
      className={styles.page}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Department Portal</h1>
          <p className={styles.subtitle}>
            Managing complaints for: <strong>{city}, {district}, {paramState}</strong>
            <Link to="/select-state" className={styles.changeLocationBtn}>Change Location</Link>
          </p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.viewToggles}>
            <button 
              className={`${styles.iconBtn} ${viewMode === 'list' ? styles.activeIconBtn : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            ><LayoutList size={20}/></button>
            <button 
              className={`${styles.iconBtn} ${viewMode === 'kanban' ? styles.activeIconBtn : ''}`}
              onClick={() => setViewMode('kanban')}
              title="Kanban Board View"
            ><LayoutGrid size={20}/></button>
          </div>
          <button className={styles.exportBtn} onClick={exportCSV}>
            <Download size={18} /> Export CSV
          </button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <motion.div className={styles.statCard} variants={itemVariants}>
          <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(108, 92, 231, 0.15)', color: '#6c5ce7' }}>
            <AlertCircle size={24} />
          </div>
          <div>
            <p className={styles.statLabel}>Total Issues</p>
            <h3 className={styles.statValue}>{stats.total}</h3>
          </div>
        </motion.div>
        <motion.div className={styles.statCard} variants={itemVariants}>
          <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(225, 112, 85, 0.15)', color: '#e17055' }}>
            <Clock size={24} />
          </div>
          <div>
            <p className={styles.statLabel}>Pending</p>
            <h3 className={styles.statValue}>{stats.pending}</h3>
          </div>
        </motion.div>
        <motion.div className={styles.statCard} variants={itemVariants}>
          <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(0, 206, 201, 0.15)', color: '#00cec9' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <p className={styles.statLabel}>Resolved</p>
            <h3 className={styles.statValue}>{stats.resolved}</h3>
          </div>
        </motion.div>
        <motion.div className={styles.statCard} variants={itemVariants}>
          <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(255, 71, 87, 0.15)', color: '#ff4757' }}>
            <AlertCircle size={24} />
          </div>
          <div>
            <p className={styles.statLabel}>Urgent</p>
            <h3 className={styles.statValue}>{stats.urgent}</h3>
          </div>
        </motion.div>
      </div>

      {viewMode === 'list' && (
        <div className={styles.layout}>
          {/* Left Side: Filters */}
          <motion.div className={styles.filtersPanel} variants={itemVariants}>
            <div className={styles.panelHeader}>
              <Filter size={18} />
              <h2>Filters</h2>
            </div>
            
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Status</label>
              <select 
                className={styles.filterSelect} 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Priority</label>
              <select 
                className={styles.filterSelect} 
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="all">All</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="normal">Normal</option>
                <option value="low">Low</option>
              </select>
            </div>
          </motion.div>

          {/* Right Side: List */}
          <motion.div className={styles.listPanel} variants={itemVariants}>
            {filteredComplaints.length === 0 ? (
              <div className={styles.emptyState}>
                <Search size={48} className={styles.emptyIcon} />
                <p>No complaints match your filters.</p>
              </div>
            ) : (
              filteredComplaints.map(c => {
                const sla = getSlaStatus(c);
                return (
                  <div key={c.id} className={styles.complaintCard} onClick={() => openComplaint(c)}>
                    <div className={styles.cardHeader}>
                      <div className={styles.cardId}>{c.id}</div>
                      <div className={styles.cardBadges}>
                        <span className={`${styles.slaBadge} ${sla.class}`}>{sla.text}</span>
                        <span className={`${styles.badge} ${styles[c.status]}`}>
                          {c.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className={styles.cardBody} style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                      <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
                        <div className={styles.cardIcon}>{c.icon}</div>
                        <div>
                          <h3 className={styles.cardCategory}>{c.categoryName} <span className={styles.priorityTag}>• {c.priority || 'Normal'} Priority</span></h3>
                          <p className={styles.cardText}>{c.text.substring(0, 100)}{c.text.length > 100 ? '...' : ''}</p>
                          <div className={styles.cardLocation}>
                            <MapPin size={12} />
                            {c.location?.area ? `${c.location.area}, ${city}` : city}
                          </div>
                        </div>
                      </div>
                      {c.beforeImage && (
                        <div style={{ flexShrink: 0 }}>
                           <img src={c.beforeImage} alt="Complaint" style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </motion.div>
        </div>
      )}

      {viewMode === 'kanban' && (
        <motion.div className={styles.kanbanBoard} variants={itemVariants}>
          {['pending', 'in-progress', 'resolved'].map(status => {
            const colComplaints = filteredComplaints.filter(c => c.status === status);
            return (
              <div key={status} className={styles.kanbanColumn}>
                <h3 className={styles.kanbanColTitle}>
                  {status.replace('-', ' ').toUpperCase()} 
                  <span className={styles.kanbanCount}>{colComplaints.length}</span>
                </h3>
                <div className={styles.kanbanList}>
                  {colComplaints.map(c => {
                    const sla = getSlaStatus(c);
                    return (
                      <div key={c.id} className={styles.kanbanCard} onClick={() => openComplaint(c)}>
                        <div className={styles.cardHeader}>
                          <span className={`${styles.slaBadge} ${sla.class}`}>{sla.text}</span>
                        </div>
                        {c.beforeImage && (
                          <div style={{ marginBottom: 12 }}>
                            <img src={c.beforeImage} alt="Complaint" style={{ width: '100%', height: 100, borderRadius: 6, objectFit: 'cover' }} />
                          </div>
                        )}
                        <h4 className={styles.kanbanCategory}>{c.icon} {c.categoryName}</h4>
                        <p className={styles.kanbanText}>{c.text.substring(0, 50)}...</p>
                        <div className={styles.cardLocation}>
                          <MapPin size={12} /> {c.location?.area || 'Area unknown'}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            );
          })}
        </motion.div>
      )}

      {/* Modal / Action View */}
      <AnimatePresence>
        {selectedComplaint && (
          <motion.div 
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setSelectedComplaint(null);
              setEditingUpdateId(null);
            }}
          >
            <motion.div 
              className={styles.modalContent}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h2>Update Complaint: {selectedComplaint.id}</h2>
                <button className={styles.closeBtn} onClick={() => setSelectedComplaint(null)}>&times;</button>
              </div>
              
              <div className={styles.modalBody}>
                {/* Citizen's Original Complaint */}
                <div className={styles.issueDetails}>
                  <h3>{selectedComplaint.icon} {selectedComplaint.categoryName}</h3>
                  <div className={styles.readonlyTag}>Original Complaint (Read-only)</div>
                  <p>{selectedComplaint.text}</p>
                  
                  {/* Problem Photo (Citizen Upload) */}
                  {selectedComplaint.beforeImage && (
                    <div className={styles.problemPhotoWrapper}>
                      <img 
                        src={selectedComplaint.beforeImage} 
                        alt="Citizen Uploaded Evidence" 
                        className={styles.problemPhoto}
                      />
                    </div>
                  )}

                  <div className={styles.locationTag}>
                    <MapPin size={14} />
                    {selectedComplaint.location?.city ? `${selectedComplaint.location.area}, ${selectedComplaint.location.city}, ${selectedComplaint.location.district}, ${selectedComplaint.location.state}` : 'Location unknown'}
                  </div>
                </div>

                {/* Updates Timeline */}
                {selectedComplaint.updates && selectedComplaint.updates.length > 0 && (
                  <div className={styles.timelineSection}>
                    <h4>Update History</h4>
                    <div className={styles.timeline}>
                      {selectedComplaint.updates.map(upd => (
                        <div key={upd.id} className={styles.timelineItem}>
                          <div className={styles.timelineDot} />
                          <div className={styles.timelineContent}>
                            
                            {editingUpdateId === upd.id ? (
                              <div />
                            ) : (
                              <>
                                <div className={styles.timelineHeader}>
                                  <span className={styles.timelineDate}>{new Date(upd.createdAt).toLocaleString()}</span>
                                  <div className={styles.timelineActions}>
                                    <span className={`${styles.badge} ${styles[upd.status]}`}>{upd.status}</span>
                                  </div>
                                </div>
                                <p className={styles.timelineMsg}><MessageSquare size={14}/> {upd.message}</p>
                                {upd.photo && <img src={upd.photo} alt="Proof" className={styles.timelineImg} />}
                              </>
                            )}

                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add New Update Form */}
                <div className={styles.updateForm}>
                  <h4>Add New Update</h4>
                  <div className={styles.formGroup}>
                    <label>Change Status</label>
                    <div className={styles.statusGroup}>
                      <button 
                        className={`${styles.statusBtn} ${updateStatus === 'pending' ? styles.activePending : ''}`}
                        onClick={() => setUpdateStatus('pending')}
                      >Pending</button>
                      <button 
                        className={`${styles.statusBtn} ${updateStatus === 'in-progress' ? styles.activeProgress : ''}`}
                        onClick={() => setUpdateStatus('in-progress')}
                      >In Progress</button>
                      <button 
                        className={`${styles.statusBtn} ${updateStatus === 'resolved' ? styles.activeResolved : ''}`}
                        onClick={() => setUpdateStatus('resolved')}
                      >Resolved</button>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label><MessageSquare size={16}/> Text Update for Citizen</label>
                    <textarea 
                      className={styles.updateTextarea}
                      placeholder="e.g. We have inspected the site and repairs will begin tomorrow."
                      value={updateText}
                      onChange={(e) => setUpdateText(e.target.value)}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label><Camera size={16}/> Upload Resolution Photo (Optional)</label>
                    <div className={styles.photoUploadArea}>
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} id="photo-upload" className={styles.fileInput} />
                      <label htmlFor="photo-upload" className={styles.fileLabel}>
                        {updatePhoto ? <img src={updatePhoto} alt="Preview" className={styles.photoPreview} /> : <span>Select Photo</span>}
                      </label>
                    </div>
                  </div>

                  <button className={styles.submitUpdateBtn} onClick={submitUpdate}>
                    <Check size={18} /> Submit Update
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
