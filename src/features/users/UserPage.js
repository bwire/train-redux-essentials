import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUserById } from './usersSlice'
import { selectPostsByUser } from '../posts/postsSlice'

export const UserPage = ({ match }) => {
  const { userId } = match.params
  const user = useSelector((state) => selectUserById(state, userId))
  const selectUserPosts = useSelector((state) =>
    selectPostsByUser(state, userId)
  )

  const postTitles = selectUserPosts.map((p) => (
    <li key={p.id}>
      <Link to={`/posts/${p.id}`}>{p.title}</Link>
    </li>
  ))

  return (
    <section>
      <h2>{user.name}</h2>
      <ul>{postTitles}</ul>
    </section>
  )
}
