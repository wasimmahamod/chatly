import { createSlice } from '@reduxjs/toolkit'

export const chatSlice = createSlice({
  name: 'counter',
  initialState: {
    chatInfo: localStorage.getItem('chatInfo')?JSON.parse(localStorage.getItem('chatInfo')):"Md Wasim",
  },
  reducers: {
    activeChatInfo: (state,action) => {
      state.chatInfo=action.payload
    },
  },
})

export const { activeChatInfo } = chatSlice.actions

export default chatSlice.reducer