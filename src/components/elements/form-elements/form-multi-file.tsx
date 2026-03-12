"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useField } from "formik";
import Image from "next/image";
import React, { useState } from "react";
import { X, UploadCloud } from "lucide-react";

interface FormMultiFileProps {
  name: string;
  label?: string;
  acceptedFormats?: string;
  className?: string;
}

const FormMultiFile: React.FC<FormMultiFileProps> = ({
  name,
  label,
  acceptedFormats = "image/*",
  className,
}) => {
  const [, meta, helpers] = useField<File[] | null>(name);
  const { setValue, setTouched } = helpers;

  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      const newFiles = [...(meta.value || []), ...selectedFiles];
      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));

      setPreviews(prev => [...prev, ...newPreviews]);
      setValue(newFiles);
    }
    setTouched(true);
  };

  const removeFile = (index: number) => {
    const newFiles = [...(meta.value || [])];
    newFiles.splice(index, 1);

    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);

    setPreviews(newPreviews);
    setValue(newFiles.length > 0 ? newFiles : null);
  };

  return (
    <div className="space-y-2 pb-10 w-full">
      {label && (
        <p className="text-sm font-medium text-left text-white/80">
          {label}
        </p>
      )}

      <label className="block w-full cursor-pointer">
        <input
          type="file"
          accept={acceptedFormats}
          onChange={handleFileChange}
          multiple
          className="hidden"
        />
        <Card
          className={cn(
            "relative w-full min-h-[180px] flex flex-col items-center justify-center border-2 border-dashed border-primary/20 rounded-xl overflow-hidden bg-primary/5 hover:bg-primary/10 transition-colors",
            meta.touched && meta.error && "border-destructive bg-destructive/5",
            className
          )}
        >
          <div className="flex flex-col items-center gap-2 text-muted-foreground p-6">
            <UploadCloud className="size-10 text-primary/40" />
            <span className="text-sm font-medium">Click to upload screenshots or images</span>
            <span className="text-xs opacity-60">Supports JPG, PNG (Max 5MB per file)</span>
          </div>
        </Card>
      </label>

      {/* Previews Grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
          {previews.map((preview, index) => (
            <div key={index} className="group relative aspect-square rounded-lg overflow-hidden border border-white/10 bg-muted">
              <Image
                src={preview}
                alt={`Preview ${index}`}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute top-1 right-1 size-6 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-destructive transition-colors opacity-0 group-hover:opacity-100"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {meta.touched && meta.error && (
        <p className="text-sm text-destructive">{meta.error}</p>
      )}
    </div>
  );
};

export default FormMultiFile;
