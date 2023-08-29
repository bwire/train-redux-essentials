import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit'
import { client } from '../../api/client'

const notificationsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
})

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { getState }) => {
    const state = getState()
    const latestTimestamp = state.entities.length ? state.entities[0].date : ''
    const response = await client.get(
      `/fakeApi/notifications?since=${latestTimestamp}`
    )
    return response.data
  }
)

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: notificationsAdapter.getInitialState(),
  reducers: {
    allNotificationRead: (state, action) => {
      Object.values(state.entities).forEach((n) => (n.read = true))
    },
  },
  extraReducers: (builder) =>
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      notificationsAdapter.updateMany(state, action.payload)
      Object.values(state.entities).forEach((n) => (n.isNew = !n.read))
    }),
})

export const { allNotificationRead } = notificationSlice.actions
export const { selectAll: selectAllNotifications } =
  notificationsAdapter.getSelectors(({ notifications }) => notifications)
export default notificationSlice.reducer
