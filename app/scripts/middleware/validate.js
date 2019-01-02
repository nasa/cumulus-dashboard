import { CALL_API } from '../actions/types';

export const isValidApiRequestAction = (action) => {
  return typeof action === 'object' && action.hasOwnProperty(CALL_API);
};
