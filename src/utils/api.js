// ============================================
// NagarSeva AI — Frontend API Helper
// Centralized fetch wrapper for backend calls
// ============================================

const API_BASE = 'http://localhost:5000/api';

const TOKEN_KEY = 'nagarseva-token';

// Get stored JWT token
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

// Save JWT token
export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

// Remove JWT token
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// Build headers with optional auth
function buildHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// Generic fetch wrapper
async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: buildHeaders(),
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `API error: ${response.status}`);
    }

    return data;
  } catch (err) {
    // If it's a network error (backend not running), return a fallback
    if (err.message === 'Failed to fetch') {
      console.warn(`⚠️ Backend not reachable at ${url}. Using localStorage fallback.`);
      throw new Error('BACKEND_OFFLINE');
    }
    throw err;
  }
}

// ---- Auth API ----

export async function apiSignup(name, email, phone, password, role) {
  const data = await apiFetch('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, phone, password, role }),
  });
  if (data.token) setToken(data.token);
  return data;
}

export async function apiLogin(email, password, role) {
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, role }),
  });
  if (data.token) setToken(data.token);
  return data;
}

export async function apiGetMe() {
  return apiFetch('/auth/me');
}

export async function apiUpdateProfile(profileData) {
  return apiFetch('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
}

export async function apiAddKarma(points) {
  return apiFetch('/auth/karma', {
    method: 'POST',
    body: JSON.stringify({ points }),
  });
}

// ---- Complaints API ----

export async function apiGetComplaints(filters = {}) {
  const params = new URLSearchParams(filters).toString();
  const endpoint = params ? `/complaints?${params}` : '/complaints';
  return apiFetch(endpoint);
}

export async function apiGetMyComplaints() {
  return apiFetch('/complaints/my');
}

export async function apiGetStats() {
  return apiFetch('/complaints/stats');
}

export async function apiCreateComplaint(complaintData) {
  return apiFetch('/complaints', {
    method: 'POST',
    body: JSON.stringify(complaintData),
  });
}

export async function apiUpdateComplaint(id, updates) {
  return apiFetch(`/complaints/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

export async function apiDeleteComplaint(id) {
  return apiFetch(`/complaints/${id}`, {
    method: 'DELETE',
  });
}

export async function apiAddComplaintUpdate(id, updateData) {
  return apiFetch(`/complaints/${id}/updates`, {
    method: 'POST',
    body: JSON.stringify(updateData),
  });
}

// Health check
export async function apiHealthCheck() {
  try {
    const data = await apiFetch('/health');
    return { online: true, ...data };
  } catch {
    return { online: false };
  }
}
