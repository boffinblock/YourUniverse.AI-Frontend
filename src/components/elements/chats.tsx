"use client"
import React from 'react'
import ChatMessages from './chat-messages'
import ChatPanel from './chat-panel'

interface Props {
  setActivePreview?: (value: 'character' | 'persona' | null) => void;
}
const Chats: React.FC<Props> = ({ setActivePreview = () => { } }) => {
    return (
        <div className='flex h-full flex-1 flex-col relative  min-h-0 '>
            <ChatMessages setActivePreview={setActivePreview} />
            <ChatPanel />
        </div>
    )
}

export default Chats