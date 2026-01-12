"use client";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import Container from "@/components/elements/container";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { PaginationComponent } from "@/components/elements/pagination-element";
import CharacterCard from "@/components/cards/character-card";
import CharacterCardSkeleton from "../cards-skeletons/character-card-skeleton";
import ErrorEmptyState from "../elements/error-empty-state";
import SearchField from "../elements/search-field";
import { ToggleSwitch } from "../elements/toggle-switch";
import Rating from "../elements/rating";
import { useListCharacters, useDuplicateCharacter, useDeleteCharacter, useImportCharacter, useBulkImportCharacters, type CharacterListFilters } from "@/hooks";
import GlobalLoader from "../elements/global-loader";
import type { Character } from "@/lib/api/characters";
import MultiSelectFilter from "../elements/multi-select-filter";
import ImportCharacterDialog from "../elements/import-character-dialog";

// Utility for tab mapping (avoids duplicate strings)
const TABS = [
  { label: "All", value: "all" },
  { label: "Public", value: "public" },
  { label: "Saved", value: "saved" },
  { label: "Private", value: "private" },
  { label: "Favourites", value: "favourite" },
];

const SORT_OPTIONS = [
  {
    label: "A - Z",
    sortBy: "name",
    sortOrder: "asc" as const,
  },
  {
    label: "Z - A",
    sortBy: "name",
    sortOrder: "desc" as const,
  },
  {
    label: "Oldest to Newest",
    sortBy: "createdAt",
    sortOrder: "asc" as const,
  },
  {
    label: "Newest to Oldest",
    sortBy: "createdAt",
    sortOrder: "desc" as const,
  },
];

const RATINGS = [5, 4, 3, 2, 1];

