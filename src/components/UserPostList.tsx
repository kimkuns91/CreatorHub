import { useEffect, useState } from 'react';

import { PostWithUser } from '@/interface';
import axios from 'axios';
import { Loader } from './Loader';
import Post from './Post';

interface UserPostListProps {
  userId: string
}
const UserPostList: React.FC<UserPostListProps> = ({ userId }) => {
  const [data, setData] = useState<PostWithUser[] | null>(null);

  useEffect(() => {
    ;(async () => {
      const res = await axios.get('/api/posts/' + userId + '?type=post');
      setData(res.data);
    })();
  }, [userId]);

  if (!data) return <Loader />;
  
  return (
    <>
      {data &&
        data.map((post: PostWithUser) => <Post post={post} key={post.id} />)}
    </>
  );
};
export default UserPostList;
