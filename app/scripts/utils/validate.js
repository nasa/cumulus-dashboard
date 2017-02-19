'use strict';

export const isText = function (name) {
  return typeof name === 'string' && name.length;
};

export const collectionModel = function (c) {
  return isText(c.collectionName);
};
