'use strict';
import assert from 'assert';
import config from '../config';

export const validate = function (model, object) {
  // skip validation in staging, production environment
  if (config.environment === 'development') {
    return model(object);
  }
};

export const collectionModel = function (c) {
  assert.equal(typeof c.collectionName, 'string');
};

export const validateCollection = function () {
  return (object) => validate(collectionModel, object);
};
