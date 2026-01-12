"use client"
import React from "react";
import DynamicForm from "../elements/form-elements/dynamic-form";
import { characterPreviewSchema } from "@/schemas/character-preview-schema";
interface Props {
    characterId?: string;
}

const CharacterPreviewForm: React.FC<Props> = () => {


    return (
        <div className="py-10">
            <DynamicForm
                schema={characterPreviewSchema}
                onSubmit={(values) => {
                    console.log("Form Submitted:", values);
                }}
            >
            </DynamicForm>

        </div>
    );
};

export default CharacterPreviewForm;   
