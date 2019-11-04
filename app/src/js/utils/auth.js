'use strict';
import { window } from './browser';
export const set = function (token) {
  if (window.localStorage && typeof window.localStorage.setItem === 'function') {
    window.localStorage.setItem('auth-token', token);
  }
};
export const get = function () {
  let auth = null;
  if (window.localStorage && typeof window.localStorage.getItem === 'function') {
    auth = window.localStorage.getItem('auth-token') || null;
  }
  return auth;
};
