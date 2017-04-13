'use strict';
import global from 'global';
import window from 'global/window';
import document from 'global/document';
export const encode = (str) => window.encodeURI ? window.encodeURI(str) : str;

// add an event listener on document that returns it's cleanup function
export const addGlobalListener = function (type, callback) {
  if (document && typeof document.addEventListener === 'function') {
    document.addEventListener(type, callback);
    return () => document.removeEventListener(type, callback);
  } else return () => true;
};

export { global, window, document };
