"use client"
import Chats from '@/components/elements/chats'
import Container from '@/components/elements/container'
import DynamicForm from '@/components/elements/form-elements/dynamic-form'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { characterPreviewSchema } from '@/schemas/character-preview-schema'
import { personaPreviewSchema } from '@/schemas/persona-preview-schema'
import { X } from 'lucide-react'
import React, { useState } from 'react'

const Page = () => {
    const [activePreview, setActivePreview] = useState<'character' | 'persona' | null>(null);


    const closePreview = () => setActivePreview(null);

    const isCharacterPreview = activePreview === 'character';
    const isPersonaPreview = activePreview === 'persona';
    return (
        <div className="flex-1 flex  relative overflow-hidden min-h-0 ">
            <div className="flex-1 flex   min-h-0  ">
                <Container className={cn('h-full w-full min-h-0   ', activePreview && "mr-0 max-w-6xl ")}>
                    <Chats setActivePreview={setActivePreview} />
                </Container>

            </div>
            {
                isCharacterPreview && (
                    <div className='max-w-sm w-full   relative   '>
                        <Button size={"icon"} className='  absolute  -left-8   top-2 z-50' onClick={closePreview}>
                            <X />
                        </Button>
                        <div className='p-2 overflow-y-auto h-full'>
                            <div className=' bg-primary/40 rounded-2xl backdrop-blur-sm p-4  '>
                                <DynamicForm
                                    button={false}
                                    schema={characterPreviewSchema}
                                    onSubmit={(values) => {
                                        console.log("Form Submitted:", values);
                                    }}
                                    initialValues={{
                                        characterName: "Luna AI",
                                        visiable: "private",
                                        rating: "SFW",
                                        linkToLorebook: "luna-ai",
                                        linkToPersona: "astro-bot",
                                        tags: ["ai", "assistant", "friendly"],
                                        description:
                                            "Luna AI is a friendly and adaptive conversational companion designed to assist users with creative and technical discussions.",
                                        scenario:
                                            "You are chatting with Luna AI in a cozy futuristic workspace.",
                                        personalitySummary:
                                            "Curious, kind, and intelligent with a playful tone.",
                                        firstMessage:
                                            "Hello! I’m Luna. How can I brighten your day today?",
                                        alternateMessages: [
                                            "Hey there! How are you doing today?",
                                            "Hi! Ready to explore something fun?",
                                        ],
                                        exampleDialogue:
                                            "<START>\nUser: What's your favorite color?\nLuna: I’d say blue — calm and thoughtful, like a clear sky!",
                                        authorNotes:
                                            "Created for testing AI personality behavior and tone.",
                                        characterNotes:
                                            "Luna AI adapts tone and depth based on user engagement.",
                                        favourite: true
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )
            }

            {
                isPersonaPreview && (
                    <div className='max-w-sm w-full   relative   '>
                        <Button size={"icon"} className='  absolute  -left-8   top-2 z-50' onClick={closePreview}>
                            <X />
                        </Button>
                        <div className='p-2 overflow-y-auto h-full'>
                            <div className=' bg-primary/40 rounded-2xl backdrop-blur-sm p-4  '>
                                <DynamicForm
                                    button={false}
                                    schema={personaPreviewSchema}
                                    onSubmit={(values) => {
                                        console.log("Form Submitted:", values);
                                    }}
                                    initialValues={{

                                        name: "Luna AI",
                                        tags: ["ai", "assistant", "friendly"],
                                        lorebook: "luna-ai",
                                        details:
                                            "Luna AI is a friendly and adaptive conversational companion designed to assist users with creative and technical discussions.",

                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )
            }



        </div >
    )
}

export default Page