import { get } from 'object-path';

// functions all expect the full state as arguments

export const workflowOptions = ({ workflows }) => {
  const options = {};
  get(workflows, 'list.data', []).forEach((workflow) => {
    options[workflow.name] = workflow.name;
  });
  return options;
};

export const workflowOptionNames = ({ workflows }) => get(workflows, 'list.data', []).map((workflow) => workflow.name);
