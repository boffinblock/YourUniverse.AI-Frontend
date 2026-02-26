"use client"

import React, { useState, useCallback, useMemo } from 'react'
import { Menu } from 'lucide-react'

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
} from "@/components/ui/dropdown-menu"
import { Button } from '../ui/button'
import BackgroundCard from '../cards/background-card'
import BackgroundCardSkeleton from '../cards-skeletons/background-card-skeleton'
import { PaginationComponent } from '../elements/pagination-element'
import SearchField from '../elements/search-field'
import { ToggleSwitch } from '../elements/toggle-switch'
import { useListBackgrounds, useImportBackground } from '@/hooks/background'
import { setBackgroundDefault } from '@/lib/api/backgrounds'
import { toast } from 'sonner'
import ImportBackgroundDialog from '../elements/import-background-dialog'
import ErrorEmptyState from '../elements/error-empty-state'

const SKELETON_COUNT = 12
const GRID_COLS = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"

const BackgroundPage = () => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [tagSearch, setTagSearch] = useState('')
  const [debouncedTagSearch, setDebouncedTagSearch] = useState('')
  const [excludeTagSearch, setExcludeTagSearch] = useState('')
  const [debouncedExcludeTagSearch, setDebouncedExcludeTagSearch] = useState('')
  const [rating, setRating] = useState<'SFW' | 'NSFW'>('SFW')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [bulkImportDialogOpen, setBulkImportDialogOpen] = useState(false)

  const filters = useMemo(() => ({
    page,
    limit: 12,
    search: debouncedSearch || undefined,
    tags: debouncedTagSearch ? debouncedTagSearch.split(',').map(t => t.trim()).filter(Boolean) : undefined,
    excludeTags: debouncedExcludeTagSearch ? debouncedExcludeTagSearch.split(',').map(t => t.trim()).filter(Boolean) : undefined,
    rating,
  }), [page, debouncedSearch, debouncedTagSearch, debouncedExcludeTagSearch, rating])

  const { backgrounds, totalPages, isLoading, refetch } = useListBackgrounds({
    filters,
    showErrorToast: true,
  })

  const handleSearchDebounce = useCallback((value: string) => {
    setDebouncedSearch(value)
    setPage(1)
  }, [])

  const handleTagSearchDebounce = useCallback((value: string) => {
    setDebouncedTagSearch(value)
    setPage(1)
  }, [])

  const handleExcludeTagSearchDebounce = useCallback((value: string) => {
    setDebouncedExcludeTagSearch(value)
    setPage(1)
  }, [])

  const handleSelectChange = useCallback((id: string, checked: boolean) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }, [])

  const handleSetDefault = useCallback(async (id: string) => {
    try {
      await setBackgroundDefault(id)
      toast.success('Background set as default')
      refetch()
    } catch {
      toast.error('Failed to set default background')
    }
  }, [refetch])

  const handlePageChange = useCallback((p: number) => {
    setPage(p)
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  const { importBackground, bulkImportBackgrounds, isImporting, isBulkImporting } = useImportBackground()

  const handleImport = useCallback(async (files: File[]) => {
    if (files.length === 0) return
    try {
      await importBackground(files[0])
      setImportDialogOpen(false)
      refetch()
    } catch {
      // Error toast handled by hook
    }
  }, [importBackground, refetch])

  const handleBulkImport = useCallback(async (files: File[]) => {
    if (files.length === 0) return
    try {
      await bulkImportBackgrounds(files)
      setBulkImportDialogOpen(false)
      refetch()
    } catch {
      // Error toast handled by hook
    }
  }, [bulkImportBackgrounds, refetch])

  return (
    <div className="flex flex-col h-full">
      <div className="max-w-3xl mx-auto w-full space-y-4 mt-6">
        <div className="w-full flex flex-col sm:flex-row gap-3 sm:items-center">
          <SearchField
            placeholder="Search by name or description"
            value={search}
            onChange={setSearch}
            onDebouncedChange={handleSearchDebounce}
            className="flex-1 min-w-0"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-full shrink-0">
                Background Menu <Menu className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72" align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem className="gap-1">Link Selected to Account</DropdownMenuItem>
                <DropdownMenuItem className="gap-1">Make Selected Global Default</DropdownMenuItem>
                <DropdownMenuItem className="gap-1">Duplicate Selected</DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Add to</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>Character</DropdownMenuItem>
                      <DropdownMenuItem>Persona</DropdownMenuItem>
                      <DropdownMenuItem>LoreBook</DropdownMenuItem>
                      <DropdownMenuItem>Realm</DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Import</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => setImportDialogOpen(true)}>
                        Import Selected
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setBulkImportDialogOpen(true)}>
                        Bulk Import
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Export</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>Export Selected</DropdownMenuItem>
                      <DropdownMenuItem>Bulk Export</DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuItem className="gap-1">Share Selected</DropdownMenuItem>
                <DropdownMenuItem variant="destructive" className="gap-1">Delete Selected</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:gap-4">
          <div className="flex flex-1 gap-2 min-w-0">
            <SearchField
              placeholder="Search by tag"
              value={tagSearch}
              onChange={setTagSearch}
              onDebouncedChange={handleTagSearchDebounce}
              className="flex-1"
            />
            <SearchField
              placeholder="Exclude tags"
              value={excludeTagSearch}
              onChange={setExcludeTagSearch}
              onDebouncedChange={handleExcludeTagSearchDebounce}
              className="flex-1"
            />
          </div>
          <ToggleSwitch
            options={[
              { label: "SFW", value: "SFW" },
              { label: "NSFW", value: "NSFW" },
            ]}
            defaultValue={rating}
            onChange={(val) => {
              setRating(val as 'SFW' | 'NSFW')
              setPage(1)
            }}
          />
        </div>
      </div>

      <div className="flex-1 mt-8 min-h-0">
        {isLoading ? (
          <div className={`grid ${GRID_COLS} gap-3 sm:gap-4`}>
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <BackgroundCardSkeleton key={i} />
            ))}
          </div>
        ) : backgrounds.length === 0 ? (
          <ErrorEmptyState
            type="empty"
            title="No backgrounds found"
            description={
              debouncedSearch || debouncedTagSearch || debouncedExcludeTagSearch
                ? "No backgrounds match your search or filters. Try adjusting your search terms or filters."
                : "You don't have any background images yet. Import images from the Background Menu to get started."
            }
          />
        ) : (
          <div className={`grid ${GRID_COLS} gap-3 sm:gap-4`}>
            {backgrounds.map((bg) => (
              <BackgroundCard
                key={bg.id}
                background={bg}
                selected={selectedIds.has(bg.id)}
                onSelectChange={handleSelectChange}
                onSetDefault={handleSetDefault}
              />
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 pt-4 border-t border-border/50">
          <PaginationComponent
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <ImportBackgroundDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onImport={handleImport}
        isLoading={isImporting}
        isBulk={false}
      />

      <ImportBackgroundDialog
        open={bulkImportDialogOpen}
        onOpenChange={setBulkImportDialogOpen}
        onImport={handleBulkImport}
        isLoading={isBulkImporting}
        isBulk={true}
      />
    </div>
  )
}

export default BackgroundPage
