"use client";

import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import type { ChatStatus } from "ai";

import {
  Attachment,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from "@/components/ai-elements/attachments";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputFooter,
  PromptInputHeader,
  PromptInputProvider,
  PromptInputSelect,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectTrigger,
  PromptInputSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
} from "@/components/ai-elements/prompt-input";
import { useGetModels } from "@/hooks/models";
import { useGetChat, useUpdateChat } from "@/hooks/chat";
import { memo, useCallback, useEffect, useState } from "react";
import Footer from "../layout/footer";

const SUBMITTING_TIMEOUT = 200;
const STREAMING_TIMEOUT = 2000;

interface AttachmentItemProps {
  attachment: {
    id: string;
    type: "file";
    filename?: string;
    mediaType?: string;
    url: string;
  };
  onRemove: (id: string) => void;
}

const AttachmentItem = memo(({ attachment, onRemove }: AttachmentItemProps) => {
  const handleRemove = useCallback(
    () => onRemove(attachment.id),
    [onRemove, attachment.id]
  );
  return (
    <Attachment
      data={{
        ...attachment,
        mediaType: attachment.mediaType ?? "",
      }}
      key={attachment.id}
      onRemove={handleRemove}
    >
      <AttachmentPreview />
      <AttachmentRemove />
    </Attachment>
  );
});

AttachmentItem.displayName = "AttachmentItem";

const PromptInputAttachmentsDisplay = () => {
  const attachments = usePromptInputAttachments();

  const handleRemove = useCallback(
    (id: string) => attachments.remove(id),
    [attachments]
  );

  if (attachments.files.length === 0) {
    return null;
  }

  return (
    <Attachments className="p-1  ">
      {attachments.files.map((attachment) => (
        <AttachmentItem
          attachment={attachment}
          key={attachment.id}
          onRemove={handleRemove}
        />
      ))}
    </Attachments>
  );
};

interface ChatPanelProps {
  footer?: boolean;
  /** Chat ID for model sync and updates. When provided, model selection updates the chat. */
  chatId?: string;
  /** Called when user submits. Alias for onSubmit. */
  handleSubmit?: (message: PromptInputMessage) => void;
  /** Called when user submits a message. Uses AI SDK send when provided. */
  onSubmit?: (message: PromptInputMessage) => void;
  /** Stop the current streaming response. Uses AI SDK stop when provided. */
  stop?: () => void;
  /** Chat status from AI SDK useChat (submitted, streaming, ready, error). */
  status?: ChatStatus;
  /** Placeholder for the textarea. */
  placeholder?: string;
}

const ChatPanel = ({
  footer = true,
  chatId,
  onSubmit: onSubmitProp,
  handleSubmit: handleSubmitProp,
  stop: stopProp,
  status: statusProp,
  placeholder,
}: ChatPanelProps) => {
  const onSubmit = onSubmitProp ?? handleSubmitProp;
  const { models, defaultModel, isLoading: modelsLoading } = useGetModels();
  const { chat } = useGetChat({ chatId, enabled: !!chatId });
  const { updateChatAsync } = useUpdateChat({ showToasts: false });

  const [model, setModel] = useState<string>("");
  const [localStatus, setLocalStatus] = useState<
    "submitted" | "streaming" | "ready" | "error"
  >("ready");

  const status = statusProp ?? localStatus;

  // Initialize model: chat's modelId > default model > first model
  useEffect(() => {
    if (models.length === 0) return;
    const chatModelId = chat?.modelId;
    const defaultId = defaultModel?.id ?? models[0]?.id;
    const initial = chatModelId && models.some((m) => m.id === chatModelId)
      ? chatModelId
      : defaultId;
    if (initial && model !== initial) {
      setModel(initial);
    }
  }, [chat?.modelId, defaultModel?.id, models, model]);

  const handleModelSelect = useCallback(
    async (id: string) => {
      setModel(id);
      if (chatId && id) {
        try {
          await updateChatAsync({ chatId, data: { modelId: id } });
        } catch {
          // Error handled by hook
        }
      }
    },
    [chatId, updateChatAsync]
  );

  const handleSubmit = useCallback(
    (message: PromptInputMessage) => {
      const hasText = Boolean(message.text?.trim());
      const hasAttachments = Boolean(message.files?.length);

      if (!(hasText || hasAttachments)) {
        return;
      }

      if (onSubmit) {
        onSubmit(message);
      } else {
        setLocalStatus("submitted");
        setTimeout(() => setLocalStatus("streaming"), SUBMITTING_TIMEOUT);
        setTimeout(() => setLocalStatus("ready"), STREAMING_TIMEOUT);
      }
    },
    [onSubmit]
  );

  const handleStop = useCallback(() => {
    if (stopProp) {
      stopProp();
    }
  }, [stopProp]);

  return (
    <div className=" sticky bottom-0 ">
      <PromptInputProvider>
        <PromptInput globalDrop multiple onSubmit={handleSubmit}>
          <PromptInputHeader>
            <PromptInputAttachmentsDisplay />
          </PromptInputHeader>
          <PromptInputBody>
            <PromptInputTextarea placeholder={placeholder} />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              <PromptInputActionMenu>
                <PromptInputActionMenuTrigger className=" rounded-full" />
                <PromptInputActionMenuContent>
                  <PromptInputActionAddAttachments />
                </PromptInputActionMenuContent>
              </PromptInputActionMenu>
              {models.length > 0 && (
                <PromptInputSelect
                  value={model || defaultModel?.id || models.find((m) => m.isDefault)?.id || ""}
                  onValueChange={handleModelSelect}
                  disabled={modelsLoading}
                >
                  <PromptInputSelectTrigger>
                    <PromptInputSelectValue placeholder="Select model" />
                  </PromptInputSelectTrigger>
                  <PromptInputSelectContent>
                    {models.map((m) => (
                      <PromptInputSelectItem className="rounded-xl" key={m.id} value={m.id}>
                        {m.name}
                      </PromptInputSelectItem>
                    ))}
                  </PromptInputSelectContent>
                </PromptInputSelect>
              )}
            </PromptInputTools>
            <PromptInputSubmit
              status={status}
              onClick={
                (status === "submitted" || status === "streaming") && stopProp
                  ? (e) => {
                      e.preventDefault();
                      handleStop();
                    }
                  : undefined
              }
            />
          </PromptInputFooter>
        </PromptInput>
      </PromptInputProvider>
      {footer && <Footer />}
    </div>
  );
};

export default ChatPanel;
