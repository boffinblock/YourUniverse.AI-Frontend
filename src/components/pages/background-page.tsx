"use client"

import React, { useState, useCallback, useMemo } from 'react'
import { Menu, Trash2, CheckCircle, Copy, Link as LinkIcon, Download as DownloadIcon, Loader2, TriangleAlert } from 'lucide-react'

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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from '../ui/button'
import BackgroundCard from '../cards/background-card'
import BackgroundCardSkeleton from '../cards-skeletons/background-card-skeleton'
import { PaginationComponent } from '../elements/pagination-element'
import SearchField from '../elements/search-field'
import { ToggleSwitch } from '../elements/toggle-switch'
import { useListBackgrounds, useImportBackground, useBulkImportBackgrounds, useDeleteBackground, useSetDefaultBackground } from '@/hooks/background'
import ImportBackgroundDialog from '../elements/import-background-dialog'
import ErrorEmptyState from '../elements/error-empty-state'

const SKELETON_COUNT = 12
const GRID_COLS = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3"

const BackgroundPage = () => {
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [bulkImportDialogOpen, setBulkImportDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const filters = useMemo(() => ({
    page,
    limit: 12,
  }), [page])

  const { backgrounds, totalPages, isLoading, refetch } = useListBackgrounds({
    filters,
    showErrorToast: true,
  })

  const { setDefaultBackgroundAsync, clearDefaultBackgroundAsync } = useSetDefaultBackground()

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

  const handleClearDefault = useCallback(async (id: string) => {
    try {
      await clearDefaultBackgroundAsync(id)
      refetch()
    } catch {
      // Error toast handled by hook
    }
  }, [clearDefaultBackgroundAsync, refetch])

  const handlePageChange = useCallback((p: number) => {
    setPage(p)
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  const { importBackground, isImporting } = useImportBackground()
  const { bulkImportBackgroundsAsync, isLoading: isBulkImporting } = useBulkImportBackgrounds()
  const { deleteBackgroundAsync, deleteBackgroundsBatch, isBatchDeleting } = useDeleteBackground()

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
    try {
      await deleteBackgroundAsync(id)
      refetch()
    } catch {
      // Error toast handled by hook
    }
  }, [deleteBackgroundAsync, refetch])

  const handleDeleteSelectedClick = useCallback(() => {
    if (selectedIds.size === 0) return
    setDeleteDialogOpen(true)
  }, [selectedIds.size])

  const handleConfirmDeleteSelected = useCallback(async () => {
    if (selectedIds.size === 0) return
    try {
      await deleteBackgroundsBatch(Array.from(selectedIds))
      setSelectedIds(new Set())
      setDeleteDialogOpen(false)
      refetch()
    } catch {
      // Error toast handled by hook
    }
  }, [selectedIds, deleteBackgroundsBatch, refetch])

  const handleDownload = useCallback(async (id: string, format: "png" | "jpg" = "png") => {
    const bg = backgrounds.find(b => b.id === id)
    if (bg && bg.image?.url) {
      try {
        const response = await fetch(bg.image.url)
        if (!response.ok) throw new Error("Failed to fetch image")
        const blob = await response.blob()
        let downloadBlob = blob

        // Convert format if requested and source differs.
        const sourceType = (blob.type || "").toLowerCase()
        const wantsJpg = format === "jpg"
        const wantsPng = format === "png"
        const alreadyJpg = sourceType.includes("jpeg") || sourceType.includes("jpg")
        const alreadyPng = sourceType.includes("png")

        if ((wantsJpg && !alreadyJpg) || (wantsPng && !alreadyPng)) {
          const imageBitmap = await createImageBitmap(blob)
          const canvas = document.createElement("canvas")
          canvas.width = imageBitmap.width
          canvas.height = imageBitmap.height
          const ctx = canvas.getContext("2d")
          if (!ctx) throw new Error("Canvas context unavailable")

          // Fill white before JPG export to avoid black background from alpha.
          if (wantsJpg) {
            ctx.fillStyle = "#ffffff"
            ctx.fillRect(0, 0, canvas.width, canvas.height)
          }
          ctx.drawImage(imageBitmap, 0, 0)
          imageBitmap.close()

          const converted = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob(resolve, wantsJpg ? "image/jpeg" : "image/png", wantsJpg ? 0.92 : undefined)
          )
          if (converted) {
            downloadBlob = converted
          }
        }

        const url = window.URL.createObjectURL(downloadBlob)
        const link = document.createElement('a')
        link.href = url
        const safeName = (bg.name || `background-${id}`).replace(/[^\w.-]+/g, "-")
        link.download = `${safeName}.${format}`
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
                      Import Background
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setBulkImportDialogOpen(true)}>
                      Bulk Import Backgrounds
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
                onClick={handleDeleteSelectedClick}
                disabled={selectedIds.size === 0 || isBatchDeleting}
              >
                {isBatchDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Delete Selected {selectedIds.size > 0 && `(${selectedIds.size})`}
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
                onClearDefault={handleClearDefault}
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-primary/15 backdrop-blur-3xl border-primary/30 rounded-4xl p-0 gap-0 overflow-hidden shadow-xl shadow-primary/5 sm:max-w-md">
          <AlertDialogHeader className="px-6 pt-8 pb-6 text-center">
            {/* Warning icon - prominent visual anchor */}
            <div className="flex justify-center mb-4">
              <div className="flex size-14 items-center justify-center rounded-full bg-amber-500/20 border-2 border-amber-500/40">
                <TriangleAlert className="size-7 text-amber-500" aria-hidden />
              </div>
            </div>

            {/* Title - clear and direct */}
            <AlertDialogTitle className="text-xl font-semibold  text-white text-center leading-tight">
              Permanently delete backgrounds?
            </AlertDialogTitle>

            {/* Description - descriptive with good spacing */}
            <AlertDialogDescription asChild>
              <div className="mt-4 space-y-3 text-sm text-muted-foreground text-center">
                <p>
                  You are about to permanently delete{" "}
                  <span className="font-semibold text-white">
                    {selectedIds.size} selected background{selectedIds.size !== 1 ? "s" : ""}
                  </span>
                  .
                </p>
                <p>
                  This will remove them from your account. This action cannot be undone.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="px-6 py-4 bg-primary/5 border-t border-primary/20 gap-3 justify-center flex-wrap">
            <AlertDialogCancel
              disabled={isBatchDeleting}
              className="rounded-full border-primary/30 hover:bg-primary/10 hover:border-primary/50 text-white flex-1 sm:flex-initial"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleConfirmDeleteSelected()
              }}
              disabled={isBatchDeleting}
              className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 border-0 flex-1 sm:flex-initial"
            >
              {isBatchDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default BackgroundPage
