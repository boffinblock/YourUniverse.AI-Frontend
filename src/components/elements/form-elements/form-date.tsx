"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { useField } from "formik"
import { format, subYears, isAfter, isBefore, startOfDay } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface FormDateFieldProps {
    name: string;
    label?: string;
    className?: string;
    placeholder?: string;
    disabled?: boolean;
    minAge?: number;
    maxAge?: number;
}

const FormDateField: React.FC<FormDateFieldProps> = ({
    name,
    label,
    className,
    placeholder = "Select date",
    disabled = false,
    minAge = 0,
    maxAge,
}) => {
    const [field, meta, helpers] = useField(name);
    const [open, setOpen] = React.useState(false);

    const dateValue = field.value ? new Date(field.value) : undefined;
    const [month, setMonth] = React.useState<Date>(dateValue || subYears(new Date(), minAge));

    const errorMessage = meta.touched && meta.error ? meta.error : "";
    const errorClasses = React.useMemo(
        () =>
            errorMessage
                ? "border-destructive focus-visible:border-destructive bg-destructive/20"
                : "",
        [errorMessage]
    );

    // Calculate valid date range
    const today = startOfDay(new Date());
    const toDate = subYears(today, minAge);
    const fromDate = maxAge ? subYears(today, maxAge) : undefined;

    const fromYear = fromDate ? fromDate.getFullYear() : 1900;
    const toYear = toDate.getFullYear();

    const handleSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            helpers.setValue(selectedDate.toISOString());
            setOpen(false);
        }
    };

    const displayValue = dateValue && !isNaN(dateValue.getTime())
        ? format(dateValue, "MMMM dd, yyyy")
        : "";

    // Derived error state for styling similar to UsernameInput/PasswordField
    const hasError = !!(meta.touched && meta.error);
    const borderColorClass = hasError
        ? "border-destructive focus-visible:border-destructive bg-destructive/20"
        : "border-input"; // Default border

    return (
        <div className={cn("w-full space-y-2", className)}>
            {label && (
                <Label
                    htmlFor={name}
                    className={cn(hasError && "text-destructive")}
                >
                    {label}
                </Label>
            )}
            <div className="relative">
                <Input
                    id={name}
                    value={displayValue}
                    readOnly
                    placeholder={placeholder}
                    disabled={disabled}
                    className={cn(
                        "pr-10 cursor-pointer",
                        "bg-primary/30", // Default background
                        borderColorClass, // Applies border and background color on error
                    )}
                    onClick={() => !disabled && setOpen(true)}
                    onKeyDown={(e) => {
                        if (e.key === "ArrowDown" || e.key === "Enter") {
                            e.preventDefault();
                            setOpen(true);
                        }
                    }}
                />
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            disabled={disabled}
                            className={cn(
                                "absolute  top-1/2 right-2 size-6 -translate-y-1/2 hover:bg-transparent",
                                hasError ? "text-destructive" : "text-muted-foreground"
                            )}
                            onClick={() => setOpen(true)}
                        >
                            <CalendarIcon className="size-4" />
                            <span className="sr-only">Toggle calendar</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-auto  p-0 border-primary/20 bg-popover/95 backdrop-blur-xl shadow-xl"
                        align="end"
                        sideOffset={8}
                    >
                        <Calendar
                            mode="single"
                            selected={dateValue}
                            onSelect={handleSelect}
                            disabled={(date) =>
                                isAfter(date, toDate) || (fromDate ? isBefore(date, fromDate) : false)
                            }
                            month={month}
                            onMonthChange={setMonth}
                            captionLayout="dropdown"
                            fromYear={fromYear}
                            toYear={toYear}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>

            {hasError && (
                <div className="text-xs text-destructive text-left px-1">
                    {errorMessage}
                </div>
            )}
        </div>
    )
}

export default FormDateField;
