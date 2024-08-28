import { useEffect, useState } from 'react';

import { PostWithUser } from '@/interface';
import axios from 'axios';
import { Loader } from './Loader';
import Post from './Post';

interface UserMediaListProps {
  userId: string
}

const UserMediaList: React.FC<UserMediaListProps> = ({ userId }) => {
  const [data, setData] = useState<PostWithUser[] | null>(null);

  useEffect(() => {
    ;(async () => {
      const res = await axios.get('/api/posts/' + userId + '?type=media');
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

export default UserMediaList;
