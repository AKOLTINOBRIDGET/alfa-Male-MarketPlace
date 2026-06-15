export const getStoredAuth = () => localStorage.getItem('alfa_auth') === 'true';

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('alfa_user') || 'null');
  } catch {
    localStorage.removeItem('alfa_user');
    return null;
  }
};

export const getCurrentUserSnapshot = (user) => user || getStoredUser();

export const hasRole = (user, role) => (
  (user?.role || '').toLowerCase() === role.toLowerCase()
);
