import test from 'ava';
import nock from 'nock';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  applyRecoveryWorkflowToCollection,
  applyRecoveryWorkflowToGranule
} from '../../app/src/js/actions';
import {
  constructCollectionId
} from '../../app/src/js/utils/format';
import { requestMiddleware } from '../../app/src/js/middleware/request';

const middlewares = [
  requestMiddleware,
  thunk
];
const mockStore = configureMockStore(middlewares);
const store = mockStore({
  granules: {
    list: {
      data: [],
      meta: {},
      params: {}
    },
    recovered: {},
    executed: {},
    meta: {}
  },
  datepicker: {
    startDateTime: null,
    endDateTime: null,
  }
});
const getActionType = (action) => action.type;
const name = 'fakeCollection';
const version = '000';
const collectionId = constructCollectionId(name, version);
const granuleId = 'fakeId';

test.beforeEach((t) => {
  t.context.defaultConfig = {};
  store.clearActions();
});

test.serial('appylyRecoveryWorkflowToCollection fails to acquire collection, dispatches COLLECTION_APPLYWORKFLOW_ERROR', async (t) => {
  nock('https://example.com')
    .get(`/collections?name=${name}&version=${version}&includeStats=true`)
    .reply(404);

  return store.dispatch(applyRecoveryWorkflowToCollection(collectionId)).then(() => {
    const dispatchedActions = store.getActions();
    const dispatchedActionTypes = dispatchedActions.map(getActionType);
    const expectedActionTypes = [
      'COLLECTION_INFLIGHT',
      'COLLECTION_ERROR',
      'COLLECTION_APPLYWORKFLOW_ERROR'
    ];
    t.deepEqual(expectedActionTypes, dispatchedActionTypes);
  });
});

test.serial('applyRecoveryWorkflowToCollection dispatches error with collection collectionRecoveryWorkflow configured because applyWorkflow request fails', async (t) => {
  const getCollectionResponse = {
    results: [
      {
        meta: {}
      }
    ]
  };

  nock('https://example.com')
    .get(`/collections?name=${name}&version=${version}&includeStats=true`)
    .reply(200, getCollectionResponse);

  return store.dispatch(applyRecoveryWorkflowToCollection(collectionId)).then(() => {
    const dispatchedActions = store.getActions();
    const dispatchedActionTypes = dispatchedActions.map(getActionType);
    const expectedActionTypes = [
      'COLLECTION_INFLIGHT',
      'COLLECTION',
      'COLLECTION_APPLYWORKFLOW_ERROR'
    ];
    t.deepEqual(expectedActionTypes, dispatchedActionTypes);
  });
});

test.serial('applyRecoveryWorkflowToCollection successfully sends applyWorkflow action', async (t) => {
  const getCollectionResponse = {
    results: [
      {
        meta: {
          collectionRecoveryWorkflow: 'someWorkflow'
        }
      }
    ]
  };

  nock('https://example.com')
    .get(`/collections?name=${name}&version=${version}&includeStats=true`)
    .reply(200, getCollectionResponse)
    .put(`/collections/${name}/${version}`)
    .reply(200);

  return store.dispatch(applyRecoveryWorkflowToCollection(collectionId)).then(() => {
    const dispatchedActions = store.getActions();
    const dispatchedActionTypes = dispatchedActions.map(getActionType);
    const expectedActionTypes = [
      'COLLECTION_INFLIGHT',
      'COLLECTION',
      'COLLECTION_APPLYWORKFLOW_INFLIGHT',
      'COLLECTION_APPLYWORKFLOW'
    ];
    t.deepEqual(expectedActionTypes, dispatchedActionTypes);
  });
});

