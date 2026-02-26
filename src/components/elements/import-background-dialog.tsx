"use client";

import React, { useRef, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

interface ImportBackgroundDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (files: File[]) => void;
  isLoading?: boolean;
  isBulk?: boolean;
}

const ImportBackgroundDialog: React.FC<ImportBackgroundDialogProps> = ({
  open,
  onOpenChange,
  onImport,
  isLoading = false,
  isBulk = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (ALLOWED_IMAGE_TYPES.includes(file.type)) {
        newFiles.push(file);
      }
    }

    if (newFiles.length === 0) return;

    if (isBulk) {
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    } else {
      setSelectedFiles([newFiles[0]]);
    }
  }, [isBulk]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
    e.target.value = "";
  }, [handleFileSelect]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleImport = useCallback(() => {
    if (selectedFiles.length > 0) {
      onImport(selectedFiles);
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [selectedFiles, onImport]);

  const handleClose = useCallback(() => {
    if (!isLoading) {
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onOpenChange(false);
    }
  }, [isLoading, onOpenChange]);

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isBulk ? "Bulk Import Backgrounds" : "Import Background"}
          </DialogTitle>
          <DialogDescription>
            {isBulk
              ? "Upload multiple image files (JPEG, PNG, WebP, GIF). Each image will be added as a background."
              : "Upload an image file to add as a background."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div
            className={cn(
              "border-2 border-dashed rounded-4xl p-8 text-center transition-colors",
              dragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25",
              selectedFiles.length > 0 && "border-primary bg-primary/5"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.gif,image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileInputChange}
              className="hidden"
              disabled={isLoading}
              multiple={isBulk}
            />

            {selectedFiles.length > 0 ? (
              <div className="space-y-4">
                <div className="max-h-[200px] overflow-y-auto space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between bg-background/50 p-2 rounded-lg border border-border"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <ImageIcon className="h-8 w-8 text-primary flex-shrink-0" />
                        <div className="text-left overflow-hidden">
                          <p className="font-medium text-sm text-foreground truncate max-w-[200px]">
                            {file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(file.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(index);
                        }}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-full"
                    disabled={isLoading}
                  >
                    Add More Files
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedFiles([]);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    className="rounded-full text-destructive hover:text-destructive"
                    disabled={isLoading}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <div>
                  <Label className="cursor-pointer flex items-center justify-center">
                    <span
                      className="text-primary hover:underline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {isBulk ? "Select multiple image files" : "JPEG, PNG, WebP or GIF"}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="rounded-full"
                >
                  Select File{isBulk ? "s" : ""}
                </Button>
              </div>
            )}
          </div>

          {selectedFiles.length > 0 && (
            <div className="text-xs text-muted-foreground">
              <p>
                <strong>Total files:</strong> {selectedFiles.length}
              </p>
              <p>
                <strong>Total size:</strong>{" "}
                {(selectedFiles.reduce((acc, file) => acc + file.size, 0) / 1024).toFixed(2)} KB
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={selectedFiles.length === 0 || isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isBulk ? "Import Backgrounds" : "Import Background"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportBackgroundDialog;
