"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useField } from "formik";
import Image from "next/image";
import React, { useState } from "react";

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
  const [, meta, helpers] = useField<File | null>(name);
  const { setValue, setTouched } = helpers;

  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setPreview(URL.createObjectURL(file));
      setValue(file);
    }
    setTouched(true);
  };

  return (
    <div className="space-y-2 pb-10 w-full h-full">
      {label && (
        <p className="text-sm font-medium text-left text-white/80">
          {label}
        </p>
      )}

      <Card
        className={cn(
          "relative cursor-pointer w-full h-full min-h-[250px] flex items-center justify-center border-2 rounded-xl overflow-hidden bg-primary/40",
          meta.touched && meta.error && "border-destructive bg-destructive/10",
          className
        )}
      >
        {/* Image preview background */}
        {preview && (
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
          />
        )}

        {/* Overlay text/button */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-all duration-200">
          <span className="text-white/70 hover:bg-primary text-sm border border-dashed border-primary rounded-lg px-5 py-3 font-medium z-10">
            Upload the screenshot or image
          </span>
        </div>

        <input
          type="file"
          accept={acceptedFormats}
          onChange={handleFileChange}
          className="hidden"
        />
      </Card>

      {meta.touched && meta.error && (
        <p className="text-sm text-destructive">{meta.error}</p>
      )}
    </div>
  );
};

export default FormMultiFile;
