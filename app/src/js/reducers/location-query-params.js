import { createReducer } from '@reduxjs/toolkit';
import { LOCATION_CHANGE } from 'connected-react-router';
import { RESTORE_QUERY_PARAMS } from '../actions/types';

export const initialState = {
  queryParams: {},
  prevLocationPathname: '',
  restoreQuery: false,
};

export default createReducer(initialState, {
  [LOCATION_CHANGE]: (state, action) => {
    const { prevLocationPathname, restoreQuery } = state;
    const newLocationPathname = action.payload.location?.pathname;
    const newLocationQuery = action.payload.location?.search;

    // Do not allow a @@router/LOCATION_CHANGE to overwrite the value that should be restored
    if (restoreQuery) return;

    if (newLocationPathname && prevLocationPathname === newLocationPathname) {
      // Capture latest filter for current view
      if (!state.queryParams[newLocationPathname]) {
        state.queryParams[newLocationPathname] = {};
      }

      const searchParams = new URLSearchParams(newLocationQuery);
      searchParams.forEach((value, key) => {
        state.queryParams[newLocationPathname][key] = value;
      });
    } else {
      // Navigating to a new view
      state.prevLocationPathname = newLocationPathname;

      if (state.queryParams[newLocationPathname]) {
        state.restoreQuery = true;
      }
    }
  },
  [RESTORE_QUERY_PARAMS]: (state, action) => {
    state.restoreQuery = false;
  },
});
