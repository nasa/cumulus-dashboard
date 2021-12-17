import { createReducer } from '@reduxjs/toolkit';
import { LOCATION_CHANGE } from 'connected-react-router';

export const initialState = {
  search: {},
  prevLocationPathname: '',
};

export default createReducer(initialState, {
  [LOCATION_CHANGE]: (state, action) => {
    const { prevLocationPathname } = state;
    const newLocationPathname = action.payload.location?.pathname;
    const newLocationQuery = action.payload.location?.search;

    if (newLocationPathname && prevLocationPathname === newLocationPathname) {
      // Capture latest filter for current view
      state.search[newLocationPathname] = newLocationQuery;
    } else {
      // Navigating to a new view
      state.prevLocationPathname = newLocationPathname;
    }
  },
});
