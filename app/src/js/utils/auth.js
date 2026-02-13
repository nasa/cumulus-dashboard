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
 * @returns {number|null} - Session start timestamp in seconds since Unix epoch, or null if not available
 */
export const getSessionStart = (token) => {
  // Allow mocking for testing
  if (_config.mockSessionStartSeconds) {
    return parseInt(_config.mockSessionStartSeconds, 10);
  }

  if (!token) {
    return null;
  }

  try {
    const decoded = jwtDecode(token);

    // iat is already in seconds
    return decoded.iat ? decoded.iat : null;
  } catch (error) {
    return null;
  }
};
