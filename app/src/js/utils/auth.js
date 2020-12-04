import { window } from './browser';

export const set = (token) => {
  if (window && window.localStorage && typeof window.localStorage.setItem === 'function') {
    window.localStorage.setItem('auth-token', token);
  }
};
export const get = () => {
  let auth = null;
  if (window && window.localStorage && typeof window.localStorage.getItem === 'function') {
    auth = window.localStorage.getItem('auth-token') || null;
  }
  return auth;
};
