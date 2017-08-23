'use strict';
const workflowRoutes = [
  ['Overview', null]
];

const singleWorkflowRoutes = [
  ['Back to Workflows', null, 'sidebar__nav--back']
];

const empty = [['', '']];

const workflows = {
  base: 'workflows',
  heading: 'Workflows',
  routes: (currentRoute, params) => {
    if (currentRoute.indexOf('workflows/workflow') >= 0) {
      return singleWorkflowRoutes;
    } else if (currentRoute.slice(0, 11) !== '/workflows') {
      return empty;
    } else {
      return workflowRoutes;
    }
  }
};

export default workflows;
