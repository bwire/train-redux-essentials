import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
} from '@reduxjs/toolkit'
import { client } from '../../api/client'

const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
})

const initialState = postsAdapter.getInitialState({
  status: 'idle',
  error: null,
})

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await client.get('fakeApi/posts')
  return response.data
})

export const addNewPost = createAsyncThunk(
  'posts/addNewPost',
  async (payload) => {
    const response = await client.post('fakeApi/posts', payload)
    return response.data
  }
)

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postUpdated: {
      reducer(state, action) {
        const { id, title, content } = action.payload
        const elem = state.entities[id]
        if (elem) {
          elem.title = title
          elem.content = content
        }
      },
      prepare: (id, title, content) => ({
        payload: {
          id,
          title,
          content,
        },
      }),
    },
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload
      const post = state.entities[postId]
      if (post) {
        post.reactions[reaction]++
      }
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        postsAdapter.upsertMany(state, action.payload)
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(addNewPost.fulfilled, postsAdapter.addOne),
})

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors(({ posts }) => posts)

export const selectPostsByUser = createSelector(
  [selectAllPosts, (_, userId) => userId],
  (posts, userId) => posts.filter((p) => p.user === userId)
)

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions
export default postsSlice.reducer
