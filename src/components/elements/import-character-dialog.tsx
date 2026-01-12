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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileJson, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImportCharacterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (file: File) => void;
  isLoading?: boolean;
  isBulk?: boolean;
}

const ImportCharacterDialog: React.FC<ImportCharacterDialogProps> = ({
  open,
  onOpenChange,
  onImport,
  isLoading = false,
  isBulk = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Handle file selection
  const handleFileSelect = useCallback((file: File | null) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = isBulk
      ? ['application/json']
      : ['application/json', 'image/png', 'image/jpeg', 'image/jpg'];

    if (!allowedTypes.includes(file.type)) {
      // Show error (you can add toast here)
      return;
    }

    setSelectedFile(file);
  }, [isBulk]);

  // Handle file input change
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileSelect(file);
  }, [handleFileSelect]);

  // Handle drag and drop
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

    const file = e.dataTransfer.files?.[0] || null;
    handleFileSelect(file);
  }, [handleFileSelect]);

  // Handle import
  const handleImport = useCallback(() => {
    if (selectedFile) {
      onImport(selectedFile);
      // Reset after import
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [selectedFile, onImport]);

  // Handle dialog close
  const handleClose = useCallback(() => {
    if (!isLoading) {
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onOpenChange(false);
    }
  }, [isLoading, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isBulk ? "Bulk Import Characters" : "Import Character"}
          </DialogTitle>
          <DialogDescription>
            {isBulk
              ? "Upload a JSON file containing an array of characters to import multiple characters at once."
              : "Upload a JSON or PNG file to import a character."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* File Input */}
          <div
            className={cn(
              "border-2 border-dashed rounded-4xl p-8 text-center transition-colors",
              dragActive
                ? "border-primary bg-primary/10"
                : "border-muted-foreground/25",
              selectedFile && "border-primary bg-primary/5"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={isBulk ? ".json" : ".json,.png,.jpg,.jpeg"}
              onChange={handleFileInputChange}
              className="hidden"
              disabled={isLoading}
            />

            {selectedFile ? (
              <div className="space-y-2">
                <FileJson className="mx-auto h-12 w-12 text-primary" />
                <div>
                  <p className="font-medium text-muted-foreground">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="rounded-full"
                  disabled={isLoading}
                >
                  Change File
                </Button>
              </div>
            ) : (
              <div className="space-y-2 ">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <div>
                  <Label htmlFor="file-upload" className="cursor-pointer flex items-center justify-center">
                    <span className="text-primary hover:underline">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {isBulk
                      ? "JSON file (array of characters)"
                      : "JSON or PNG file"}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="rounded-full"
                >
                  Select File
                </Button>
              </div>
            )}
          </div>

          {/* File Info */}
          {selectedFile && (
            <div className="text-xs text-muted-foreground space-y-1">
              <p>
                <strong>File type:</strong> {selectedFile.type}
              </p>
              <p>
                <strong>File size:</strong> {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={!selectedFile || isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isBulk ? "Import Characters" : "Import Character"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportCharacterDialog;
