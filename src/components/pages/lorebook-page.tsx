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
import LorebookCard from "@/components/cards/lorebook-card";
import LorebookCardSkeleton from "../cards-skeletons/lorebook-card-skeleton";
import ErrorEmptyState from "../elements/error-empty-state";
import SearchField from "../elements/search-field";
import { ToggleSwitch } from "../elements/toggle-switch";
import Rating from "../elements/rating";
import { useListLorebooks, useDeleteLorebook, useImportLorebook, type LorebookListFilters } from "@/hooks";
import GlobalLoader from "../elements/global-loader";
import type { Lorebook } from "@/lib/api/lorebooks";
import MultiSelectFilter from "../elements/multi-select-filter";
import ImportLorebookDialog from "../elements/import-lorebook-dialog";
import Footer from "@/components/layout/footer";

// Utility for tab mapping
const TABS = [
    { label: "All", value: "all" },
    { label: "Public", value: "public" },
    { label: "Saved", value: "saved" },
    { label: "Private", value: "private" },
    { label: "Favourites", value: "favourite" },
];

const SORT_OPTIONS: Array<{
    label: string;
    sortBy: "createdAt" | "updatedAt" | "name";
    sortOrder: "asc" | "desc";
}> = [
        {
            label: "A - Z",
            sortBy: "name",
            sortOrder: "asc",
        },
        {
            label: "Z - A",
            sortBy: "name",
            sortOrder: "desc",
        },
        {
            label: "Oldest to Newest",
            sortBy: "createdAt",
            sortOrder: "asc",
        },
        {
            label: "Newest to Oldest",
            sortBy: "createdAt",
            sortOrder: "desc",
        },
    ];

const RATINGS = [5, 4, 3, 2, 1];

