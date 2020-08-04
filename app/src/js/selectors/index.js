import { get } from 'object-path';

// functions all expect the full state as arguments

export const workflowOptions = ({ workflows }) => {
  const options = get(workflows, 'list.data', []).map((workflow) => {
    const { name } = workflow;
    return {
      id: name,
      label: name
    };
  });
  return options;
};

export const workflowOptionNames = ({ workflows }) => get(workflows, 'list.data', []).map((workflow) => workflow.name);