test.serial('applyRecoveryWorkflowToGranule fails to acquire granule, dispatches GRANULE_APPLYWORKFLOW_ERROR', async (t) => {
  nock('https://example.com')
    .get(`/granules/${granuleId}`)
    .reply(404);

  return store.dispatch(applyRecoveryWorkflowToGranule(granuleId)).then(() => {
    const dispatchedActions = store.getActions();
    const dispatchedActionTypes = dispatchedActions.map(getActionType);
    const expectedActionTypes = [
      'GRANULE_INFLIGHT',
      'GRANULE_ERROR',
      'GRANULE_APPLYWORKFLOW_ERROR'
    ];
    t.deepEqual(expectedActionTypes, dispatchedActionTypes);
  });
});

test.serial('applyRecoveryWorkflowToGranule dispatches GRANULE_APPLYWORKFLOW_ERROR when related collection does not have recoveryWorkflow configured', async (t) => {
  const getGranuleResponse = {
    collectionId
  };
  const getCollectionResponse = {
    results: [
      {
        meta: {}
      }
    ]
  };

  nock('https://example.com')
    .get(`/granules/${granuleId}`)
    .reply(200, getGranuleResponse);
  nock('https://example.com')
    .get(`/collections?name=${name}&version=${version}&includeStats=true`)
    .reply(200, getCollectionResponse);

  return store.dispatch(applyRecoveryWorkflowToGranule(granuleId)).then(() => {
    const dispatchedActions = store.getActions();
    const dispatchedActionTypes = dispatchedActions.map(getActionType);
    const expectedActionTypes = [
      'GRANULE_INFLIGHT',
      'GRANULE',
      'COLLECTION_INFLIGHT',
      'COLLECTION',
      'GRANULE_APPLYWORKFLOW_ERROR'
    ];
    t.deepEqual(expectedActionTypes, dispatchedActionTypes);
  });
});

test.serial('applyRecoveryWorkflowToGranule fails to acquire collection and dispatches GRANULE_APPLYWORKFLOW_ERROR', async (t) => {
  const getGranuleResponse = {
    collectionId
  };

  nock('https://example.com')
    .get(`/granules/${granuleId}`)
    .reply(200, getGranuleResponse);
  nock('https://example.com')
    .get(`/collections?name=${name}&version=${version}&includeStats=true`)
    .reply(404);

  return store.dispatch(applyRecoveryWorkflowToGranule(granuleId)).then(() => {
    const dispatchedActions = store.getActions();
    const dispatchedActionTypes = dispatchedActions.map(getActionType);
    const expectedActionTypes = [
      'GRANULE_INFLIGHT',
      'GRANULE',
      'COLLECTION_INFLIGHT',
      'COLLECTION_ERROR',
      'GRANULE_APPLYWORKFLOW_ERROR'
    ];
    t.deepEqual(expectedActionTypes, dispatchedActionTypes);
  });
});

test.serial('applyRecoveryWorkflowToGranule dispatches applyWorkflow', async (t) => {
  const getGranuleResponse = {
    collectionId
  };
  const getCollectionResponse = {
    results: [
      {
        meta: {
          granuleRecoveryWorkflow: 'what'
        }
      }
    ]
  };

  nock('https://example.com')
    .get(`/collections?name=${name}&version=${version}&includeStats=true`)
    .reply(200, getCollectionResponse);
  nock('https://example.com')
    .get(`/granules/${granuleId}`)
    .reply(200, getGranuleResponse)
    .put(`/granules/${granuleId}`)
    .reply(200);

  return store.dispatch(applyRecoveryWorkflowToGranule(granuleId)).then(() => {
    const dispatchedActions = store.getActions();
    const dispatchedActionTypes = dispatchedActions.map(getActionType);
    const expectedActionTypes = [
      'GRANULE_INFLIGHT',
      'GRANULE',
      'COLLECTION_INFLIGHT',
      'COLLECTION',
      'GRANULE_APPLYWORKFLOW_INFLIGHT',
      'GRANULE_APPLYWORKFLOW'
    ];
    t.deepEqual(expectedActionTypes, dispatchedActionTypes);
  });
});