const CharacterPage = () => {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const [ratingFilter, setRatingFilter] = useState<"SFW" | "NSFW" | undefined>("SFW");
  const [sortBy, setSortBy] = useState<"createdAt" | "updatedAt" | "name" | "chatCount">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isFilterChanging, setIsFilterChanging] = useState(false);
  const [selectedCharacters, setSelectedCharacters] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState<"only" | "with-current-chat" | "with-all-chats" | null>(null);
  const [includeTags, setIncludeTags] = useState<string[]>([]);
  const [excludeTags, setExcludeTags] = useState<string[]>([]);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [bulkImportDialogOpen, setBulkImportDialogOpen] = useState(false);

  // Handle debounced search change
  const handleDebouncedSearch = useCallback((value: string) => {
    setDebouncedSearchQuery(value);
    setPage(1);
  }, []);

  const handleSort = useCallback(
    (sortBy: "createdAt" | "updatedAt" | "name" | "chatCount", sortOrder: "asc" | "desc") => {
      setIsFilterChanging(true);
      setSortBy(sortBy);
      setSortOrder(sortOrder);
      setPage(1);
    },
    []
  );

  const onTabChange = useCallback(
    (value: string) => {
      setIsFilterChanging(true);
      setActiveTab(value);
      setPage(1);
    },
    []
  );

  const handleRatingChange = useCallback((value: string) => {
    setIsFilterChanging(true);
    setRatingFilter(value as "SFW" | "NSFW" | undefined);
    setPage(1);
  }, []);

  const handleIncludeTagsChange = useCallback((tags: string[]) => {
    setIsFilterChanging(true);
    setIncludeTags(tags);
    setPage(1);
  }, []);

  const handleExcludeTagsChange = useCallback((tags: string[]) => {
    setIsFilterChanging(true);
    setExcludeTags(tags);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((p: number) => {
    setPage(p);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  // Handle character selection
  const handleCharacterSelect = useCallback((characterId: string, isSelected: boolean) => {
    setSelectedCharacters((prev) => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(characterId);
      } else {
        newSet.delete(characterId);
      }
      return newSet;
    });
  }, []);

  const filters = useMemo<CharacterListFilters>(() => {

    if (activeTab === "all") {
      const allFilters: CharacterListFilters = {
        page,
        limit: 10,
        sortBy,
        sortOrder,
        rating: ratingFilter
      };
      if (debouncedSearchQuery.trim()) {
        allFilters.search = debouncedSearchQuery.trim();
      }
      if (includeTags.length > 0) {
        allFilters.tags = includeTags;
      }
      if (excludeTags.length > 0) {
        allFilters.excludeTags = excludeTags;
      }
      return allFilters;
    }

    const baseFilters: CharacterListFilters = {
      page,
      limit: 20,
      sortBy,
      sortOrder,
    };

    if (ratingFilter) {
      baseFilters.rating = ratingFilter;
    }

    if (debouncedSearchQuery.trim()) {
      baseFilters.search = debouncedSearchQuery.trim();
    }

    if (includeTags.length > 0) {
      baseFilters.tags = includeTags;
    }

    if (excludeTags.length > 0) {
      baseFilters.excludeTags = excludeTags;
    }

    switch (activeTab) {
      case "public":
        baseFilters.visibility = "public";
        break;
      case "private":
        baseFilters.visibility = "private";
        break;
      case "favourite":
        baseFilters.isFavourite = true;
        break;
      case "saved":
        baseFilters.isSaved = true;
        break;
      default:
        break;
    }
    return baseFilters;
  }, [page, activeTab, debouncedSearchQuery, ratingFilter, sortBy, sortOrder, includeTags, excludeTags]);

  const {
    characters,
    isLoading,
    isError,
    error,
    pagination,
    totalPages,
    refetch,
  } = useListCharacters({
    filters,
    showErrorToast: true,
  });

  const {
    duplicateCharactersBatch,
    isLoading: isDuplicating,
  } = useDuplicateCharacter({
    onSuccess: () => {
      setSelectedCharacters(new Set()); // Clear selection after duplication
      refetch(); // Refresh the list
    },
  });

  const {
    importCharacter,
    isLoading: isImporting,
  } = useImportCharacter({
    onSuccess: () => {
      setImportDialogOpen(false);
      refetch(); // Refresh the list
    },
  });

  const {
    bulkImportCharacters,
    isLoading: isBulkImporting,
  } = useBulkImportCharacters({
    onSuccess: () => {
      setBulkImportDialogOpen(false);
      refetch(); // Refresh the list
    },
  });

  const {
    deleteCharactersBatch,
    isLoading: isDeleting,
  } = useDeleteCharacter({
    onSuccess: () => {
      setSelectedCharacters(new Set()); // Clear selection after deletion
      setDeleteDialogOpen(false);
      setDeleteMode(null);
      refetch(); // Refresh the list
    },
  });

  // Handle duplicate selected characters (optimized batch operation)
  const handleDuplicateSelected = useCallback(() => {
    if (selectedCharacters.size === 0) {
      return;
    }

    // Use batch duplication to avoid multiple API calls
    duplicateCharactersBatch(Array.from(selectedCharacters));
  }, [selectedCharacters, duplicateCharactersBatch]);

  // Handle delete selected characters
  const handleDeleteClick = useCallback((mode: "only" | "with-current-chat" | "with-all-chats") => {
    if (selectedCharacters.size === 0) {
      return;
    }
    setDeleteMode(mode);
    setDeleteDialogOpen(true);
  }, [selectedCharacters.size]);

  // Confirm and execute delete
  const handleConfirmDelete = useCallback(() => {
    if (selectedCharacters.size === 0 || !deleteMode) {
      return;
    }

    // Note: The backend automatically deletes associated chats due to cascade delete
    // The deleteMode is kept for UI clarity, but all modes perform the same operation
    deleteCharactersBatch(Array.from(selectedCharacters));
  }, [selectedCharacters, deleteMode, deleteCharactersBatch]);

  useEffect(() => {
    if (!isLoading && characters) {
      setIsFilterChanging(false);
    }
  }, [isLoading, characters]);

  const skeletonCount = pagination?.limit || 20;

  return (
    <Container className="h-full flex flex-col">
      <GlobalLoader isLoading={isFilterChanging && isLoading} />

      <div className="max-w-3xl w-full mx-auto">
        <div className="space-y-4">

          <div className="flex items-center gap-x-4 w-full">
            <SearchField
              placeholder="Search by Character name or description"
              value={searchQuery}
              onChange={setSearchQuery}
              onDebouncedChange={handleDebouncedSearch}
              debounceMs={500}
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="rounded-full">
                  Character Menu <Menu className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72" align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem>Show Favorites only</DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Set Default View</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem>All Characters</DropdownMenuItem>
                        <DropdownMenuItem>Public Characters</DropdownMenuItem>
                        <DropdownMenuItem>Saved Characters</DropdownMenuItem>
                        <DropdownMenuItem>Private Characters</DropdownMenuItem>
                        <DropdownMenuItem>Favourite Characters</DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Alphabetical Order</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        {SORT_OPTIONS.slice(0, 2).map((option: any) => (
                          <DropdownMenuItem
                            key={option.label}
                            onClick={() => handleSort(option.sortBy, option.sortOrder)}
                          >
                            {option.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>

                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Date Order</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        {SORT_OPTIONS.slice(2).map(option => (
                          <DropdownMenuItem
                            key={option.label}
                            onClick={() => handleSort(option.sortBy as "createdAt" | "updatedAt" | "name" | "chatCount", option.sortOrder)}
                          >
                            {option.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>By Rating</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent className="text-white">
                        {RATINGS.map((star) => (
                          <DropdownMenuItem key={star}>
                            <div className="flex items-center gap-2">
                              <Rating value={star} size={14} readOnly />
                              <span className="text-xs">({star} Star)</span>
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>

                  <DropdownMenuItem
                    onClick={handleDuplicateSelected}
                    disabled={selectedCharacters.size === 0 || isDuplicating}
                  >
                    {isDuplicating
                      ? `Duplicating ${selectedCharacters.size} character(s)...`
                      : `Duplicate Selected Character(s) (${selectedCharacters.size})`}
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Create / Import</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <Link href="/characters/create" >
                          <DropdownMenuItem >Create Character</DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem onClick={() => setImportDialogOpen(true)}>
                          Import Character
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled onClick={() => setBulkImportDialogOpen(true)}>
                          Bulk Import Characters
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Delete Character</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick("only")}
                          disabled={selectedCharacters.size === 0 || isDeleting}
                        >
                          Delete selected Character(s) only
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick("with-current-chat")}
                          // disabled={selectedCharacters.size === 0 || isDeleting}
                          disabled
                        >
                          Delete selected Character(s) and current chat
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick("with-all-chats")}
                          // disabled={selectedCharacters.size === 0 || isDeleting}
                          disabled
                        >
                          Delete selected Character(s), saved chat and current chat
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Tags & Rating Filter */}
          <div className="flex items-center justify-center gap-4 w-full">
            <div className="flex-1 flex gap-x-4 ">
              <div className="w-1/2">
                <MultiSelectFilter
                  placeholder="Search by Character tags"
                  value={includeTags}
                  onChange={handleIncludeTagsChange}
                  defaultCategory={ratingFilter || "SFW"}
                />
              </div>
              <div className="w-1/2">
                <MultiSelectFilter
                  placeholder="Tags to exclude from search"
                  value={excludeTags}
                  onChange={handleExcludeTagsChange}
                  defaultCategory={ratingFilter || "SFW"}
                />
              </div>
            </div>
            <ToggleSwitch
              options={[
                { label: "NSFW", value: "NSFW" },
                { label: "SFW", value: "SFW" },
              ]}
              defaultValue={ratingFilter || "SFW"}
              onChange={handleRatingChange}
            />
          </div>
        </div>
      </div>

      {/* Tabbed view */}
      <Tabs
        value={activeTab}
        onValueChange={onTabChange}
        className="mt-4 space-y-2 flex-1"
      >
        <TabsList className="w-full">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={activeTab} className="mt-4">
          {isLoading && (!characters || characters.length === 0) ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: skeletonCount }).map((_, index) => (
                <CharacterCardSkeleton key={`skeleton-${index}`} />
              ))}
            </div>
          ) : isError ? (
            <ErrorEmptyState
              type="error"
              error={error}
              onRetry={refetch}
              title="Failed to Load Characters"
              description="We encountered an issue while fetching characters. Please try again."
            />
          ) : !characters || characters.length === 0 ? (
            <ErrorEmptyState
              type="empty"
              title="No Characters Found"
              description="We couldn't find any characters matching your criteria. Try adjusting your filters or search query."
            />
          ) : (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 transition-opacity duration-300"
              style={{ opacity: isLoading ? 0.5 : 1 }}
            >
              {characters.map((character) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  isSelected={selectedCharacters.has(character.id)}
                  onSelect={handleCharacterSelect}
                />
              ))}
              {/* Show skeletons while loading more */}
              {isLoading && characters.length > 0 && (
                <>
                  {Array.from({ length: Math.min(4, skeletonCount - characters.length) }).map((_, index) => (
                    <CharacterCardSkeleton key={`loading-skeleton-${index}`} />
                  ))}
                </>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      {!isLoading && !isError && pagination && totalPages && totalPages > 1 && (
        <div className="mt-6">
          <PaginationComponent
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-primary/30 backdrop-blur-sm border-primary">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Character(s)?</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedCharacters.size === 1 ? (
                <>
                  Are you sure you want to delete this character? This action cannot be undone.
                  {deleteMode === "with-current-chat" || deleteMode === "with-all-chats" ? (
                    <span className="block mt-2 font-semibold text-destructive">
                      All associated chats will also be permanently deleted.
                    </span>
                  ) : null}
                </>
              ) : (
                <>
                  Are you sure you want to delete {selectedCharacters.size} character(s)? This action cannot be undone.
                  {deleteMode === "with-current-chat" || deleteMode === "with-all-chats" ? (
                    <span className="block mt-2 font-semibold text-destructive">
                      All associated chats will also be permanently deleted.
                    </span>
                  ) : null}
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Import Character Dialog */}
      <ImportCharacterDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onImport={importCharacter}
        isLoading={isImporting}
        isBulk={false}
      />

      {/* Bulk Import Characters Dialog */}
      <ImportCharacterDialog
        open={bulkImportDialogOpen}
        onOpenChange={setBulkImportDialogOpen}
        onImport={bulkImportCharacters}
        isLoading={isBulkImporting}
        isBulk={true}
      />
    </Container>
  );
};

export default CharacterPage;