import UserPage from '@/components/UserPage'
import { useGetUser } from '@/utils/fetch/user'
import { notFound } from 'next/navigation'

interface PageProps {
  params: {
    username: string
  }
}
export default async function Page({ params }: PageProps) {
  const { username } = params

  console.log('Params:', username)
  const user = await useGetUser(username)

  if (!user) return notFound()

  return <UserPage user={user} />
}
