import { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import {
  apiGetComplaints, apiCreateComplaint, apiUpdateComplaint,
  apiDeleteComplaint, apiAddComplaintUpdate,
} from '../utils/api';

const AppContext = createContext(null);

const STORAGE_KEY = 'nagarseva-complaints';

const mockComplaint = {
  id: `CMP-123456-mock1`,
  text: "There is a massive pothole in front of the community center. Needs urgent fixing.",
  category: "roads",
  categoryName: "Roads & Potholes",
  confidence: 0.95,
  department: "Public Works Dept. (Roads)",
  priority: "High",
  predictions: [],
  status: "resolved",
  timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
  language: "en-IN",
  icon: "🚧",
  location: {
    state: "Maharashtra",
    district: "Mumbai",
    city: "Mumbai",
    area: "Bandra West",
  },
  beforeImage: "/assets/pothole_before.jpg",
  afterImage: "/assets/pothole_after.jpg",
  updates: [],
};

// localStorage fallbacks
function loadFromStorage() {
  let existing = [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      existing = JSON.parse(data);
    }
  } catch (e) {
    console.warn('Failed to load from localStorage:', e);
  }

  if (!existing.find(c => c.id === mockComplaint.id)) {
    existing.push(mockComplaint);
  }
  return existing;
}

function saveToStorage(complaints) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
}

