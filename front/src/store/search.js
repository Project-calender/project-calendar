import { createSlice } from '@reduxjs/toolkit';

let searchData = createSlice({
  name: 'searchData',
  initialState: { data: ``, searchText: `` },
  reducers: {
    addSearchData(state, action) {
      state.data = action.payload;
    },
    onSearchValue(state, action) {
      state.searchText = action.payload;
    },
  },
});
export let { addSearchData, onSearchValue } = searchData.actions;
export default searchData.reducer;
