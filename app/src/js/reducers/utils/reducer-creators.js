'use strict';

/**
 * Returns the value of the `id` property of the specified object.
 *
 * @param {object} - object to extract the `id` property from
 * @returns {*} value of the `id` property of the specified object
 */
const idProp = ({ id }) => id;

/**
 * Mapping from new state status value to the name of the default property to
 * retrieve from the action object that corresponds to the status.  For example,
 * when the status of an operation is `'success'`, the action object typically
 * contains the data retrieved by the operation in the `'data'` property.
 *
 * Therefore, the new state should include a `status` property set to
 * `'success'`, along with a `data` property set to the value of the action's
 * `data` property.  When the action has no `data` property, then the new
 * state will contain only the `status` property.
 */
const actionInfoPropByStatus = {
  error: 'error',
  success: 'data',
};

/**
 * Returns a function that creates a reducer function that sets the status of
 * an object within the state to the specified status, and also sets any
 * associated information, if any.
 *
 * @example <caption>Create a reducer creator</caption>
 * const createInflightReducer = createCreateStatusReducer('inflight');
 * ...
 * createReducer(initialState, {
 *   [NEW_PROVIDER]: createSuccessReducer('created')
 *    // The line above is equivalent to the following
 *   [NEW_PROVIDER]: (draftState, action) {
 *     draftState.created[action.id] = {
 *       status: 'success',
 *       data: action.data
 *     }
 *   }
 * })
 *
 * @param {string} status - new status value to set on the state
 * @returns {function} function that creates a reducer function
 */
const createCreateStatusReducer = (status) => (
  stateProp,
  idSelector = idProp,
  actionInfoProp = actionInfoPropByStatus[status]
) => (draftState, action) => {
  draftState[stateProp][idSelector(action)] =
    actionInfoProp in action
      ? { status, [actionInfoProp]: action[actionInfoProp] }
      : { status };
};

/**
 * Returns a reducer function that delete's a nested object from the value
 * of the specified state property, where the key of the nested object is
 * obtained by applying the specified ID selector function to the action.
 *
 * @example
 * createReducer(initialState, {
 *   [MY_OBJECT_CLEAR]: createClearItemReducer('map'),
 *   // The line above is equivalent to the following
 *   [MY_OBJECT_CLEAR]: (draftState, action) => {
 *     delete draftState.map[action.id];
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
  return (draftState, action) => {
    delete draftState[stateProp][idSelector(action)];
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
 *   [NEW_PROVIDER_INFLIGHT]: (draftState, action) => {
 *     draftState.created[action.id] = { status: 'inflight' };
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
export const createInflightReducer = createCreateStatusReducer('inflight');

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
 *   [NEW_PROVIDER]: (draftState, action) => {
 *     draftState.created[action.id] = {
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
export const createSuccessReducer = createCreateStatusReducer('success');

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
 *   [NEW_PROVIDER_ERROR]: (draftState, action) => {
 *     draftState.created[action.id] = {
 *       status: 'error',
 *       data: action.error
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

export const createErrorReducer = createCreateStatusReducer('error');

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
export const createSerialReducer = (...reducers) => (draftState, action) =>
  reducers.forEach((reducer) => reducer(draftState, action));
