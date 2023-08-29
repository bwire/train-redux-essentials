import React, { useEffect, memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import { PostAuthor } from './PostAuthor'
import { TimeAgo } from './TimeAgo'
import { ReactionButtons } from './ReactionButtons'
import { fetchPosts, selectPostById, selectPostIds } from './postsSlice'
import { Spinner } from '../../components/Spinner'

const PostsExcerptUnwrapped = ({ postId }) => {
  const post = useSelector((state) => selectPostById(state, postId))
  return (
    <article className="post-excerpt" key={post.id}>
      <h3>{post.title}</h3>
      <PostAuthor userId={post.user} />
      <TimeAgo timestamp={post.date} />
      <p className="post-content">{post.content.substring(0, 100)}</p>
      <ReactionButtons post={post} />
      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
    </article>
  )
}

export const PostsExcerpt = memo(PostsExcerptUnwrapped)

export const PostsList = () => {
  const dispatch = useDispatch()

  const postsIds = useSelector(selectPostIds)
  const postsStatus = useSelector((state) => state.posts.status)
  const error = useSelector(({ posts }) => posts.error)

  useEffect(() => {
    if (postsStatus === 'idle') {
      dispatch(fetchPosts())
    }
  }, [postsStatus, dispatch])

  let content

  if (postsStatus === 'loading') {
    content = <Spinner text="Loading..." />
  } else if (postsStatus === 'succeeded') {
    content = postsIds.map((postId) => (
      <PostsExcerpt key={postId} postId={postId} />
    ))
  } else if (postsStatus === 'failed') {
    content = <div>{error}</div>
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {content}
    </section>
  )
}
