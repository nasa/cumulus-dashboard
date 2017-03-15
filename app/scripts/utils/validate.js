'use strict';

export const isText = function (string) {
  return typeof string === 'string' && string.length;
};

export const isNumber = function (string) {
  return !isNaN(string);
};

export const granuleModel = function (obj) {
  return isText(obj.granuleId);
};

export const collectionModel = function (obj) {
  return isText(obj.collectionName) &&
    granuleModel(obj.granuleDefinition);
};

export const isUndefined = function (test) {
  return typeof test === 'undefined';
};
