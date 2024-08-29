import { signOut, useSession } from 'next-auth/react'
import { FaRegMoon, FaRegSun } from 'react-icons/fa'
import { IoPersonCircleOutline, IoSettingsOutline } from 'react-icons/io5'

import { UserWithAccount } from '@/interface'
import axios from 'axios'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import { AiOutlineQuestionCircle } from 'react-icons/ai'
import { GoSignOut } from 'react-icons/go'
import { RiBookmarkLine } from 'react-icons/ri'
import { useQuery } from 'react-query'
import IconButton from './ui/icon-button'
import UserAvatar from './UserAvatar'

interface ModalMenuProps {
  isOpen?: boolean
  onClose?: () => void
}

const ModalMenu: React.FC<ModalMenuProps> = ({ isOpen, onClose }) => {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { status } = useSession()

  const fetchUser = async () => {
    const { data } = await axios('/api/users')
    return data as UserWithAccount
  }

  const { data: user, isSuccess } = useQuery('user-form', fetchUser, {
    enabled: status === 'authenticated',
    refetchOnMount: false,
  })

  const handleThemeChange = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black bg-opacity-75"
        onClick={onClose}
      >
        <div className="max-w-7xl mx-auto h-full relative">
          <div className="absolute top-10 left-0 w-60 bg-gray-800 z-30 text-white rounded-xl">
            <div className="flex flex-col items-start space-y-2 py-4 px-4 border-b border-gray-600 whitespace-nowrap">
              <UserAvatar image={user?.image ?? ''} isOnline={true} />
              <h4
                className="font-bold text-base truncate cursor-pointer"
                onClick={() => {
                  router.push('/' + user?.username)
                }}
              >
                {user?.name}
              </h4>
              <span
                className="text-sm text-slate-100 truncate cursor-pointer"
                onClick={() => {
                  router.push('/' + user?.username)
                }}
              >
                @{user?.username}
              </span>
            </div>
            <div className="space-y-4 py-4 px-4 border-b border-gray-600 whitespace-nowrap">
              <IconButton
                icon={<IoPersonCircleOutline />}
                text="내 프로필"
                onClick={() => {
                  router.push('/' + user?.username)
                }}
              />
              <IconButton
                icon={<RiBookmarkLine />}
                text="컬렉션"
                onClick={() => {
                  router.push('/my/collection')
                }}
              />
              <IconButton
                icon={<IoSettingsOutline />}
                text="설정"
                onClick={() => {
                  router.push('/my/settings')
                }}
              />
            </div>
            <div className="space-y-4 py-4 px-4 border-b border-gray-600 whitespace-nowrap">
              <IconButton
                icon={<AiOutlineQuestionCircle />}
                text="도움말 및 지원"
                onClick={() => {
                  router.push('/help')
                }}
              />
              {theme === 'dark' ? (
                <IconButton
                  icon={<FaRegSun />}
                  text="라이트 모드"
                  onClick={handleThemeChange}
                />
              ) : (
                <IconButton
                  icon={<FaRegMoon />}
                  text="다크 모드"
                  onClick={handleThemeChange}
                />
              )}
            </div>
            <div className="space-y-4 py-4 px-4 border-b border-gray-600 whitespace-nowrap">
              <IconButton
                icon={<GoSignOut />}
                text="로그아웃"
                onClick={() => signOut()}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ModalMenu
