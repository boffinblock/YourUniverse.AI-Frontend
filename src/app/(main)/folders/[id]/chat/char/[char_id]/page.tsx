import Chats from '@/components/elements/chats'

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string; char_id: string }>
}) {
  const { char_id } = await params
  return <Chats chatId={char_id} />
}
