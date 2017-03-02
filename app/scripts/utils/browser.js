'use strict';
import global from 'global';
import window from 'global/window';
import document from 'global/document';
export const encode = (str) => window.encodeURI ? window.encodeURI(str) : str;
export { global, window, document };
