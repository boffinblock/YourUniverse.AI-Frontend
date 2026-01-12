"use client"
import React from "react";

import DynamicForm from "../elements/form-elements/dynamic-form";
import { FeatureSchema } from "@/schemas/feature-schema";
interface Props {
    characterId?: string;
}

const FeatureForm: React.FC<Props> = () => {


    return (
        <div className="py-10">
            <DynamicForm
                schema={FeatureSchema}
                onSubmit={(values) => {
                    console.log("Form Submitted:", values);
                }}
            >
                {/* <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button >
                            Account Menu <Menu />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                Change Username <span className="ml-auto text-xs text-muted-foreground">(once every 24 hours)</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                Change / Update Email <span className="ml-auto text-xs text-muted-foreground">(once every 24 hours)</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                Change / Update Password
                            </DropdownMenuItem>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />

                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                Bulk Export Your Universe
                            </DropdownMenuItem>
                            <DropdownMenuItem variant="destructive" >
                                Delete
                                <DropdownMenuShortcut><Trash2 className="size-4 text-destructive" /></DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>


                    </DropdownMenuContent>
                </DropdownMenu> */}

            </DynamicForm>

        </div>
    );
};

export default FeatureForm;
