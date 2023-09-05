import { createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import { apiSlice } from '../api/apiSlice';

const usersAdapter = createEntityAdapter();
const initialState = usersAdapter.getInitialState();

const apiUsersSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => '/users',
      transformResponse: (response) =>
        usersAdapter.setAll(initialState, response),
    }),
  }),
});

export const getUsersEndpoint = apiUsersSlice.endpoints.getUsers;

const selectUsersData = createSelector(
  getUsersEndpoint.select(),
  (result) => result.data
);

export const { selectAll: selectAllUsers, selectById: selectUserById } =
  usersAdapter.getSelectors((state) => selectUsersData(state) || initialState);
