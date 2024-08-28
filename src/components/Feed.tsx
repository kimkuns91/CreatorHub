import React, { useEffect, useRef } from 'react'
import { Loader, LoaderGrid } from './Loader'

import useIntersectionObserver from '@/hooks/useIntersectionObserver'
import { PostWithUser } from '@/interface'
import axios from 'axios'
import { useInfiniteQuery } from 'react-query'
import Post from './Post'

const Feed = () => {
  const ref = useRef<HTMLDivElement | null>(null)
  const pageRef = useIntersectionObserver(ref, {})
  const isPageEnd = !!pageRef?.isIntersecting

  const fetchPosts = async ({ pageParam = 1 }) => {
    const { data } = await axios('/api/posts?page=' + pageParam, {
      params: {
        limit: 12,
        page: pageParam,
      },
    })
    return data
  }

  const {
    data: posts,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isError,
    isLoading,
  } = useInfiniteQuery(['posts'], fetchPosts, {
    getNextPageParam: (lastPage, pages) =>
      lastPage?.data?.length > 0 ? lastPage.page + 1 : undefined,
  })

  if (isError) {
    throw new Error('Room API Fetching Error')
  }

  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined

    if (isPageEnd && hasNextPage) {
      timerId = setTimeout(() => {
        fetchNextPage()
      }, 500)
    }
  }, [fetchNextPage, hasNextPage, isPageEnd])

  return (
    <>
      {isLoading || isFetching ? (
        <LoaderGrid />
      ) : (
        posts?.pages?.map((post, index) => (
          <React.Fragment key={index}>
            {post?.data?.map((post: PostWithUser) => (
              <Post post={post} key={post.id} />
            ))}
          </React.Fragment>
        ))
      )}
      {(isFetching || hasNextPage || isFetchingNextPage) && <Loader />}
      <div className="w-full touch-none h-10 mb-10" ref={ref} />
    </>
  )
}

export default Feed
