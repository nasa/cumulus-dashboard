import { CALL_API } from '../actions/types';

export const isValidApiRequestAction = (action) => typeof action === 'object' && Object.prototype.hasOwnProperty.call(action, CALL_API);

export default isValidApiRequestAction;
