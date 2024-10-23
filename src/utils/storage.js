export const setItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getItem = key => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};

export const removeItem = key => {
  localStorage.removeItem(key);
};

export const clearStorage = () => {
  localStorage.clear();
};

export const getUserRole = () =>
  window.location.pathname.includes('/admin') ? 'admin' : 'user';
