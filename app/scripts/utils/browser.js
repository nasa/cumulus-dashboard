'use strict';
const isNode = typeof window === 'undefined';
export const encode = (str) => isNode ? str : window.encodeURI(str);
