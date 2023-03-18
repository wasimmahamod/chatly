import { configureStore } from '@reduxjs/toolkit'
import chatSlice from './slices/chatSlice'
import userSlice from './slices/userSlice'

export default configureStore({
  reducer: {
    userLoginInfo:userSlice,
    activeChatInfo:chatSlice,
  },
})