const STORAGE_KEY = 'nagarseva-offline-drafts';

export function getDrafts() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveDraft(draftData) {
  try {
    const drafts = getDrafts();
    const newDraft = {
      id: `draft-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      text: draftData.text || '',
      category: draftData.category || '',
      area: draftData.area || '',
      timestamp: new Date().toISOString(),
      photo: draftData.photo || null,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([newDraft, ...drafts]));
    return newDraft;
  } catch (err) {
    console.error('Failed to save draft:', err);
    return null;
  }
}

export function getDraftCount() {
  return getDrafts().length;
}

export function clearDrafts() {
  localStorage.removeItem(STORAGE_KEY);
}

export function deleteDraft(id) {
  const drafts = getDrafts().filter((d) => d.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
}
