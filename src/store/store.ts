import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './counterSlice'
import outageReducer from './outageSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    outage: outageReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
