'use strict';

/**
 * Returns the value of the `id` property of the specified object.
 *
 * @param {object} - object to extract the `id` property from
 * @returns {*} value of the `id` property of the specified object
 */
const idProp = ({ id }) => id;

/**
 * Returns a reducer function that delete's a nested object from the value
 * of the specified state property, where the key of the nested object is
 * obtained by applying the specified ID selector function to the action.
 *
 * @example
 * createReducer(initialState, {
 *   [MY_OBJECT_CLEAR]: createClearItemReducer('map'),
 *   // The line above is equivalent to the following
 *   [MY_OBJECT_CLEAR]: (state, action) => {
 *     delete state.map[action.id];
 *   },
 *   ...
 * }
 *
 * @param {string} stateProp - state property that contains nested objects
 * @param {function} [idSelector] - function to apply to the action object to
 *    obtain an ID value for selecting a nested object from the value of the
 *    specified state property (defaults to selecting the `id` property of the
 *    action)
 * @returns {function} reducer function that takes a state and an action and
 *    mutates the state by deleting the nested object of the specified state
 *    property where the key (property name) of the nested object is obtained
 *    by applying the ID selector function to the action
 */
export const createClearItemReducer = (stateProp, idSelector = idProp) => {
  return (state, action) => {
    const id = idSelector(action);
    delete state[stateProp][id];
  };
};

/**
 * Returns a reducer function that sets the status property of a nested state
 * object to `'inflight'`.  The "top level" state object is associated with the
 * specified state property, and the key of the nested object within the top
 * level object is obtained by applying the specified ID selector function to
 * the action object (which defaults to getting the value of the action's `id`
 * property).
 *
 * @example
 * createReducer(initialState, {
 *   [NEW_PROVIDER_INFLIGHT]: createInflightReducer('created'),
 *   [NEW_PROVIDER_INFLIGHT]: (state, action) => {
 *     state.created[action.id] = { status: 'inflight' };
 *   },
 *   ...
 * }
 *
 * @param {string} stateProp - state property that contains nested objects
 * @param {function} [idSelector] - function to apply to the action object to
 *    obtain an ID value for selecting a nested object from the value of the
 *    specified state property (defaults to selecting the `id` property of the
 *    action)
 * @returns {function} reducer function that takes a state and an action and
 *    mutates the state by setting the `status` of the nested object to
 *    `'inflight'`
 */
export const createInflightReducer = (stateProp, idSelector = idProp) => {
  return (state, action) => {
    const id = idSelector(action);
    state[stateProp][id] = { status: 'inflight' };
  };
};

/**
 * Returns a reducer function that sets the `status` property of a nested state
 * object to `'success'`, and also sets the `data` property to data found in
 * the action, if any.  The "top level" state object is associated with the
 * specified state property, and the key of the nested object within the top
 * level object is obtained by applying the specified ID selector function to
 * the action object (which defaults to getting the value of the action's `id`
 * property).
 *
 * @example
 * createReducer(initialState, {
 *   [NEW_PROVIDER]: createSuccessReducer('created'),
 *   // The line above is equivalent to the following
 *   [NEW_PROVIDER]: (state, action) => {
 *     state.created[action.id] = {
 *       status: 'success',
 *       data: action.data
 *     };
 *   },
 *   ...
 * }
 *
 * @param {string} stateProp - state property that contains nested objects
 * @param {function} [idSelector] - function to apply to the action object to
 *    obtain an ID value for selecting a nested object from the value of the
 *    specified state property (defaults to selecting the `id` property of the
 *    action)
 * @returns {function} reducer function that takes a state and an action and
 *    mutates the state by setting the `status` of the nested object to
 *    `'success'`, and the `data` property to the value of the action's `data`
 *    property, if it has one
 */
export const createSuccessReducer = (stateProp, idSelector = idProp) => {
  return (state, action) => {
    const id = idSelector(action);
    state[stateProp][id] = {
      status: 'success',
      data: action.data,
    };
  };
};

/**
 * Returns a reducer function that sets the `status` property of a nested state
 * object to `'error'`, and also sets the `error` property to error found in
 * the action, if any.  The "top level" state object is associated with the
 * specified state property, and the key of the nested object within the top
 * level object is obtained by applying the specified ID selector function to
 * the action object (which defaults to getting the value of the action's `id`
 * property).
 *
 * @example
 * createReducer(initialState, {
 *   [NEW_PROVIDER_ERROR]: createErrorReducer('created'),
 *   // The line above is equivalent to the following
 *   [NEW_PROVIDER_ERROR]: (state, action) => {
 *     state.created[action.id] = {
 *       status: 'error',
 *       error: action.error
 *     };
 *   },
 *   ...
 * }
 *
 * @param {string} stateProp - state property that contains nested objects
 * @param {function} [idSelector] - function to apply to the action object to
 *    obtain an ID value for selecting a nested object from the value of the
 *    specified state property (defaults to selecting the `id` property of the
 *    action)
 * @returns {function} reducer function that takes a state and an action and
 *    mutates the state by setting the `status` of the nested object to
 *    `'error'`, and the `error` property to the value of the action's `error`
 *    property, if it has one
 */
export const createErrorReducer = (stateProp, idSelector = idProp) => {
  return (state, action) => {
    const id = idSelector(action);
    state[stateProp][id] = {
      status: 'error',
      error: action.error,
    };
  };
};

/**
 * Returns a reducer function that calls all of the specified reducers in order.
 *
 * @example
 * createReducer(initialState, {
 *   [ACTION_NAME]: createSerialReducer(
 *     createSuccessReducer('enabled'),
 *     createClearItemReducer('disabled')
 *   ),
 *   ...
 * }
 *
 * @param  {...any} reducers - list of reducer functions to be invoked in order
 *    with the state and action
 */
export const createSerialReducer = (...reducers) => {
  return (state, action) =>
    reducers.forEach((reducer) => reducer(state, action));
};
