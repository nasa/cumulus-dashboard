import { CALL_API } from '../actions';

export const isValidApiRequestAction = (action) => {
  return typeof action === 'object' && action.hasOwnProperty(CALL_API);
};
