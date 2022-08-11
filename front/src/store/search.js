import { createSlice } from '@reduxjs/toolkit';

let searchData = createSlice({
  name: 'searchData',
  initialState: { data: `` },
  reducers: {
    addSearchData(state, action) {
      state.data = action.payload;
    },
  },
});
export let { addSearchData } = searchData.actions;
export default searchData.reducer;
