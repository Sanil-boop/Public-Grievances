import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown, ClipboardList, Edit3, Trash2, Save, X, MapPin, MessageSquare, Camera } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import BeforeAfterVerifier from '../components/BeforeAfterVerifier/BeforeAfterVerifier';
import styles from './History.module.css';

import { CATEGORIES } from '../nlp/categories';

const STATUSES = ['All', 'pending', 'in-progress', 'resolved'];
const PRIORITIES = ['All', 'Urgent', 'High', 'Normal', 'Low'];

function formatDate(dateStr) {
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return '';
}

function getStatusClass(status) {
  const s = (status || '').toLowerCase().replace(/\s+/g, '');
  if (s === 'inprogress' || s === 'in-progress') return styles.statusInProgress;
  if (s === 'resolved') return styles.statusResolved;
  return styles.statusPending;
}

export default function History() {
  const { state, actions } = useApp();
  const { user } = useAuth();
  const { complaints } = state;

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  
  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  
  // Update Edit State
  const [editingUpdateId, setEditingUpdateId] = useState(null);
  const [editUpdateText, setEditUpdateText] = useState('');
  const [editUpdateStatus, setEditUpdateStatus] = useState('');
  
  const handleWithdraw = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to withdraw this complaint?')) {
      await actions.deleteComplaint(id);
    }
  };

  const handleEdit = (e, complaint) => {
    e.stopPropagation();
    setEditingId(complaint.id);
    setEditText(complaint.text);
  };

  const handleSaveEdit = async (e, id) => {
    e.stopPropagation();
    if (editText.trim()) {
      await actions.updateComplaint(id, { text: editText.trim() });
      setEditingId(null);
    }
  };

  const handleCancelEdit = (e) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const handleSaveUpdate = (complaintId, updateId) => {
    if (editUpdateText.trim()) {
      dispatch({
        type: 'EDIT_COMPLAINT_UPDATE',
        payload: {
          complaintId,
          updateId,
          message: editUpdateText.trim(),
          status: editUpdateStatus,
        }
      });
      setEditingUpdateId(null);
    }
  };

  const filtered = useMemo(() => {
    return [...complaints]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .filter((c) => {
        if (search) {
          const term = search.toLowerCase();
          const match = c.text?.toLowerCase().includes(term) ||
                        c.id?.toLowerCase().includes(term) ||
                        c.categoryName?.toLowerCase().includes(term) ||
                        c.location?.area?.toLowerCase().includes(term) ||
                        c.location?.city?.toLowerCase().includes(term);
          if (!match) return false;
        }
        if (categoryFilter !== 'All' && c.category !== categoryFilter)
          return false;
        if (statusFilter !== 'All' && c.status !== statusFilter) return false;
        if (priorityFilter !== 'All' && c.priority !== priorityFilter)
          return false;
        return true;
      });
  }, [complaints, search, categoryFilter, statusFilter, priorityFilter]);

  if (complaints.length === 0) {
    return (
      <motion.div
        className={styles.page}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <ClipboardList size={32} />
          </div>
          <h2 className={styles.emptyTitle}>No Complaints Yet</h2>
          <p className={styles.emptyDesc}>
            Your complaint history will appear here once you file your first complaint.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={styles.page}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.searchWrapper}>
          <Search size={16} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search complaints..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className={styles.filterSelect}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          className={styles.filterSelect}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s === 'All' ? 'All Status' : s.replace('-', ' ').toUpperCase()}
            </option>
          ))}
        </select>
        <select
          className={styles.filterSelect}
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p === 'All' ? 'All Priorities' : p}
            </option>
          ))}
        </select>
      </div>

      <p className={styles.resultCount}>
        Showing {filtered.length} of {complaints.length} complaints
      </p>

      {/* List */}
      <div className={styles.list}>
        {filtered.map((complaint) => {
          const isExpanded = expandedId === complaint.id;

          return (
            <motion.div
              key={complaint.id}
              className={styles.historyItem}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div
                className={styles.itemHeader}
                onClick={() =>
                  setExpandedId(isExpanded ? null : complaint.id)
                }
              >
                <div className={styles.itemLeft}>
                  <p className={styles.itemText}>{complaint.text}</p>
                  <div className={styles.itemMeta}>
                    <span
                      className={`${styles.badge} ${styles.categoryBadge}`}
                    >
                      {complaint.categoryName}
                    </span>
                    <span
                      className={`${styles.badge} ${getStatusClass(
                        complaint.status
                      )}`}
                    >
                      {complaint.status}
                    </span>
                  </div>
                </div>
                <div className={styles.itemRight}>
                  <span className={styles.itemDate}>
                    {timeAgo(complaint.createdAt) && <span style={{ fontWeight: 600, color: '#e17055', marginRight: 6 }}>{timeAgo(complaint.createdAt)}</span>}
                    {formatDate(complaint.createdAt)}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`${styles.expandIcon} ${
                      isExpanded ? styles.expandIconOpen : ''
                    }`}
                  />
                </div>
              </div>

              {isExpanded && (
                <div className={styles.expandedContent} onClick={(e) => e.stopPropagation()}>
                  {editingId === complaint.id ? (
                    <textarea 
                      className={styles.editTextArea}
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      autoFocus
                    />
                  ) : (
                    <p className={styles.expandedText}>{complaint.text}</p>
                  )}
                  
                  <div className={styles.detailGrid}>
                    <div className={styles.detailItem}>
                      <div className={styles.detailLabel}>Category</div>
                      <div className={styles.detailValue}>
                        {complaint.categoryName}
                      </div>
                    </div>
                    <div className={styles.detailItem}>
                      <div className={styles.detailLabel}>Department</div>
                      <div className={styles.detailValue}>
                        {complaint.department || 'N/A'}
                      </div>
                    </div>
                    <div className={styles.detailItem}>
                      <div className={styles.detailLabel}>Priority</div>
                      <div className={styles.detailValue}>
                        {complaint.priority}
                      </div>
                    </div>
                    <div className={styles.detailItem}>
                      <div className={styles.detailLabel}>Confidence</div>
                      <div className={styles.detailValue}>
                        {complaint.confidence
                          ? `${(complaint.confidence * 100).toFixed(1)}%`
                          : 'N/A'}
                      </div>
                    </div>
                    <div className={styles.detailItem}>
                      <div className={styles.detailLabel}>Status</div>
                      <div className={styles.detailValue}>
                        {complaint.status}
                      </div>
                    </div>
                    <div className={styles.detailItem}>
                      <div className={styles.detailLabel}>Language</div>
                      <div className={styles.detailValue}>
                        {complaint.language === 'hi' ? 'Hindi' : 'English'}
                      </div>
                    </div>
                  </div>

                  {/* Location Tag */}
                  {complaint.location?.city && (
                    <div className={styles.locationWrapper}>
                      <div className={styles.locationTag}>
                        <MapPin size={14} />
                        {`${complaint.location.area ? complaint.location.area + ', ' : ''}${complaint.location.city}, ${complaint.location.district}, ${complaint.location.state}`}
                      </div>
                    </div>
                  )}

                  {/* Updates Timeline */}
                  {complaint.updates && complaint.updates.length > 0 && (
                    <div className={styles.updatesSection}>
                      <h4 className={styles.updatesTitle}>Department Updates</h4>
                      <div className={styles.updatesTimeline}>
                        {complaint.updates.map((update, idx) => (
                          <div key={update.id || idx} className={styles.updateItem}>
                            <div className={styles.updateDot} />
                            <div className={styles.updateContent}>
                                <div className={styles.updateHeader}>
                                  <span className={styles.updateDate}>{formatDate(update.createdAt)}</span>
                                  {editingUpdateId === update.id ? (
                                    <div className={styles.statusGroup}>
                                      <button className={`${styles.statusBtn} ${editUpdateStatus === 'pending' ? styles.activePending : ''}`} onClick={(e) => { e.stopPropagation(); setEditUpdateStatus('pending'); }}>Pending</button>
                                      <button className={`${styles.statusBtn} ${editUpdateStatus === 'in-progress' ? styles.activeInProgress : ''}`} onClick={(e) => { e.stopPropagation(); setEditUpdateStatus('in-progress'); }}>In Progress</button>
                                      <button className={`${styles.statusBtn} ${editUpdateStatus === 'resolved' ? styles.activeResolved : ''}`} onClick={(e) => { e.stopPropagation(); setEditUpdateStatus('resolved'); }}>Resolved</button>
                                    </div>
                                  ) : (
                                    <span className={`${styles.badge} ${getStatusClass(update.status)}`}>
                                      {update.status}
                                    </span>
                                  )}
                                </div>
                                
                                {editingUpdateId === update.id ? (
                                  <div className={styles.updateEditWrapper} onClick={(e) => e.stopPropagation()}>
                                    <textarea className={styles.editTextArea} value={editUpdateText} onChange={(e) => setEditUpdateText(e.target.value)} />
                                    <div className={styles.actionButtons}>
                                      <button className={`${styles.actionBtn} ${styles.saveBtn}`} onClick={() => handleSaveUpdate(complaint.id, update.id)}>
                                        <Save size={14} /> Save
                                      </button>
                                      <button className={`${styles.actionBtn} ${styles.cancelBtn}`} onClick={() => setEditingUpdateId(null)}>
                                        <X size={14} /> Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <p className={styles.updateMessage}>
                                    <MessageSquare size={14} /> {update.message}
                                  </p>
                                )}
                                
                                {update.photo && (
                                  <div className={styles.updatePhoto}>
                                    <div className={styles.updatePhotoLabel}><Camera size={14} /> Proof</div>
                                    <img src={update.photo} alt="Resolution proof" />
                                  </div>
                                )}

                                {/* AI Verification Slider (Before/After) */}
                                {update.status === 'resolved' && update.photo && complaint.beforeImage && (
                                  <div style={{ marginTop: '16px' }}>
                                    <BeforeAfterVerifier
                                      beforeImage={complaint.beforeImage}
                                      afterImage={update.photo}
                                      complaintId={complaint.id}
                                      isVerified={complaint.verifiedByCitizen}
                                      isDisputed={complaint.disputedByCitizen}
                                      onVerify={async () => await actions.updateComplaint(complaint.id, { verifiedByCitizen: true })}
                                      onDispute={async () => await actions.updateComplaint(complaint.id, { disputedByCitizen: true })}
                                    />
                                  </div>
                                )}

                                {user?.role === 'department' && editingUpdateId !== update.id && (
                                  <div className={styles.updateActions}>
                                    <button className={styles.miniBtn} onClick={(e) => { e.stopPropagation(); setEditingUpdateId(update.id); setEditUpdateText(update.message); setEditUpdateStatus(update.status || complaint.status); }}>
                                      <Edit3 size={14} />
                                    </button>
                                    <button className={styles.miniBtnDanger} onClick={(e) => { e.stopPropagation(); if (window.confirm('Withdraw this update?')) dispatch({ type: 'DELETE_COMPLAINT_UPDATE', payload: { complaintId: complaint.id, updateId: update.id } }); }}>
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Action Buttons - Only for Citizens */}
                  {user?.role !== 'department' && (
                    <div className={styles.actionButtons}>
                      {editingId === complaint.id ? (
                        <>
                          <button className={`${styles.actionBtn} ${styles.saveBtn}`} onClick={(e) => handleSaveEdit(e, complaint.id)}>
                            <Save size={16} /> Save Changes
                          </button>
                          <button className={`${styles.actionBtn} ${styles.cancelBtn}`} onClick={handleCancelEdit}>
                            <X size={16} /> Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={(e) => handleEdit(e, complaint)}>
                            <Edit3 size={16} /> Edit Complaint
                          </button>
                          <button className={`${styles.actionBtn} ${styles.withdrawBtn}`} onClick={(e) => handleWithdraw(e, complaint.id)}>
                            <Trash2 size={16} /> Withdraw
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}

        {filtered.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <Search size={28} />
            </div>
            <h2 className={styles.emptyTitle}>No Results Found</h2>
            <p className={styles.emptyDesc}>
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
