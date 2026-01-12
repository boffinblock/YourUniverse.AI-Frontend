
"use client";

import React from "react";
import Container from "@/components/elements/container"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit } from "lucide-react"
import { useRouter, useParams } from "next/navigation"

const CharacterDetailPage = () => {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;
    const defaultTags = [
        { label: "Warrior", value: "warrior" },
        { label: "Mage", value: "mage" },
        { label: "Rogue", value: "rogue" },
        { label: "Beast", value: "beast" },
        { label: "Animal", value: "animal" },
        { label: "Human", value: "human" },
        { label: "Elf", value: "elf" },
        { label: "Vampire", value: "vampire" },
        { label: "Cyberpunk", value: "cyberpunk" },
        { label: "Sci-Fi", value: "sci-fi" },
        { label: "Men", value: "men" },
        { label: "Women", value: "women" },
        { label: "Mystical", value: "mystical" },
        { label: "Hero", value: "hero" },
        { label: "Villain", value: "villain" },
    ];

    // Mock character data
    const character = {
        id: "1",
        name: "Astra",
        tagline: "Your cosmic AI companion 🌌",
        description:
            "Astra is an intelligent and curious AI entity who loves exploring the universe and helping you uncover the mysteries of the cosmos.",
        avatar: {
            url: "https://i.imgur.com/Rg8VZ2B.png",
        },
        gender: "Female",
        greeting: "Hey there, stargazer! Ready to explore the galaxies together?",
        created_at: "2025-03-12T10:30:00Z",
        voiceProvider: "ElevenLabs",
        example_dialogues: [
            {
                user: "What's the nearest habitable planet?",
                ai: "That would be Kepler-442b, about 1,200 light-years away — want me to tell you more about it?",
            },
            {
                user: "Can you teach me about constellations?",
                ai: "Of course! Let’s start with Orion — one of the easiest to spot during winter nights.",
            },
        ],
        behaviorPrompt:
            "Astra is friendly, knowledgeable, and deeply fascinated by outer space. She communicates in an enthusiastic and supportive tone, making learning about astronomy fun and exciting.",
        personality_traits: [
            "Curious",
            "Empathetic",
            "Playful",
            "Inquisitive",
            "Supportive",
        ],
    }

    // Helper for date formatting
    // const formatRelativeTime = (date: Date) => {
    //     const diff = (Date.now() - date.getTime()) / 1000
    //     if (diff < 60) return "just now"
    //     if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`
    //     if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
    //     return `${Math.floor(diff / 86400)} days ago`
    // }

    return (
        <Container className=" h-full flex flex-col"  >

            <div className="flex flex-col h-screen">
                <div className="flex py-4 px-4 items-center  justify-end">
                    <Button
                        className="text-lg !px-4 flex items-center"
                        onClick={() => router.push(`/characters/${id}/edit`)}
                    >
                        <Edit />Edit
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="">
                        <div className="grid grid-cols-1 lg:grid-cols-4  gap-6">
                            {/* Left Column */}
                            <div className="space-y-6  col-span-4 ">
                                {/* Character Info Card */}
                                <Card className="transition-shadow py-4">
                                    <CardHeader className="flex flex-row items-start space-x-4 space-y-0">
                                        <Avatar className="aspect-square w-1/2 h-fit rounded-full">
                                            <AvatarImage
                                                src="https://github.com/shadcn.png"
                                                alt="@shadcn"
                                                className="object-cover"
                                            />
                                            <AvatarFallback className="rounded-md">
                                                {character.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        {/* <div className="space-y-1">
                                             <CardTitle className="text-white/90 text-2xl font-semibold">Tony Stark</CardTitle>
                                            <p className="text-md  pb-1 line-clamp-3 text-gray-300">
                                                {character.tagline}
                                            </p>
                                          
                                            </div> */}
                                        {/* <div className="flex items-center text-sm text-gray-300 gap-4 py-1">
                                                <span className="text-xs">
                                                    Created: {formatRelativeTime(new Date(character.created_at))}
                                                </span>
                                            </div> */}
                                    </CardHeader>
                                </Card>
                                <Card className="col-span-2 transition-shadow p-4 px-8">
                                    <div className="flex gap-3  flex-wrap ">
                                        {defaultTags.map((tag, idx) => (
                                            <Badge
                                                key={idx} className="text-lg"
                                            >
                                                {tag.label}
                                            </Badge>
                                        ))}
                                    </div>
                                </Card>

                                {/* Basic Info */}
                                <Card className="transition-shadow py-4">
                                    <CardHeader>
                                        <CardTitle>Basic Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4 px-6">
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-300">Description</h3>
                                            <p className="text-gray-300 pl-2">{character.description}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-300">Description</h3>
                                            <p className="text-gray-300 pl-2">{character.gender}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-300">Description</h3>
                                            <p className="text-gray-300 pl-2">{character.greeting}</p>
                                        </div>
                                    </CardContent>
                                </Card>

                            </div>

                            {/* Right Column */}
                            <div className="space-y-6 lg:col-span-2">

                                {/* Personality & Behavior */}
                                <Card className="transition-shadow py-4">
                                    <CardHeader>
                                        <CardTitle>Personality & Behavior</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">
                                                Behavior Prompt
                                            </h3>
                                            <p className="text-foreground">{character.behaviorPrompt}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">
                                                Personality Traits
                                            </h3>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {character.personality_traits.map((trait, index) => (
                                                    <Badge key={index} variant="secondary">
                                                        {trait}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default CharacterDetailPage
