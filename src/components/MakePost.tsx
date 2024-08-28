'use client'

import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import { useRecoilState, useResetRecoilState } from 'recoil'

import { postFormState } from '@/atom'
import { storage } from '@/utils/firebaseApp'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { HiOutlinePhotograph } from 'react-icons/hi'
import { v4 as uuidv4 } from 'uuid'

interface PostImageProps {
  images?: string[]
}

interface ImageItem {
  id: string
  url: string
}

const MakePost = () => {
  const { data: session } = useSession()
  const [postForm, setPostForm] = useRecoilState(postFormState)
  const [images, setImages] = useState<ImageItem[]>([])
  const [disableSubmit, setDisableSubmit] = useState<boolean>(false)

  const resetPostForm = useResetRecoilState(postFormState)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PostImageProps>()

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target
    if (!files) return

    Array.from(files).forEach((file: File) => {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)
      fileReader.onloadend = (event: ProgressEvent<FileReader>) => {
        const { result } = event.target as FileReader
        if (result) {
          setImages((prevImages) => [
            ...prevImages,
            { id: uuidv4(), url: result.toString() },
          ])
        }
      }
    })
  }

  const deleteImage = (id: string) => {
    setImages((prevImages) => prevImages.filter((image) => image.id !== id))
  }

  async function uploadImages(images: ImageItem[]) {
    const uploadedImageUrls = []
    const imageKeys: string[] = []

    for (const imageItem of images) {
      const imageKey = uuidv4()
      const imageRef = ref(storage, `${session?.user?.id}/${imageKey}`)
      try {
        const data = await uploadString(imageRef, imageItem.url, 'data_url')
        const imageUrl = await getDownloadURL(data.ref)
        uploadedImageUrls.push(imageUrl)
        imageKeys.push(imageKey)
      } catch (error) {
        console.error('Error uploading images: ', error)
      }
    }

    return { uploadedImageUrls, imageKeys }
  }

  const onSubmit = async () => {
    if (!postForm) return

    try {
      setDisableSubmit(true)

      const { uploadedImageUrls, imageKeys } = await uploadImages(images)

      const postData = {
        content: postForm.context,
        images: uploadedImageUrls,
        imageKeys: imageKeys,
        videos: [],
        videoKeys: [],
      }

      const result = await axios.post('/api/posts', postData)

      if (result.status === 200) {
        toast.success('게시물이 성공적으로 작성되었습니다.')
        resetPostForm()
      } else {
        toast.error('데이터 생성 중 문제가 발생했습니다.')
      }
    } catch (error) {
      console.log(error)
      toast.error('게시물 작성 중 오류가 발생했습니다.')
    } finally {
      setDisableSubmit(false)
      location.reload()
    }
  }

  if (!session) return null

  return (
    <div className="flex border-b border-gray-200 p-3 space-x-3 w-full">
      <div className="h-11 w-11 rounded-full cursor-pointer hover:brightness-95 relative">
        <Image
          src={session.user.image ?? ''}
          alt="profile"
          layout="fill"
          className="rounded-full"
        />
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-1 divide-y divide-gray-200"
      >
        <textarea
          className="w-full border-none outline-none p-2 tracking-wide min-h-[50px] text-gray-700"
          placeholder="새 게시물 작성..."
          rows={2}
          value={postForm?.context || ''}
          onChange={(e) =>
            setPostForm((prevState) => ({
              ...prevState,
              context: e.target.value,
            }))
          }
        ></textarea>
        <div className="flex items-center justify-between pt-2.5">
          <label
            htmlFor="file-upload"
            className="relative cursor-pointer rounded-md bg-white font-semibold text-rose-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-rose-600 focus-within:ring-offset-2 hover:text-rose-500"
          >
            <HiOutlinePhotograph className="h-10 w-10 p-2 text-sky-500 hover:bg-sky-100 rounded-full cursor-pointer" />
            <input
              id="file-upload"
              type="file"
              multiple
              accept="image/*"
              className="sr-only"
              onChange={handleFileUpload}
            />
          </label>
          <button
            type="submit"
            disabled={
              postForm?.context?.trim() === '' || isSubmitting || disableSubmit
            }
            className="bg-blue-400 text-white px-4 py-1.5 rounded-full shadow-md hover:brightness-95 disabled:opacity-50"
          >
            포스트
          </button>
        </div>
        {images.length > 0 && (
          <div className="mt-5 pt-5 max-w-lg mx-auto flex flex-wrap gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative">
                <Image
                  src={image.url}
                  alt="미리보기"
                  width={100}
                  height={100}
                  className="rounded-md"
                />
                <button
                  onClick={() => deleteImage(image.id)}
                  className="absolute top-0 right-0 bg-white rounded-full p-1 text-red-500"
                >
                  <AiOutlineCloseCircle className="h-6 w-6" />
                </button>
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
  )
}

export default MakePost
