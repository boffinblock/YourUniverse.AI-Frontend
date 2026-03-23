"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { useField, useFormikContext } from "formik"
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
    const { submitCount } = useFormikContext<Record<string, unknown>>();
    const [open, setOpen] = React.useState(false);

    const dateValue = field.value ? new Date(field.value) : undefined;
    const [month, setMonth] = React.useState<Date>(dateValue || subYears(new Date(), minAge));

    const showError = (meta.touched || submitCount > 0) && !!meta.error;
    const errorMessage = showError ? meta.error : "";

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
    const hasError = showError;

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
                        !hasError && "bg-primary/20!",
                        hasError && "border-destructive focus-visible:border-destructive bg-destructive/20"
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
                        className="w-auto p-0 border-white/10 bg-primary/20 backdrop-blur-xl shadow-2xl overflow-hidden"
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
