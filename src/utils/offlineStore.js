/**
 * BRAHMA Offline State & Memory IndexedDB Cache
 * Provides 100% offline persistence for chat sessions, document embeddings, and tasks.
 */
const DB_NAME = 'brahma_offline_db';
const DB_VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('chats')) {
        db.createObjectStore('chats', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('offline_queue')) {
        db.createObjectStore('offline_queue', { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveOfflineSession(id, data) {
  try {
    const db = await openDB();
    const tx = db.transaction('chats', 'readwrite');
    tx.objectStore('chats').put({ id, data, updatedAt: Date.now() });
    return true;
  } catch (err) {
    console.warn('[OfflineStore] Failed to save chat:', err.message);
    return false;
  }
}

export async function getOfflineSession(id) {
  try {
    const db = await openDB();
    const tx = db.transaction('chats', 'readonly');
    const req = tx.objectStore('chats').get(id);
    return new Promise((resolve) => {
      req.onsuccess = () => resolve(req.result ? req.result.data : null);
      req.onerror = () => resolve(null);
    });
  } catch (_) {
    return null;
  }
}
