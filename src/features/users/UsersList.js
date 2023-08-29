import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectAllUsers } from './usersSlice'

export const UsersList = () => {
  const users = useSelector(selectAllUsers)
  const renderedUsers = users.map((u) => (
    <li key={u.id}>
      <Link to={`/users/${u.id}`}>{u.name}</Link>
    </li>
  ))

  return (
    <section>
      <h2>Users</h2>
      <ul>{renderedUsers}</ul>
    </section>
  )
}
