'use strict';
import { get } from 'object-path';
import { getCollectionId } from '../utils/format';

// functions all expect the full state as arguments

export const workflowOptions = ({ workflows }) => {
  const options = {};
  get(workflows, 'list.data', []).forEach(workflow => {
    options[workflow.name] = workflow.name;
  });
  return options;
};

export const workflowOptionNames = ({ workflows }) => {
  return get(workflows, 'list.data', []).map(workflow => workflow.name);
};

export const collectionOptions = ({ collections }) => {
  const options = {};
  get(collections, 'list.data', []).forEach(collection => {
    const collectionId = getCollectionId(collection);
    options[collectionId] = collectionId;
  });
  return options;
};
