import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit'
import { client } from '../../api/client'

const usersAdapter = createEntityAdapter()

export const fetchUsers = createAsyncThunk('posts/fetchUsers', async () => {
  const response = await client.get('fakeApi/users')
  return response.data
})

const userSlice = createSlice({
  name: 'users',
  initialState: usersAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) =>
    builder.addCase(fetchUsers.fulfilled, usersAdapter.setAll),
})

export const { selectAll: selectAllUsers, selectById: selectUserById } =
  usersAdapter.getSelectors(({ users }) => users)

export default userSlice.reducer
