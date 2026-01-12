"use client"
import React from "react";

import DynamicForm from "../elements/form-elements/dynamic-form";
import { AttributeSchema } from "@/schemas/attribute-schema";


const AttributeForm: React.FC = () => {


    return (
        <div className="py-10">
            <DynamicForm
                schema={AttributeSchema}
                onSubmit={(values) => {
                    console.log("Form Submitted :", values);
                }}
            >
            </DynamicForm>

        </div>
    );
};

export default AttributeForm;
