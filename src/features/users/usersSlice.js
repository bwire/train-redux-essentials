import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
} from '@reduxjs/toolkit'
import { client } from '../../api/client'
import { apiSlice } from '../api/apiSlice'

// const usersAdapter = createEntityAdapter()
const emptyUsers = []
const selectUsersResult = apiSlice.endpoints.getUsers.select()

export const selectAllUsers = createSelector(
  selectUsersResult,
  (usersResult) => usersResult?.data ?? emptyUsers
)

export const selectUserById = createSelector(
  selectAllUsers,
  (_, userId) => userId,
  (users, userId) => users.find((u) => u.id === userId)
)

export const fetchUsers = createAsyncThunk('posts/fetchUsers', async () => {
  const response = await client.get('fakeApi/users')
  return response.data
})

// const userSlice = createSlice({
//   name: 'users',
//   initialState: usersAdapter.getInitialState(),
//   reducers: {},
//   extraReducers: (builder) =>
//     builder.addCase(fetchUsers.fulfilled, usersAdapter.setAll),
// })

// export const { selectAll: selectAllUsers, selectById: selectUserById } =
//   usersAdapter.getSelectors(({ users }) => users)

//export default userSlice.reducer
