import Chats from '@/components/elements/chats'
import Container from '@/components/elements/container'
import React from 'react'

const page = () => {
  return (
    <div className="flex-1 flex flex-col relative">
      <div className="flex-1 ">
        <Container className='h-full w-full  '>
          <Chats />
        </Container>
      </div>
    </div>
  )
}

export default page