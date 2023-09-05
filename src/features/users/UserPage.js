import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserById } from './usersSlice';
import { createSelector } from '@reduxjs/toolkit';
import { useGetPostQuery } from '../api/apiSlice';

export const UserPage = ({ match }) => {
  const { userId } = match.params;
  const user = useSelector((state) => selectUserById(state, userId));
  const selectPostsForUser = useMemo(() => {
    return createSelector(
      (res) => res.data,
      (res, userId) => userId,
      (data, userId) => data?.filter((p) => p.user === userId) || []
    );
  }, []);

  const { postsForUser } = useGetPostQuery(undefined, {
    selectFromResult: (result) => ({
      ...result,
      postsForUser: selectPostsForUser(result, userId),
    }),
  });

  const postTitles = postsForUser.map((p) => (
    <li key={p.id}>
      <Link to={`/posts/${p.id}`}>{p.title}</Link>
    </li>
  ));

  return (
    <section>
      <h2>{user.name}</h2>
      <ul>{postTitles}</ul>
    </section>
  );
};
