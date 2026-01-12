"use client"
import React, { useMemo, useRef, useEffect } from "react";
import DynamicForm from "../elements/form-elements/dynamic-form";
import { personaSchema } from "@/schemas";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, Copy, Link as LinkIcon, Trash2, Upload, Download, Folder, RotateCcw } from "lucide-react";
import { Button } from "../ui/button";
import { useCreatePersona, useUpdatePersona, useGetPersona } from "@/hooks";
import type { CreatePersonaRequest, UpdatePersonaRequest } from "@/lib/api/personas";

interface Props {
  personaId?: string;
}

const PersonaForm: React.FC<Props> = ({ personaId = undefined }) => {
  const isEditMode = !!personaId;
  const formRef = useRef<{ resetForm: () => void } | null>(null);

  // Fetch persona data if editing
  const { persona, isLoading: isLoadingPersona } = useGetPersona(personaId, {
    enabled: isEditMode,
    requireAuth: true,
    showErrorToast: true,
  });

  // Create persona mutation
  const {
    createPersona,
    isLoading: isCreating,
    isSuccess: isCreateSuccess,
    reset: resetCreateMutation,
  } = useCreatePersona({
    onSuccess: (data) => {
      // Navigate to persona detail page after successful creation
    },
    showToasts: true,
  });

  // Reset form when persona is created successfully
  useEffect(() => {
    if (isCreateSuccess && !isEditMode && formRef.current) {
      // Reset form to default values
      formRef.current.resetForm();
      // Reset mutation state after a short delay
      setTimeout(() => {
        resetCreateMutation();
      }, 100);
    }
  }, [isCreateSuccess, isEditMode, resetCreateMutation]);

  // Update persona mutation
  const {
    updatePersona,
    isLoading: isUpdating,
    isSuccess: isUpdateSuccess,
  } = useUpdatePersona({
    personaId: personaId || "",
    onSuccess: (data) => {
      // Navigate to persona detail page after successful update
    },
    showToasts: true,
  });

  const isLoading = isCreating || isUpdating || isLoadingPersona;
  const isSuccess = isCreateSuccess || isUpdateSuccess;

  /**
   * Create modified schema for edit mode (make avatar optional)
   */
  const formSchema = useMemo(() => {
    if (!isEditMode) return personaSchema;

    // In edit mode, make avatar optional
    return personaSchema.map((field) => {
      if (field.name === "avatar") {
        return { ...field, required: false };
      }
      return field;
    });
  }, [isEditMode]);

  /**
   * Map persona data to form initial values
   */
  const initialValues = useMemo(() => {
    if (!persona) return undefined;

    // Normalize tags to ensure they're always string[] and lowercase (to match MultiSelect option values)
    const normalizeTags = (tags: unknown): string[] => {
      if (Array.isArray(tags)) {
        return tags
          .filter((tag): tag is string => typeof tag === 'string' && tag.trim().length > 0)
          .map(tag => tag.toLowerCase().trim()); // Convert to lowercase to match MultiSelect option values
      }
      if (typeof tags === 'string') {
        if (tags.includes(',')) {
          return tags.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag.length > 0);
        }
        return tags.trim() ? [tags.trim().toLowerCase()] : [];
      }
      return [];
    };

    // Handle lorebook - ensure it's a single value (string), not an array
    const getLorebookValue = (): string => {
      if (persona.lorebook?.id) {
        return persona.lorebook.id;
      }
      return "";
    };

    return {
      avatar: persona.avatar?.url || "",
      name: persona.name || "",
      visiable: persona.visibility || "private",
      rating: persona.rating || "SFW",
      tags: normalizeTags(persona.tags) || [],
      lorebook: getLorebookValue(),
      details: persona.description || "",
      favourite: persona.isFavourite || false,
    };
  }, [persona]);

  /**
   * Handle form submission
   * Maps form values to API request format
   * Validates required fields and prepares data for multipart/form-data upload
   */
  const handleSubmit = async (values: Record<string, any>) => {



    // For create mode, validate required file fields
    if (!isEditMode) {
      if (!values.avatar || !(values.avatar instanceof File)) {
        console.error("Avatar file is required");
        return;
      }
    }

    // Process avatar - handle file upload or URL
    let avatar: File | string | undefined = undefined;
    if (values.avatar) {
      if (typeof values.avatar === 'string') {
        // Direct URL string
        avatar = values.avatar;
      } else if (values.avatar instanceof File) {
        // File object
        avatar = values.avatar;
      } else if (values.avatar?.url) {
        // Already in the correct format - extract URL string
        avatar = values.avatar.url;
      } else if (values.avatar?.file) {
        // File object wrapped in an object
        avatar = values.avatar.file;
      }
    }

    // Map form values to API request format
    // Backend route maps: personaName/name -> name, details/description -> description, visiable/visibility -> visibility
    const baseData = {
      name: values.name || "",
      description: values.details || undefined,
      rating: (values.rating as "SFW" | "NSFW") || "SFW",
      visibility: (values.visiable as "public" | "private") || "private",
      tags: Array.isArray(values.tags)
        ? values.tags
        : values.tags
          ? [values.tags]
          : undefined,
      favourite: Boolean(values.favourite),
      // Handle lorebook - if it's an array (from multi-select), take first value; otherwise use as string
      lorebookId: Array.isArray(values.lorebook)
        ? (values.lorebook.length > 0 ? values.lorebook[0] : undefined)
        : (values.lorebook && values.lorebook.trim() ? values.lorebook.trim() : undefined),
    };

    if (isEditMode) {
      // Update mode - only include changed fields
      const updateData: UpdatePersonaRequest = {
        ...baseData,
      };

      // Handle avatar - only include if it's a new File, otherwise keep existing
      if (avatar instanceof File) {
        updateData.avatar = avatar;
      } else if (typeof avatar === "string" && avatar !== persona?.avatar?.url) {
        updateData.avatar = avatar;
      }

      // Handle lorebookId - allow null to unlink
      // Handle both array (multi-select) and string (single-select) formats
      const lorebookValue = Array.isArray(values.lorebook)
        ? (values.lorebook.length > 0 ? values.lorebook[0] : "")
        : (values.lorebook || "");

      if (lorebookValue === "" || lorebookValue === null || lorebookValue === undefined) {
        updateData.lorebookId = null;
      } else if (lorebookValue !== persona?.lorebook?.id) {
        updateData.lorebookId = lorebookValue;
      }

      // Trigger persona update
      updatePersona(updateData);
    } else {
      // Create mode - include required files
      const createData: CreatePersonaRequest = {
        ...baseData,
        avatar: avatar instanceof File ? avatar : undefined,
      };

      // Trigger persona creation
      createPersona(createData);
    }




  };

  return (
    <div className="py-10">
      <DynamicForm
        key={persona?.id || "new"}
        schema={formSchema}
        onSubmit={handleSubmit}
        initialValues={initialValues}
        formRef={formRef}
        submitButtonText={
          isLoading
            ? (isEditMode ? "Updating Persona..." : "Creating Persona...")
            : isSuccess
              ? (isEditMode ? "Persona Updated!" : "Persona Created!")
              : (isEditMode ? "Update Persona" : "Create Persona")
        }
        isSubmitting={isLoading}
        submitButtonDisabled={isLoading || isSuccess || isLoadingPersona}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" className="rounded-full" disabled={isLoading || isSuccess}>
              Persona Menu <Menu />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64" align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                Duplicate
                <DropdownMenuShortcut><Copy className="size-4" /></DropdownMenuShortcut>
              </DropdownMenuItem>

              <DropdownMenuItem>
                Link to Account
                <DropdownMenuShortcut><LinkIcon className="size-4" /></DropdownMenuShortcut>
              </DropdownMenuItem>

              <DropdownMenuItem>
                Clear All Fields
                <DropdownMenuShortcut><RotateCcw className="size-4" /></DropdownMenuShortcut>
              </DropdownMenuItem>

              <DropdownMenuItem>
                Import
                <DropdownMenuShortcut><Upload className="size-4" /></DropdownMenuShortcut>
              </DropdownMenuItem>

              <DropdownMenuItem>
                Export
                <DropdownMenuShortcut><Download className="size-4" /></DropdownMenuShortcut>
              </DropdownMenuItem>

              <DropdownMenuItem>
                Link to Realm
                <DropdownMenuShortcut><Folder className="size-4" /></DropdownMenuShortcut>
              </DropdownMenuItem>

              <DropdownMenuItem variant="destructive" >
                Delete
                <DropdownMenuShortcut><Trash2 className="size-4 text-destructive" /></DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </DynamicForm>
    </div>
  );
};

export default PersonaForm;
