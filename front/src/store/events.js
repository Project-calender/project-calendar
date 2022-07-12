import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { fetchEvents } from './thunk';

const eventsAdapter = createEntityAdapter({
  sortComparer: (a, b) => a.id - b.id,
});
const initialState = eventsAdapter.getInitialState();

const events = createSlice({
  name: 'events',
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchEvents.fulfilled, (state, { payload }) =>
      eventsAdapter.setAll(state, payload.events),
    );
  },
});

export const { action } = events.actions;
export default events.reducer;
