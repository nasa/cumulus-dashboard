'use strict';
export const preventDefault = (e) => {
  if (e && typeof e.preventDefault === 'function') { e.preventDefault(); }
  return false;
};
