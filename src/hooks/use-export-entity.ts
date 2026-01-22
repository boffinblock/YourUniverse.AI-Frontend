/**
 * useExportEntity Hook
 * Reusable hook for exporting entities (Characters, Lorebooks, Personas) to PNG or JSON
 */
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { exportToPng } from "@/lib/utils/export-utils";

interface UseExportEntityOptions {
    showToasts?: boolean;
}

export const useExportEntity = (options?: UseExportEntityOptions) => {
    const { showToasts = true } = options || {};
    const [isExporting, setIsExporting] = useState(false);

    /**
     * Export entity to PNG with embedded metadata
     */
    const exportPng = useCallback(async (data: any, fileName: string, imageUrl?: string) => {
        setIsExporting(true);
        try {
            await exportToPng(data, fileName, imageUrl);
            if (showToasts) {
                toast.success("Entity exported as PNG", {
                    description: `Metadata has been embedded in ${fileName}.png`,
                });
            }
        } catch (error: any) {
            console.error("Export failed:", error);
            if (showToasts) {
                toast.error("Export failed", {
                    description: error.message || "Failed to export as PNG",
                });
            }
        } finally {
            setIsExporting(false);
        }
    }, [showToasts]);

    /**
     * Export entity to JSON (standard download)
     */
    const exportJson = useCallback((data: any, fileName: string) => {
        try {
            const jsonString = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonString], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${fileName.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            if (showToasts) {
                toast.success("Entity exported as JSON");
            }
        } catch (error) {
            if (showToasts) {
                toast.error("JSON export failed");
            }
        }
    }, [showToasts]);

    return {
        exportPng,
        exportJson,
        isExporting
    };
};
