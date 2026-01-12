import { FormData } from "@/types/form-types";

export const AttributeSchema: FormData[] = [
  {
    name: "resources",
    type: "text",
    label: "Resources Used",
    required: true,
    placeholder: "Enter the resources that are used ....",
    rules: {
      min: 4,
      max: 100,
    },
    cols: 12,
    row: 4,
  },
  {
    name: "usedFor",
    type: "text",
    label: "Used For",
    required: true,
    placeholder: "Enter what this resource is used for...",
    rules: {
      min: 4,
      max: 100,
    },
    cols: 12,
    row: 4,
  },
  {
    name: "description",
    type: "textarea",
    label: "Description",
    required: true,
    placeholder: "Describe the purpose or usage of this resource...",
    rules: {
      min: 4,
      max: 100,
    },
    cols: 12,
    row: 4,
    tokens:false
  },
   {
        name: "links",
        type: "multi-entries",
        label: "Relative Links",
        required: true,
        placeholder: "Enter relative Links....",
        cols: 12,
        row: 4,
        rows: "3",
        tokens: false,
    },
]