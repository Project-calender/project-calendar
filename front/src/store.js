import { configureStore, createSlice } from '@reduxjs/toolkit'


//테스트 코드
let test = createSlice({
  name: 'test',
  initialState: []
})

export default configureStore({
  reducer: { 
    test : test.reducer
  }
}) 
