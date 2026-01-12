import React from "react";
import { cn } from "@/lib/utils";
import FormTextarea from "./form-textarea";
import { FormData } from "@/types/form-types";
import FormInputField from "./form-Input-field";
import FormToggle from "./form-toggle";
import FormSelect from "./form-select";
import FormMultiSelect from "./form-multi-select";
import FormImageUpload from "./image-upload";
import MessageListManager from "./message-list-manager";
import FormCheckbox from "./form-checkbox";
import EntriesField from "./entries-field";
import FormMultiFile from "./form-multi-file";
import FormExampleDialogues from "./form-example-dialogues";
import FormLinkTo from "./form-link-to";

interface FormFieldsProps extends FormData {
    cols?: FormData["cols"];
}

const FieldRenderer: React.FC<FormFieldsProps> = ({ ...props }) => {

    switch (props.type) {
        case "textarea":
            return <FormTextarea {...props} />;
        case "text":
            return <FormInputField {...props} />
        case "toggle":
            return <FormToggle {...props} />
        case "select":
            return <FormSelect {...props} />
        case "multi-select":
            return <FormMultiSelect {...props} />
        case "file":
            return <FormImageUpload {...props} />
        case "multiple-file":
            return <FormMultiFile {...props} />
        case "entries":
            return (<EntriesField {...props} />

            );
        case "checkbox":
            return <FormCheckbox {...props} />
        case "multi-entries":
            return (
                <MessageListManager
                    {...props}
                />
            );
        case "form-link-to":
            return <FormLinkTo {...props} />
        case "example-dialogues": {
            // Normalize defaultValue to string[] for FormExampleDialogues
            const { defaultValue, ...restProps } = props;
            const normalizedDefaultValue: string[] | undefined =
                Array.isArray(defaultValue)
                    ? defaultValue
                    : typeof defaultValue === 'string'
                        ? [defaultValue]
                        : undefined;

            return (
                <FormExampleDialogues
                    {...restProps}
                    defaultValue={normalizedDefaultValue}
                />
            );
        }

        default:
            return null;
    }
};

const colSpanClasses: Record<number, string> = {
    1: "col-span-1",
    2: "col-span-2",
    3: "col-span-3",
    4: "col-span-4",
    5: "col-span-5",
    6: "col-span-6",
    7: "col-span-7",
    8: "col-span-8",
    9: "col-span-9",
    10: "col-span-10",
    11: "col-span-11",
    12: "col-span-12",
};

const FormFields: React.FC<FormFieldsProps> = ({ cols = 12, required, ...rest }) => {
    const colClass = colSpanClasses[cols] || "col-span-12";
    return (
        <div className={cn(colClass)}>
            <FieldRenderer {...rest} />
        </div>
    );
};

export default FormFields;
