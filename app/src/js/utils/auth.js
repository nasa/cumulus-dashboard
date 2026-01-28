import { decode as jwtDecode } from 'jsonwebtoken';
import { window } from './browser';
import _config from '../config';

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

/**
 * Gets the session start time from the JWT token's iat (issued at) claim
 * @param {string} token - JWT token
 * @returns {number|null} - Session start timestamp in milliseconds, or null if not available
 */
export const getSessionStart = (token) => {
  // Allow mocking for testing
  if (_config.mockSessionStart) {
    return parseInt(_config.mockSessionStart, 10);
  }

  if (!token) {
    return null;
  }

  try {
    const decoded = jwtDecode(token);

    // iat is in seconds, convert to milliseconds
    return decoded.iat ? decoded.iat * 1000 : null;
  } catch (error) {
    return null;
  }
};
