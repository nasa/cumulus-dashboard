import { CALL_API } from '../actions/types.js';

export const isValidApiRequestAction = (action) => typeof action === 'object' && Object.prototype.hasOwnProperty.call(action, CALL_API);

export default isValidApiRequestAction;
