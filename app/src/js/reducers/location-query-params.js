import { createReducer } from '@reduxjs/toolkit';
import { LOCATION_CHANGE } from 'connected-react-router';

export const initialState = {
  search: {},
};

export default createReducer(initialState, {
  [LOCATION_CHANGE]: (state, action) => {
    const newLocationPathname = action.payload.location?.pathname;
    const newLocationQuery = action.payload.location?.search;

    if (newLocationPathname) {
      // Capture latest filter for current view
      state.search[newLocationPathname] = newLocationQuery;
    }
  },
});
