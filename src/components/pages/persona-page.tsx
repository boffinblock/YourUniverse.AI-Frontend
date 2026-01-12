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
import PersonaCard from "@/components/cards/persona-card";
import PersonaCardSkeleton from "../cards-skeletons/persona-card-skeleton";
import ErrorEmptyState from "../elements/error-empty-state";
import SearchField from "../elements/search-field";
import { ToggleSwitch } from "../elements/toggle-switch";
import Rating from "../elements/rating";
import { useListPersonas, useDeletePersona, type PersonaListFilters } from "@/hooks";
import GlobalLoader from "../elements/global-loader";
import type { Persona } from "@/lib/api/personas";
import MultiSelectFilter from "../elements/multi-select-filter";

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

const PersonaPage = () => {
    const [page, setPage] = useState(1);
    const [activeTab, setActiveTab] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
    const [ratingFilter, setRatingFilter] = useState<"SFW" | "NSFW" | undefined>("SFW");
    const [sortBy, setSortBy] = useState<"createdAt" | "updatedAt" | "name">("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [isFilterChanging, setIsFilterChanging] = useState(false);
    const [selectedPersonas, setSelectedPersonas] = useState<Set<string>>(new Set());
    const [includeTags, setIncludeTags] = useState<string[]>([]);
    const [excludeTags, setExcludeTags] = useState<string[]>([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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

    // Handle persona selection
    const handlePersonaSelect = useCallback((personaId: string, isSelected: boolean) => {
        setSelectedPersonas((prev) => {
            const newSet = new Set(prev);
            if (isSelected) {
                newSet.add(personaId);
            } else {
                newSet.delete(personaId);
            }
            return newSet;
        });
    }, []);

    const filters = useMemo<PersonaListFilters>(() => {
        if (activeTab === "all") {
            const allFilters: PersonaListFilters = {
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

        const baseFilters: PersonaListFilters = {
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
        personas,
        isLoading,
        isError,
        error,
        pagination,
        totalPages,
        refetch,
    } = useListPersonas({
        filters,
        showErrorToast: true,
    });

    const {
        deletePersonasBatch,
        isLoading: isDeleting,
    } = useDeletePersona({
        onSuccess: () => {
            setSelectedPersonas(new Set()); // Clear selection after deletion
            setDeleteDialogOpen(false);
            refetch(); // Refresh the list
        },
    });

    // Handle delete selected personas
    const handleDeleteClick = useCallback(() => {
        if (selectedPersonas.size === 0) {
            return;
        }
        setDeleteDialogOpen(true);
    }, [selectedPersonas.size]);

    // Confirm and execute delete
    const handleConfirmDelete = useCallback(() => {
        if (selectedPersonas.size === 0) {
            return;
        }

        deletePersonasBatch(Array.from(selectedPersonas));
    }, [selectedPersonas, deletePersonasBatch]);

    useEffect(() => {
        if (!isLoading && personas) {
            setIsFilterChanging(false);
        }
    }, [isLoading, personas]);

    const skeletonCount = pagination?.limit || 20;

    return (
        <Container className="h-full flex flex-col">
            <GlobalLoader isLoading={isFilterChanging && isLoading} />

            <div className="max-w-3xl w-full mx-auto">
                <div className="space-y-4">
                    <div className="flex items-center gap-x-4 w-full">
                        <SearchField
                            placeholder="Search for Persona name or description"
                            value={searchQuery}
                            onChange={setSearchQuery}
                            onDebouncedChange={handleDebouncedSearch}
                            debounceMs={500}
                        />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="rounded-full">
                                    Persona Menu <Menu className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-72" align="end">
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>Show Favorites Only</DropdownMenuItem>
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>Set Default View</DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuItem>All Personas</DropdownMenuItem>
                                                <DropdownMenuItem>Public Personas</DropdownMenuItem>
                                                <DropdownMenuItem>Saved Personas</DropdownMenuItem>
                                                <DropdownMenuItem>Private Personas</DropdownMenuItem>
                                                <DropdownMenuItem>Favourite Personas</DropdownMenuItem>
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
                                                <Link href="/personas/create" passHref>
                                                    <DropdownMenuItem>Create Persona</DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuItem>Import Single Persona</DropdownMenuItem>
                                                <DropdownMenuItem>Bulk Import Personas</DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>

                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>Delete Persona</DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuItem
                                                    onClick={handleDeleteClick}
                                                    disabled={selectedPersonas.size === 0 || isDeleting}
                                                >
                                                    Delete Selected Persona(s) {selectedPersonas.size > 0 && `(${selectedPersonas.size})`}
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
                                    placeholder="Search by Persona tags"
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
                    {isLoading && (!personas || personas.length === 0) ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {Array.from({ length: skeletonCount }).map((_, index) => (
                                <PersonaCardSkeleton key={`skeleton-${index}`} />
                            ))}
                        </div>
                    ) : isError ? (
                        <ErrorEmptyState
                            type="error"
                            error={error}
                            onRetry={refetch}
                            title="Failed to Load Personas"
                            description="We encountered an issue while fetching personas. Please try again."
                        />
                    ) : !personas || personas.length === 0 ? (
                        <ErrorEmptyState
                            type="empty"
                            title="No Personas Found"
                            description="We couldn't find any personas matching your criteria. Try adjusting your filters or search query."
                        />
                    ) : (
                        <div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 transition-opacity duration-300"
                            style={{ opacity: isLoading ? 0.5 : 1 }}
                        >
                            {personas.map((persona) => (
                                <PersonaCard
                                    key={persona.id}
                                    persona={persona}
                                    isSelected={selectedPersonas.has(persona.id)}
                                    onSelect={handlePersonaSelect}
                                />
                            ))}
                            {/* Show skeletons while loading more */}
                            {isLoading && personas.length > 0 && (
                                <>
                                    {Array.from({ length: Math.min(4, skeletonCount - personas.length) }).map((_, index) => (
                                        <PersonaCardSkeleton key={`loading-skeleton-${index}`} />
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
                        <AlertDialogTitle className="text-white">Delete Persona(s)?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {selectedPersonas.size === 1 ? (
                                <>
                                    Are you sure you want to delete this persona? This action cannot be undone.
                                </>
                            ) : (
                                <>
                                    Are you sure you want to delete {selectedPersonas.size} persona(s)? This action cannot be undone.
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
        </Container>
    );
};

export default PersonaPage;
