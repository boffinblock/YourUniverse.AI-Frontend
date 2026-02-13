import Chats from '@/components/elements/chats'
import Container from '@/components/elements/container'
import React from 'react'

const page = async ({ params }: { params: Promise<{ chatid: string }> }) => {
  const { chatid } = await params;
  return (
    <div className="flex-1 h-full  ">
      <Container className='h-full w-full' >
        <Chats chatId={chatid} />
      </Container>
    </div>
  )
}

export default page