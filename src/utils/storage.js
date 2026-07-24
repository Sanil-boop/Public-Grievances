// localStorage helpers for NagarSeva AI

const STORAGE_PREFIX = 'nagarseva';

export function saveData(key, data) {
  try {
    const fullKey = `${STORAGE_PREFIX}-${key}`;
    localStorage.setItem(fullKey, JSON.stringify(data));
    return true;
  } catch (error) {
    console.warn(`Failed to save "${key}" to localStorage:`, error);
    return false;
  }
}

export function loadData(key, defaultValue = null) {
  try {
    const fullKey = `${STORAGE_PREFIX}-${key}`;
    const item = localStorage.getItem(fullKey);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Failed to load "${key}" from localStorage:`, error);
    return defaultValue;
  }
}

export function removeData(key) {
  try {
    const fullKey = `${STORAGE_PREFIX}-${key}`;
    localStorage.removeItem(fullKey);
    return true;
  } catch (error) {
    console.warn(`Failed to remove "${key}" from localStorage:`, error);
    return false;
  }
}

export function clearAll() {
  try {
    Object.keys(localStorage)
      .filter(key => key.startsWith(STORAGE_PREFIX))
      .forEach(key => localStorage.removeItem(key));
    return true;
  } catch (error) {
    console.warn('Failed to clear localStorage:', error);
    return false;
  }
}
