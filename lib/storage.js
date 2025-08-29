// Simple client-side storage management
export const STORAGE_KEYS = {
  PRODUCTS: 'fertilizer_products',
  SALES: 'fertilizer_sales',
  ADMIN_AUTH: 'admin_authenticated'
};

export const getFromStorage = (key, defaultValue = []) => {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const saveToStorage = (key, data) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Storage error:', error);
  }
};

export const removeFromStorage = (key) => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
};