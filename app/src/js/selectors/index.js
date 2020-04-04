'use strict';
import { get } from 'object-path';

// functions all expect the full state as arguments

export const workflowOptions = ({ workflows }) => {
  const options = { '': '' };
  get(workflows, 'list.data', []).forEach(d => {
    options[d.name] = d.name;
  });
  return options;
};

export const workflowOptionNames = ({ workflows }) => {
  return get(workflows, 'list.data', []).map(workflow => workflow.name);
};

export const collectionOptions = ({ collections }) => {
  const options = { '': '' };
  get(collections, 'list.data', []).forEach(d => {
    options[d.name] = d.name;
  });
  return options;
};
