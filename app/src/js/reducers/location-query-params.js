import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  search: {},
};

const locationQueryParamsSlice = createSlice({
  name: 'locationQueryParams',
  initialState,
  reducers: {
    updateSearchForPath: (state, action) => {
      const { pathname, search } = action.payload;
      if (pathname) {
        state.search[pathname] = search;
      }
    },
  },
});

export const { updateSearchForPath } = locationQueryParamsSlice.actions;

export default locationQueryParamsSlice.reducer;
