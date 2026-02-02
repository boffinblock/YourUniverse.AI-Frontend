"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Folder, MoreVertical, Paperclip, Pencil, Trash2 } from "lucide-react";
import ChatPanel from "@/components/elements/chat-panel";
import Container from "@/components/elements/container";
import Footer from "@/components/layout/footer";
import { useGetFolder } from "@/hooks/folder";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

/** Placeholder type for folder chat (replace with API type when backend is ready) */
interface FolderChatItem {
  id: string;
  title: string;
  snippet: string;
  date: string;
}

/** Mock existing chats in folder – replace with useFolderChats() when API exists */
const MOCK_FOLDER_CHATS: FolderChatItem[] = [
  { id: "1", title: "Folder structure generation", snippet: "har endpoints ka alag middelware ho skat hai na", date: "Jan 28" },
  { id: "2", title: "Keyboard Error Discussion", snippet: "ghjghjghjhg", date: "Jan 12" },
];

/** UUID v4 pattern – extract folder id from param (handles legacy URLs like id-name) */
const FOLDER_ID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

function getFolderIdFromParam(param: string | undefined): string | undefined {
  if (!param) return undefined;
  const match = param.match(FOLDER_ID_REGEX);
  return match ? match[0] : param;
}

export default function FolderPage() {
  const params = useParams<{ id: string }>();
  const folderId = getFolderIdFromParam(params?.id);

  const { folder, isLoading } = useGetFolder({ folderId });
  const folderName = folder?.name ?? "Folder";
  const chats = MOCK_FOLDER_CHATS; // TODO: useFolderChats(folderId) when API exists

  return (
    <div className="flex-1 flex flex-col relative">
      <div className="flex-1">
        <Container className="h-full w-full pt-20 ">
          <div className={cn("flex-1 flex flex-col relative h-full ", chats.length <= 0 && " pt-40 ")}>
            {/* Header: folder name + Add files */}
            <div className="flex gap-x-2 items-center text-3xl min-w-0 mb-4">
              <Folder className="text-white shrink-0" />
              {isLoading ? (
                <Skeleton className="h-8 w-48 bg-white/10 rounded" />
              ) : (
                <h4 className="text-white font-thin truncate">{folderName}</h4>
              )}
            </div>


            {/* New chat input */}
            <div className="mb-6">
              <ChatPanel
                footer={false}
                placeholder={`New chat in ${folderName}`}
              />
            </div>

            {/* Existing chats list (when folder has chats) */}
            {chats && chats.length > 0 && folderId && (
              <div className="mt-4">
                <ul className="divide-y divide-primary/60  ">
                  {chats.map((chat) => (
                    <li
                      key={chat.id}
                      className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 py-3 px-2 hover:bg-primary/30 hover:backdrop-blur-2xl transition-colors rounded-lg"
                    >
                      <Link
                        href={`/folders/${folderId}-${folderName.toLowerCase().replace(/ /g, '-')}/c/${chat.id}`}
                        className="min-w-0 flex-1"
                      >
                        <p className="font-medium text-white truncate group-hover:text-white">
                          {chat.title}
                        </p>
                        <p className="text-sm text-white/60 truncate mt-0.5">
                          {chat.snippet}
                        </p>
                      </Link>
                      <div className="flex items-center gap-1 shrink-0 mt-1 sm:mt-0">
                        <span className="text-xs text-white/80 group-hover:hidden">
                          {chat.date}
                        </span>
                        <div className=" opacity-0 group-hover:opacity-100 ">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                type="button"
                                className="h-6 w-6 text-white/80 hover:text-white hover:bg-white/10"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="bg-[#1a1a1a] border-white/10 text-white"
                            >
                              <DropdownMenuItem className="cursor-pointer text-xs flex items-center gap-2 hover:bg-white/10">
                                <Pencil className="h-3 w-3" /> Rename
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer text-xs flex items-center gap-2 text-red-400 hover:bg-red-500/10 hover:text-red-400">
                                <Trash2 className="h-3 w-3" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="  w-full absolute  bottom-0 ">
              <Footer />
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
