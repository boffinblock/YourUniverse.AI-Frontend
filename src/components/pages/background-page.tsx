"use client"

import React, { useState, useCallback, useMemo } from 'react'
import { Menu, Trash2, CheckCircle, Copy, Link as LinkIcon, Download as DownloadIcon } from 'lucide-react'

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
import { useListBackgrounds, useImportBackground, useBulkImportBackgrounds, useDeleteBackground, useSetDefaultBackground } from '@/hooks/background'
import { toast } from 'sonner'
import ImportBackgroundDialog from '../elements/import-background-dialog'
import ErrorEmptyState from '../elements/error-empty-state'

const SKELETON_COUNT = 12
const GRID_COLS = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3"

const BackgroundPage = () => {
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [bulkImportDialogOpen, setBulkImportDialogOpen] = useState(false)

  const filters = useMemo(() => ({
    page,
    limit: 12,
  }), [page])

  const { backgrounds, totalPages, isLoading, refetch } = useListBackgrounds({
    filters,
    showErrorToast: true,
  })

  const { setDefaultBackgroundAsync } = useSetDefaultBackground()


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
      await setDefaultBackgroundAsync(id)
      refetch()
    } catch {
      // Error toast handled by hook
    }
  }, [setDefaultBackgroundAsync, refetch])

  const handlePageChange = useCallback((p: number) => {
    setPage(p)
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  const { importBackground, isImporting } = useImportBackground()
  const { bulkImportBackgroundsAsync, isLoading: isBulkImporting } = useBulkImportBackgrounds()
  const { deleteBackgroundAsync } = useDeleteBackground()

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
      await bulkImportBackgroundsAsync(files)
      setBulkImportDialogOpen(false)
      refetch()
    } catch {
      // Error toast handled by hook
    }
  }, [bulkImportBackgroundsAsync, refetch])

  const handleDelete = useCallback(async (id: string) => {
    if (confirm("Are you sure you want to delete this background?")) {
      try {
        await deleteBackgroundAsync(id)
        refetch()
      } catch {
        // Error toast handled by hook
      }
    }
  }, [deleteBackgroundAsync, refetch])

  const handleDeleteSelected = useCallback(async () => {
    if (selectedIds.size === 0) return
    if (confirm(`Are you sure you want to delete ${selectedIds.size} selected background(s)?`)) {
      try {
        await Promise.all(Array.from(selectedIds).map(id => deleteBackgroundAsync(id)))
        setSelectedIds(new Set())
        refetch()
        toast.success(`${selectedIds.size} backgrounds deleted`)
      } catch {
        // Error toast handled by hook
      }
    }
  }, [selectedIds, deleteBackgroundAsync, refetch])

  const handleDownload = useCallback(async (id: string) => {
    const bg = backgrounds.find(b => b.id === id)
    if (bg && bg.image?.url) {
      try {
        const response = await fetch(bg.image.url)
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = bg.name || `background-${id}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      } catch {
        // Fallback to opening in new tab if fetch fails (e.g. CORS)
        window.open(bg.image.url, '_blank')
      }
    }
  }, [backgrounds])

  const handleSetDefaultSelected = useCallback(async () => {
    if (selectedIds.size === 0) return
    const id = Array.from(selectedIds)[0] // Just take the first one for now
    await handleSetDefault(id)
  }, [selectedIds, handleSetDefault])

  return (
    <div className="flex flex-col h-full relative">
      <div className="max-w-3xl mx-auto w-full flex justify-end items-center gap-4 mt-6">
        <Button
          onClick={() => setBulkImportDialogOpen(true)}
          className="rounded-full gap-2"
        >
          <DownloadIcon className="h-4 w-4 rotate-180" />
          Bulk Import
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="rounded-full shrink-0">
              Background Menu <Menu className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-72" align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem className="gap-2" disabled={selectedIds.size === 0}>
                <LinkIcon className="h-4 w-4" /> Link Selected to Account
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-2"
                onClick={handleSetDefaultSelected}
                disabled={selectedIds.size === 0}
              >
                <CheckCircle className="h-4 w-4" /> Make Selected Global Default
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2" disabled={selectedIds.size === 0}>
                <Copy className="h-4 w-4" /> Duplicate Selected
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="gap-2">
                  <LinkIcon className="h-4 w-4" /> Add to
                </DropdownMenuSubTrigger>
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
                <DropdownMenuSubTrigger className="gap-2">
                  <DownloadIcon className="h-4 w-4 rotate-180" /> Import
                </DropdownMenuSubTrigger>
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
                <DropdownMenuSubTrigger className="gap-2">
                  <DownloadIcon className="h-4 w-4" /> Export
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>Export Selected</DropdownMenuItem>
                    <DropdownMenuItem>Bulk Export</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuItem className="gap-2" disabled={selectedIds.size === 0}>
                <LinkIcon className="h-4 w-4" /> Share Selected
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                className="gap-2"
                onClick={handleDeleteSelected}
                disabled={selectedIds.size === 0}
              >
                <Trash2 className="h-4 w-4" /> Delete Selected
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
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
            description="You don't have any background images yet. Import images from the Background Menu or use Bulk Import to get started."
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
                onDelete={handleDelete}
                onDownload={handleDownload}
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
