import React from 'react'
import Container from '../elements/container'
import DynamicForm from '../elements/form-elements/dynamic-form';
import { characterPreviewSchema } from '@/schemas/character-preview-schema';

const PreviewForm = () => {
    return (
        <Container className=" h-fit max-w-4xl ">
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
        }}
    />
</Container>

    )
}

export default PreviewForm