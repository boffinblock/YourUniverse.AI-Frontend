import Chats from '@/components/elements/chats'

const page = async ({ params }: { params: Promise<{ chatid: string }> }) => {
  const { chatid } = await params;
  return (
    <Chats chatId={chatid} />
  )
}

export default page