const LorebookPage = () => {
    const [page, setPage] = useState(1);
    const [activeTab, setActiveTab] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
    const [ratingFilter, setRatingFilter] = useState<"SFW" | "NSFW" | undefined>("SFW");
    const [sortBy, setSortBy] = useState<"createdAt" | "updatedAt" | "name">("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [isFilterChanging, setIsFilterChanging] = useState(false);
    const [selectedLorebooks, setSelectedLorebooks] = useState<Set<string>>(new Set());
    const [includeTags, setIncludeTags] = useState<string[]>([]);
    const [excludeTags, setExcludeTags] = useState<string[]>([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [importDialogOpen, setImportDialogOpen] = useState(false);
    const [bulkImportDialogOpen, setBulkImportDialogOpen] = useState(false);

    // Handle debounced search change
    const handleDebouncedSearch = useCallback((value: string) => {
        setDebouncedSearchQuery(value);
        setPage(1);
    }, []);

    const handleSort = useCallback(
        (sortBy: "createdAt" | "updatedAt" | "name", sortOrder: "asc" | "desc") => {
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

    // Handle lorebook selection
    const handleLorebookSelect = useCallback((lorebookId: string, isSelected: boolean) => {
        setSelectedLorebooks((prev) => {
            const newSet = new Set(prev);
            if (isSelected) {
                newSet.add(lorebookId);
            } else {
                newSet.delete(lorebookId);
            }
            return newSet;
        });
    }, []);

    const filters = useMemo<LorebookListFilters>(() => {
        if (activeTab === "all") {
            const allFilters: LorebookListFilters = {
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

        const baseFilters: LorebookListFilters = {
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
        lorebooks,
        isLoading,
        isError,
        error,
        pagination,
        totalPages,
        refetch,
    } = useListLorebooks({
        filters,
        showErrorToast: true,
    });

    const {
        deleteLorebooksBatch,
        isLoading: isDeleting,
    } = useDeleteLorebook({
        onSuccess: () => {
            setSelectedLorebooks(new Set()); // Clear selection after deletion
            setDeleteDialogOpen(false);
            refetch(); // Refresh the list
        },
    });

    const { importLorebook, isImporting } = useImportLorebook({ showToasts: true });

    const handleSingleImport = useCallback(
        (files: File[]) => {
            if (files.length > 0) {
                importLorebook(files[0]).then(() => {
                    setImportDialogOpen(false);
                    refetch();
                });
            }
        },
        [importLorebook, refetch]
    );

    const handleBulkImport = useCallback(
        async (files: File[]) => {
            for (const file of files) {
                await importLorebook(file);
            }
            setBulkImportDialogOpen(false);
            refetch();
        },
        [importLorebook, refetch]
    );

    // Handle delete selected lorebooks
    const handleDeleteClick = useCallback(() => {
        if (selectedLorebooks.size === 0) {
            return;
        }
        setDeleteDialogOpen(true);
    }, [selectedLorebooks.size]);

    // Confirm and execute delete
    const handleConfirmDelete = useCallback(() => {
        if (selectedLorebooks.size === 0) {
            return;
        }

        deleteLorebooksBatch(Array.from(selectedLorebooks));
    }, [selectedLorebooks, deleteLorebooksBatch]);

    useEffect(() => {
        if (!isLoading && lorebooks) {
            setIsFilterChanging(false);
        }
    }, [isLoading, lorebooks]);

    const skeletonCount = pagination?.limit || 20;

    return (
        <Container className="min-h-[calc(100vh-8rem)] flex flex-col relative">
            <GlobalLoader isLoading={isFilterChanging && isLoading} />

            {/* Fixed Header Section */}
            <div className="flex-none p-4 pb-0 z-10 ">
                <div className="max-w-3xl w-full mx-auto space-y-4">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-x-4 w-full">
                        <SearchField
                            placeholder="Search for Lorebook name or description"
                            value={searchQuery}
                            onChange={setSearchQuery}
                            onDebouncedChange={handleDebouncedSearch}
                            debounceMs={500}
                        />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="rounded-full shrink-0">
                                    Lorebook Menu <Menu className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-72" align="end">
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>Show Favorites Only</DropdownMenuItem>
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>Set Default View</DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuItem>All Lorebooks</DropdownMenuItem>
                                                <DropdownMenuItem>Public Lorebooks</DropdownMenuItem>
                                                <DropdownMenuItem>Saved Lorebooks</DropdownMenuItem>
                                                <DropdownMenuItem>Private Lorebooks</DropdownMenuItem>
                                                <DropdownMenuItem>Favourite Lorebooks</DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>Alphabetical Order</DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                {SORT_OPTIONS.slice(0, 2).map((option) => (
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
                                                        onClick={() => handleSort(option.sortBy, option.sortOrder)}
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

                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>Create / Import</DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                <Link href="/lorebooks/create" passHref>
                                                    <DropdownMenuItem>Create Lorebook</DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuItem onClick={() => setImportDialogOpen(true)}>
                                                    Import Single Lorebook
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setBulkImportDialogOpen(true)}>
                                                    Bulk Import Lorebooks
                                                </DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>

                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>Delete Lorebook</DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuItem
                                                    onClick={handleDeleteClick}
                                                    disabled={selectedLorebooks.size === 0 || isDeleting}
                                                >
                                                    Delete Selected Lorebook(s) {selectedLorebooks.size > 0 && `(${selectedLorebooks.size})`}
                                                </DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Tags & Rating Filter */}
                    <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 lg:gap-4 w-full">
                        <div className="flex flex-col lg:flex-row flex-1 gap-3 lg:gap-x-4 w-full">
                            <div className="w-full lg:w-1/2 min-w-0">
                                <MultiSelectFilter
                                    placeholder="Search by Lorebook tags"
                                    value={includeTags}
                                    onChange={handleIncludeTagsChange}
                                    defaultCategory={ratingFilter || "SFW"}
                                    className="rounded-full"
                                />
                            </div>
                            <div className="w-full lg:w-1/2 min-w-0">
                                <MultiSelectFilter
                                    placeholder="Tags to exclude from search"
                                    value={excludeTags}
                                    onChange={handleExcludeTagsChange}
                                    defaultCategory={ratingFilter || "SFW"}
                                    className="rounded-full"
                                />
                            </div>
                        </div>
                        <div className="shrink-0 w-full sm:w-auto">
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
            </div>

            {/* Scrollable Content Section - content + pagination scroll together */}
            <div className="flex-1 min-h-0 overflow-y-auto flex flex-col">
                <Tabs
                    value={activeTab}
                    onValueChange={onTabChange}
                    className="flex flex-col min-h-0 flex-1"
                >
                    <div className=" py-3 pt-5 sticky top-0 z-10 w-full overflow-x-auto">
                        <TabsList className="w-full min-w-max bg-primary/20 flex-nowrap justify-start sm:justify-center">
                            {TABS.map((tab) => (
                                <TabsTrigger key={tab.value} value={tab.value} className="whitespace-nowrap shrink-0">
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>
                    <TabsContent value={activeTab} className="py-2 px-3 sm:px-4 flex-1 min-h-0 mt-0">
                        {isLoading && (!lorebooks || lorebooks.length === 0) ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4">
                                {Array.from({ length: skeletonCount }).map((_, index) => (
                                    <LorebookCardSkeleton key={`skeleton-${index}`} />
                                ))}
                            </div>
                        ) : isError ? (
                            <ErrorEmptyState
                                type="error"
                                error={error}
                                onRetry={refetch}
                                title="Failed to Load Lorebooks"
                                description="We encountered an issue while fetching lorebooks. Please try again."
                            />
                        ) : !lorebooks || lorebooks.length === 0 ? (
                            <ErrorEmptyState
                                type="empty"
                                title="No Lorebooks Found"
                                description="We couldn't find any lorebooks matching your criteria. Try adjusting your filters or search query."
                            />
                        ) : (
                            <div
                                className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 transition-opacity duration-300"
                                style={{ opacity: isLoading ? 0.5 : 1 }}
                            >
                                {lorebooks.map((lorebook) => (
                                    <LorebookCard
                                        key={lorebook.id}
                                        lorebook={lorebook}
                                        isSelected={selectedLorebooks.has(lorebook.id)}
                                        onSelect={handleLorebookSelect}
                                    />
                                ))}
                                {/* Show skeletons while loading more */}
                                {isLoading && lorebooks.length > 0 && (
                                    <>
                                        {Array.from({ length: Math.min(4, skeletonCount - lorebooks.length) }).map((_, index) => (
                                            <LorebookCardSkeleton key={`loading-skeleton-${index}`} />
                                        ))}
                                    </>
                                )}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>

                {/* Pagination - inside scrollable area, always visible when scrolling down */}
                {!isLoading && !isError && pagination && totalPages && totalPages > 1 && (
                    <div className="py-4 sm:py-6 px-2 flex justify-center">
                        <PaginationComponent
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>

            {/* Fixed Footer */}
            <div className="flex-none mt-auto">
                <Footer />
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent className="bg-primary/30 backdrop-blur-sm border-primary">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Delete Lorebook(s)?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {selectedLorebooks.size === 1 ? (
                                <>
                                    Are you sure you want to delete this lorebook? This action cannot be undone and all associated entries will be permanently deleted.
                                </>
                            ) : (
                                <>
                                    Are you sure you want to delete {selectedLorebooks.size} lorebook(s)? This action cannot be undone and all associated entries will be permanently deleted.
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

            {/* Import Lorebook Dialog */}
            <ImportLorebookDialog
                open={importDialogOpen}
                onOpenChange={setImportDialogOpen}
                onImport={handleSingleImport}
                isLoading={isImporting}
                isBulk={false}
            />

            {/* Bulk Import Lorebooks Dialog */}
            <ImportLorebookDialog
                open={bulkImportDialogOpen}
                onOpenChange={setBulkImportDialogOpen}
                onImport={handleBulkImport}
                isLoading={isImporting}
                isBulk={true}
            />
        </Container>
    );
};

export default LorebookPage;
