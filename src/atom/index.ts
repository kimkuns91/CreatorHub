import { PostFormType } from '@/interface';
import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export const postFormState = atom<PostFormType | null>({
  key: 'postFormState',
  default: {
    title: '',
    context: '',
  },
  effects_UNSTABLE: [persistAtom],
});