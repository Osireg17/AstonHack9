import React from 'react'
import { Avatar, AvatarFallback } from './ui/avatar'
import { User } from 'next-auth'
import Image from 'next/image'

type Props = {
    user: User
}

const UserAvatar = (
    { user }: Props
) => {
  return (
    <Avatar>
        {user?.image ? (
            <div className="relative w-full h-full aspect-square">
                <Image
                    src={user.image}
                    alt="User avatar"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                />
            </div>
        ) : (
            <AvatarFallback>
                <span className='sr-only'>{user?.name}</span>
            </AvatarFallback>
        )}
    </Avatar>
  )
}

export default UserAvatar