"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers';
import { Plus, GripVertical, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import ToolTipElement from '../tooltip-element';
import { Textarea } from '@/components/ui/textarea';
import { Label } from "@/components/ui/label";
import { useField } from 'formik';
import { cn } from '@/lib/utils';

interface MessageListManagerProps {
  initialMessages?: string[];
  placeholder?: string;
  label?: string;
  tokens?: boolean;
  name?: string;
  onChange?: (messages: string[]) => void;
}

// Helper: Prevent duplicate messages unless allowed
const isDuplicate = (messages: string[], newMessage: string) =>
  messages.some((msg) => msg.trim() === newMessage.trim());

const MessageListManager: React.FC<MessageListManagerProps> = ({
  initialMessages = [],
  label = "",
  name = "",
  tokens = true,
  placeholder = "",
  onChange,
}) => {
  // field can contain undefined at init if not set by Formik yet
  const [field, meta, helpers] = useField<string[]>(name);
  const { value } = field;
  const { setValue, setTouched } = helpers;

  // Always fallback to initialMessages (if provided) or ['']
  const getInitial = useCallback(
    () =>
      (Array.isArray(value) && value.length > 0
        ? value
        : Array.isArray(initialMessages) && initialMessages.length > 0
        ? initialMessages
        : ['']),
    [value, initialMessages]
  );

  const [messages, setMessages] = useState<string[]>(getInitial);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  // Ensure messages always in sync with outside field changes (Formik/parent)
  useEffect(() => {
    if (Array.isArray(value) && JSON.stringify(value) !== JSON.stringify(messages)) {
      setMessages(value.length > 0 ? value : ['']);
    }
    // eslint-disable-next-line
  }, [value]);

  // Push changes out to Formik/parent when messages mutate
  useEffect(() => {
    if (JSON.stringify(messages) !== JSON.stringify(value)) {
      setValue(messages);
      onChange?.(messages);
    }
    // eslint-disable-next-line
  }, [messages]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // ---- Event Handlers ----
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = messages.findIndex((_, idx) => `message-${idx}` === active.id);
    const newIndex = messages.findIndex((_, idx) => `message-${idx}` === over.id);

    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      setMessages((msgs) => arrayMove(msgs, oldIndex, newIndex));
      setTouched(true);
    }
  };

  const handleAddMessage = () => {
    if (!newMessage.trim()) return;
    if (isDuplicate(messages, newMessage)) {
      setNewMessage(''); // Ignore duplicates
      return;
    }
    setMessages((prev) => [...prev, newMessage.trim()]);
    setNewMessage('');
    setTouched(true);
  };

  // On delete, always keep at least one blank message for required fields
  const handleDeleteMessage = (index: number) => {
    setMessages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      return updated.length === 0 ? [''] : updated;
    });
    setTouched(true);
  };

  const handleUpdateMessage = (index: number, updatedMessage: string) => {
    if (!updatedMessage.trim()) return;
    setMessages((prev) => {
      const updated = [...prev];
      updated[index] = updatedMessage.trim();
      return updated;
    });
    setTouched(true);
  };

  // First textarea (main) message field (message 0)
  const handleFirstMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessages((prev) => {
      const updated = [...prev];
      if (updated.length > 0) updated[0] = e.target.value;
      else updated.push(e.target.value);
      // Ensure empty if completely deleted
      return updated.length === 0 ? [''] : updated;
    });
    setTouched(true);
  };

  // Token can be improved to use real tokenizer if needed
  const tokenCount = messages.reduce((acc, msg) => acc + (msg?.length || 0), 0);

  const sortableItems = messages.map((_, idx) => `message-${idx}`);

  // Improved: prevent duplicate keys, clamp empty string messages, better edge handling
  return (
    <div className='relative space-y-2'>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {label && (
          <Label
            htmlFor={name}
            className={cn(meta.touched && meta.error && "text-destructive")}
          >
            {label}
          </Label>
        )}
        <DialogTrigger asChild>
          <button
            type='button'
            className='text-primary absolute top-[44%] -translate-y-[34%] -left-16 cursor-pointer'
            onClick={() => setIsDialogOpen(true)}
            tabIndex={0}
            aria-label="Add/manage messages"
          >
            <Plus className='size-14' />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader className='p-4'>
            <DialogTitle>Manage Messages</DialogTitle>
            <DialogDescription>
              Add, edit, delete, or reorder your messages below.<br />
              These messages can be used as alternative starting prompts.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-y-2 w-full">
            <div className="overflow-y-auto flex-grow space-y-2">
              <div className='flex-1'>
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Enter new message"
                  className="flex-grow bg-transparent backdrop-blur-none"
                  // minRows={2}
                  // maxRows={5}
                  aria-label="New message"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAddMessage();
                    }
                  }}
                />
                <p className="text-white text-end text-sm mt-1">
                  {newMessage.length} tokens
                </p>
              </div>

              <div>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                  modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
                >
                  <SortableContext items={sortableItems} strategy={verticalListSortingStrategy}>
                    <div className="space-y-4 mt-4 max-h-[500px] h-full overflow-y-auto">
                      {messages.map((message, idx) => (
                        <SortableMessage
                          key={`message-${idx}`}
                          id={`message-${idx}`}
                          message={message}
                          index={idx}
                          onDelete={() => handleDeleteMessage(idx)}
                          onUpdate={(updatedMessage) => handleUpdateMessage(idx, updatedMessage)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>

              {messages.length === 0 ||
                messages.every((msg) => !msg.trim()) ? (
                <div className="text-center text-gray-500 py-8">
                  <p>No messages added yet.</p>
                  <p className="text-sm mt-2">Add your first message using the input above.</p>
                </div>
              ) : null}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Textarea
        value={messages[0] ?? ""}
        className={cn(
          meta.touched && meta.error && "bg-red-500/20 border-red-500 focus-visible:border-red-500"
        )}
        placeholder={placeholder}
        onChange={handleFirstMessageChange}
        // minRows={3}
        id={name}
        autoComplete="off"
        aria-label={label}
      />
      <div className="flex justify-between items-center text-xs px-1 text-white">
        <span
          id={`${name}-error`}
          className={cn(
            "text-destructive",
            meta.touched && meta.error ? "visible" : "invisible"
          )}
        >
          {meta.error || "placeholder"}
        </span>
        {tokens === true && (
          <span
            className={cn(
              meta.touched && meta.error && "text-destructive",
            )}
          >
            {tokenCount} Tokens
          </span>
        )}
      </div>
    </div>
  );
};

interface SortableMessageProps {
  id: string;
  message: string;
  index: number;
  onDelete: () => void;
  onUpdate: (updatedMessage: string) => void;
}

const SortableMessage: React.FC<SortableMessageProps> = ({
  id,
  message,
  index,
  onDelete,
  onUpdate
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(message);

  useEffect(() => {
    setEditedMessage(message);
  }, [message]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
    background: isDragging ? '#23272f' : undefined,
  };

  const handleSave = () => {
    if (editedMessage.trim()) {
      onUpdate(editedMessage);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedMessage(message);
    setIsEditing(false);
  };

  // When press Enter (not shift+Enter) while editing, save
  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-testid={`sortable-message-item-${index}`}
    >
      <div className="flex items-center justify-between gap-3 border border-primary rounded-2xl px-4 py-2 cursor-pointer bg-background">
        {isEditing ? (
          <div className="flex-1">
            <Textarea
              value={editedMessage}
              onChange={(e) => setEditedMessage(e.target.value)}
              className="min-h-[60px]"
              autoFocus
              // minRows={2}
              // maxRows={5}
              aria-label={`Edit message ${index + 1}`}
              onKeyDown={handleTextareaKeyDown}
            />
            <div className="flex gap-2 mt-2">
              <Button size="sm" onClick={handleSave} disabled={!editedMessage.trim()}>
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <ToolTipElement discription={message}>
              <div
                className="text-white line-clamp-3 flex-1 cursor-text"
                onClick={() => setIsEditing(true)}
                tabIndex={0}
                role="button"
                aria-label={`Edit message ${index + 1}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setIsEditing(true);
                }}
              >
                <span className='font-bold'>{index + 1}.</span> {message}
              </div>
            </ToolTipElement>
            <div className='flex items-center h-4 gap-x-1'>
              <Button
                onClick={onDelete}
                variant={"ghost"}
                size={"icon"}
                aria-label={`Delete message ${index + 1}`}
                tabIndex={0}
              >
                <Trash2 className="w-5 h-5 text-white" />
              </Button>
              <Separator orientation="vertical" className='bg-white' />
              <Button
                {...attributes}
                {...listeners}
                variant={"ghost"}
                size={"icon"}
                className="cursor-grab active:cursor-grabbing"
                aria-label={`Drag row ${index + 1}`}
                tabIndex={0}
              >
                <GripVertical className='text-white' />
              </Button>
            </div>
          </>
        )}
      </div>
      {!isEditing && (
        <p className="text-white text-end text-sm mt-1 mr-1" aria-label={`Token count for message ${index + 1}`}>
          {message.length} tokens
        </p>
      )}
    </div>
  );
};

export default MessageListManager;