function computeStats(complaints) {
  return {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    inProgress: complaints.filter(c => c.status === 'in-progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
  };
}

const MOCK_EMERGENCY_ALERTS = [
  {
    id: 'alert-1',
    title: 'Water Pipeline Burst',
    message: 'Major water pipeline burst reported in Sector 4. Water supply disrupted for the next 4-6 hours. Tankers have been dispatched.',
    severity: 'critical',
    area: 'Sector 4, Bandra West',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'alert-2',
    title: 'Scheduled Power Maintenance',
    message: 'Planned power outage in Zone 3 from 2 PM to 6 PM for transformer upgrade. Please plan accordingly.',
    severity: 'warning',
    area: 'Zone 3, Andheri East',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'alert-3',
    title: 'New Recycling Program',
    message: 'Dry waste recycling centers are now open in 12 new locations. Check the municipal website for nearest center.',
    severity: 'info',
    area: 'City-wide',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
];

const initialState = {
  complaints: [],
  stats: { total: 0, pending: 0, inProgress: 0, resolved: 0 },
  classifierReady: false,
  language: 'en-IN',
  emergencyAlerts: MOCK_EMERGENCY_ALERTS,
  backendOnline: true,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'LOAD_COMPLAINTS': {
      const complaints = action.payload || [];
      saveToStorage(complaints); // Also save to localStorage as backup
      return {
        ...state,
        complaints,
        stats: computeStats(complaints),
      };
    }

    case 'ADD_COMPLAINT': {
      const newComplaint = action.payload;
      const updatedComplaints = [newComplaint, ...state.complaints];
      saveToStorage(updatedComplaints);
      return {
        ...state,
        complaints: updatedComplaints,
        stats: computeStats(updatedComplaints),
      };
    }

    case 'UPDATE_STATUS': {
      const updatedComplaints = state.complaints.map(c =>
        c.id === action.payload.id
          ? { ...c, status: action.payload.status }
          : c
      );
      saveToStorage(updatedComplaints);
      return {
        ...state,
        complaints: updatedComplaints,
        stats: computeStats(updatedComplaints),
      };
    }

    case 'ADD_COMPLAINT_UPDATE': {
      const updatedComplaints = state.complaints.map(c => {
        if (c.id === action.payload.id) {
          return {
            ...c,
            status: action.payload.status || c.status,
            updates: [
              ...(c.updates || []),
              {
                id: `UPD-${Date.now()}`,
                timestamp: new Date().toISOString(),
                message: action.payload.message,
                photo: action.payload.photo,
                status: action.payload.status || c.status,
              }
            ]
          };
        }
        return c;
      });

      saveToStorage(updatedComplaints);
      return {
        ...state,
        complaints: updatedComplaints,
        stats: computeStats(updatedComplaints),
      };
    }

    case 'EDIT_COMPLAINT_UPDATE': {
      const { complaintId, updateId, message, status } = action.payload;
      const updatedComplaints = state.complaints.map(c => {
        if (c.id === complaintId) {
          const newUpdates = c.updates.map(u =>
            u.id === updateId ? { ...u, message, status } : u
          );
          return { ...c, updates: newUpdates, status: status || c.status };
        }
        return c;
      });
      saveToStorage(updatedComplaints);
      return {
        ...state,
        complaints: updatedComplaints,
        stats: computeStats(updatedComplaints),
      };
    }

    case 'DELETE_COMPLAINT_UPDATE': {
      const { complaintId, updateId } = action.payload;
      const updatedComplaints = state.complaints.map(c => {
        if (c.id === complaintId) {
          const newUpdates = c.updates.filter(u => u.id !== updateId);
          const latestUpdate = newUpdates[newUpdates.length - 1];
          const newStatus = latestUpdate ? latestUpdate.status : 'pending';
          return { ...c, updates: newUpdates, status: newStatus };
        }
        return c;
      });
      saveToStorage(updatedComplaints);
      return {
        ...state,
        complaints: updatedComplaints,
        stats: computeStats(updatedComplaints),
      };
    }

    case 'EDIT_COMPLAINT': {
      const updatedComplaints = state.complaints.map(c =>
        c.id === action.payload.id
          ? { ...c, ...action.payload.updates }
          : c
      );
      saveToStorage(updatedComplaints);
      return {
        ...state,
        complaints: updatedComplaints,
        stats: computeStats(updatedComplaints),
      };
    }

    case 'DELETE_COMPLAINT': {
      const filteredComplaints = state.complaints.filter(
        c => c.id !== action.payload
      );
      saveToStorage(filteredComplaints);
      return {
        ...state,
        complaints: filteredComplaints,
        stats: computeStats(filteredComplaints),
      };
    }

    case 'SET_CLASSIFIER_READY': {
      return { ...state, classifierReady: action.payload };
    }

    case 'SET_LANGUAGE': {
      return { ...state, language: action.payload };
    }

    case 'VERIFY_RESOLUTION': {
      const updatedComplaints = state.complaints.map(c =>
        c.id === action.payload ? { ...c, verifiedByCitizen: true, disputedByCitizen: false } : c
      );
      saveToStorage(updatedComplaints);
      return { ...state, complaints: updatedComplaints, stats: computeStats(updatedComplaints) };
    }

    case 'DISPUTE_RESOLUTION': {
      const updatedComplaints = state.complaints.map(c =>
        c.id === action.payload ? { ...c, disputedByCitizen: true, verifiedByCitizen: false, status: 'in-progress' } : c
      );
      saveToStorage(updatedComplaints);
      return { ...state, complaints: updatedComplaints, stats: computeStats(updatedComplaints) };
    }

    case 'DISMISS_ALERT': {
      return {
        ...state,
        emergencyAlerts: state.emergencyAlerts.filter(a => a.id !== action.payload),
      };
    }

    case 'SET_BACKEND_STATUS': {
      return { ...state, backendOnline: action.payload };
    }

    default:
      return state;
  }
}

// Async action creators — these try the API first, fall back to local
export function createAsyncActions(dispatch) {
  return {
    loadComplaints: async () => {
      try {
        const data = await apiGetComplaints();
        dispatch({ type: 'LOAD_COMPLAINTS', payload: data.complaints });
        dispatch({ type: 'SET_BACKEND_STATUS', payload: true });
      } catch (err) {
        if (err.message === 'BACKEND_OFFLINE') {
          dispatch({ type: 'SET_BACKEND_STATUS', payload: false });
        }
        // Fallback to localStorage
        const stored = loadFromStorage();
        dispatch({ type: 'LOAD_COMPLAINTS', payload: stored });
      }
    },

    addComplaint: async (complaintData) => {
      try {
        const data = await apiCreateComplaint(complaintData);
        const complaint = data.complaint;
        dispatch({ type: 'ADD_COMPLAINT', payload: complaint });
        dispatch({ type: 'SET_BACKEND_STATUS', payload: true });
        return complaint;
      } catch (err) {
        if (err.message === 'BACKEND_OFFLINE') {
          dispatch({ type: 'SET_BACKEND_STATUS', payload: false });
        }
        // Fallback: create locally
        const localComplaint = {
          id: `CMP-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          ...complaintData,
          status: 'pending',
          timestamp: new Date().toISOString(),
          updates: [],
        };
        dispatch({ type: 'ADD_COMPLAINT', payload: localComplaint });
        return localComplaint;
      }
    },

    updateComplaintStatus: async (id, status) => {
      dispatch({ type: 'UPDATE_STATUS', payload: { id, status } });
      try {
        await apiUpdateComplaint(id, { status });
      } catch {
        console.warn('Status update sync to backend failed, saved locally.');
      }
    },

    deleteComplaint: async (id) => {
      dispatch({ type: 'DELETE_COMPLAINT', payload: id });
      try {
        await apiDeleteComplaint(id);
      } catch {
        console.warn('Delete sync to backend failed, removed locally.');
      }
    },

    addComplaintUpdate: async (id, updateData) => {
      dispatch({ type: 'ADD_COMPLAINT_UPDATE', payload: { id, ...updateData } });
      try {
        await apiAddComplaintUpdate(id, updateData);
      } catch {
        console.warn('Complaint update sync to backend failed, saved locally.');
      }
    },
  };
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  // Create actions once per dispatch
  const actions = useMemo(() => createAsyncActions(dispatch), [dispatch]);

  // Load complaints on mount — try API first, then localStorage
  useEffect(() => {
    actions.loadComplaints();
  }, [actions]);

  return (
    <AppContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppContext;
