/* eslint-disable max-lines */
"use client"

import { type FC, useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

import { cn } from "@/lib/utils"
import { ChevronDownIcon, ChevronUpIcon, SlidersHorizontal } from "lucide-react"
import type { JSX } from "react/jsx-runtime"

export interface DateRangePickerProps {
  /** Click handler for applying the updates from DateRangePicker. */
  onUpdate?: (values: { range: DateRange; rangeCompare?: DateRange }) => void
  /** Initial value for start date */
  initialDateFrom?: Date | string
  /** Initial value for end date */
  initialDateTo?: Date | string
  /** Initial value for start date for compare */
  initialCompareFrom?: Date | string
  /** Initial value for end date for compare */
  initialCompareTo?: Date | string
  /** Alignment of popover */
  align?: "start" | "center" | "end"
  /** Option for locale */
  locale?: string
  /** Option for showing compare feature */
  showCompare?: boolean
  /** Maximum number of days that can be selected in a range */
  range?: number
  variant?: "compact" | "default"
  shouldResetOnInitialDateChange?: boolean
}

const formatDate = (date: Date, locale = "en-us"): string => {
  return date.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

const getDateAdjustedForTimezone = (dateInput: Date | string): Date => {
  if (typeof dateInput === "string") {
    // Split the date string to get year, month, and day parts
    const parts = dateInput.split("-").map((part) => Number.parseInt(part, 10))
    // Create a new Date object using the local timezone
    // Note: Month is 0-indexed, so subtract 1 from the month part
    const date = new Date(parts[0], parts[1] - 1, parts[2])
    return date
  } else {
    // If dateInput is already a Date object, return it directly
    return dateInput
  }
}

// Helper function to calculate days between two dates
const getDaysBetween = (from: Date, to: Date): number => {
  const diffTime = Math.abs(to.getTime() - from.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

interface DateRange {
  from: Date
  to: Date | undefined
}

interface Preset {
  name: string
  label: string
}

// Define presets
const PRESETS: Preset[] = [
  { name: "today", label: "Today" },
  { name: "yesterday", label: "Yesterday" },
  { name: "last7", label: "Last 7 days" },
  { name: "last30", label: "Last 30 days" },
  { name: "thisWeek", label: "This Week" },
  { name: "lastWeek", label: "Last Week" },
  { name: "thisMonth", label: "This Month" },
  { name: "lastMonth", label: "Last Month" },
]

/** The DateRangePicker component allows a user to select a range of dates */
export const DateRangePicker: FC<DateRangePickerProps> & {
  filePath: string
} = ({
  initialDateFrom = new Date(new Date().setHours(0, 0, 0, 0)),
  initialDateTo,
  initialCompareFrom,
  initialCompareTo,
  onUpdate,
  align = "end",
  locale = "en-US",
  showCompare = true,
  range = 90,  
  variant = "default",
  shouldResetOnInitialDateChange = false
}): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false)

  const [dateRange, setDateRange] = useState<DateRange>({
    from: getDateAdjustedForTimezone(initialDateFrom),
    to: initialDateTo ? getDateAdjustedForTimezone(initialDateTo) : getDateAdjustedForTimezone(initialDateFrom),
  })
  const [rangeCompare, setRangeCompare] = useState<DateRange | undefined>(
    initialCompareFrom
      ? {
          from: new Date(new Date(initialCompareFrom).setHours(0, 0, 0, 0)),
          to: initialCompareTo
            ? new Date(new Date(initialCompareTo).setHours(0, 0, 0, 0))
            : new Date(new Date(initialCompareFrom).setHours(0, 0, 0, 0)),
        }
      : undefined,
  )

  useEffect(() => {
    if (shouldResetOnInitialDateChange) {
      setDateRange({
        from: getDateAdjustedForTimezone(initialDateFrom),
        to: initialDateTo
          ? getDateAdjustedForTimezone(initialDateTo)
          : getDateAdjustedForTimezone(initialDateFrom),
      })
    }
  }, [initialDateFrom, initialDateTo])

  // Refs to store the values of range and rangeCompare when the date picker is opened
  const openedRangeRef = useRef<DateRange | undefined>(dateRange)
  const openedRangeCompareRef = useRef<DateRange | undefined>(rangeCompare)

  const [selectedPreset, setSelectedPreset] = useState<string | undefined>(undefined)

  const [isSmallScreen, setIsSmallScreen] = useState(typeof window !== "undefined" ? window.innerWidth < 960 : false)

  useEffect(() => {
    const handleResize = (): void => {
      setIsSmallScreen(window.innerWidth < 960)
    }

    window.addEventListener("resize", handleResize)

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const getPresetRange = (presetName: string): DateRange => {
    const preset = PRESETS.find(({ name }) => name === presetName)
    if (!preset) throw new Error(`Unknown date range preset: ${presetName}`)
    const from = new Date()
    const to = new Date()
    const first = from.getDate() - from.getDay()

    switch (preset.name) {
      case "today":
        from.setHours(0, 0, 0, 0)
        to.setHours(23, 59, 59, 999)
        break
      case "yesterday":
        from.setDate(from.getDate() - 1)
        from.setHours(0, 0, 0, 0)
        to.setDate(to.getDate() - 1)
        to.setHours(23, 59, 59, 999)
        break
      case "last7":
        from.setDate(from.getDate() - Math.min(6, range - 1))
        from.setHours(0, 0, 0, 0)
        to.setHours(23, 59, 59, 999)
        break
      case "last14":
        from.setDate(from.getDate() - Math.min(13, range - 1))
        from.setHours(0, 0, 0, 0)
        to.setHours(23, 59, 59, 999)
        break
      case "last30":
        from.setDate(from.getDate() - Math.min(29, range - 1))
        from.setHours(0, 0, 0, 0)
        to.setHours(23, 59, 59, 999)
        break
      case "thisWeek":
        from.setDate(first)
        from.setHours(0, 0, 0, 0)
        to.setHours(23, 59, 59, 999)
        // Limit to range if this week exceeds it
        if (getDaysBetween(from, to) > range) {
          from.setDate(to.getDate() - range + 1)
        }
        break
      case "lastWeek":
        from.setDate(from.getDate() - 7 - from.getDay())
        to.setDate(to.getDate() - to.getDay() - 1)
        from.setHours(0, 0, 0, 0)
        to.setHours(23, 59, 59, 999)
        // Limit to range if last week exceeds it
        if (getDaysBetween(from, to) > range) {
          from.setDate(to.getDate() - range + 1)
        }
        break
      case "thisMonth":
        from.setDate(1)
        from.setHours(0, 0, 0, 0)
        to.setHours(23, 59, 59, 999)
        // Limit to range if this month exceeds it
        if (getDaysBetween(from, to) > range) {
          from.setDate(to.getDate() - range + 1)
        }
        break
      case "lastMonth":
        from.setMonth(from.getMonth() - 1)
        from.setDate(1)
        from.setHours(0, 0, 0, 0)
        to.setDate(0)
        to.setHours(23, 59, 59, 999)
        // Limit to range if last month exceeds it
        if (getDaysBetween(from, to) > range) {
          from.setDate(to.getDate() - range + 1)
        }
        break
    }

    return { from, to }
  }

  const setPreset = (preset: string): void => {
    const newRange = getPresetRange(preset)
    setDateRange(newRange)
    if (rangeCompare) {
      const newRangeCompare = {
        from: new Date(newRange.from.getFullYear() - 1, newRange.from.getMonth(), newRange.from.getDate()),
        to: newRange.to
          ? new Date(newRange.to.getFullYear() - 1, newRange.to.getMonth(), newRange.to.getDate())
          : undefined,
      }
      setRangeCompare(newRangeCompare)
    }
  }

  const checkPreset = (): void => {
    for (const preset of PRESETS) {
      const presetRange = getPresetRange(preset.name)

      const normalizedRangeFrom = new Date(dateRange.from)
      normalizedRangeFrom.setHours(0, 0, 0, 0)
      const normalizedPresetFrom = new Date(presetRange.from.setHours(0, 0, 0, 0))

      const normalizedRangeTo = new Date(dateRange.to ?? 0)
      normalizedRangeTo.setHours(0, 0, 0, 0)
      const normalizedPresetTo = new Date(presetRange.to?.setHours(0, 0, 0, 0) ?? 0)

      if (
        normalizedRangeFrom.getTime() === normalizedPresetFrom.getTime() &&
        normalizedRangeTo.getTime() === normalizedPresetTo.getTime()
      ) {
        setSelectedPreset(preset.name)
        return
      }
    }

    setSelectedPreset(undefined)
  }

  const resetValues = (): void => {
    setDateRange({
      from: typeof initialDateFrom === "string" ? getDateAdjustedForTimezone(initialDateFrom) : initialDateFrom,
      to: initialDateTo
        ? typeof initialDateTo === "string"
          ? getDateAdjustedForTimezone(initialDateTo)
          : initialDateTo
        : typeof initialDateFrom === "string"
          ? getDateAdjustedForTimezone(initialDateFrom)
          : initialDateFrom,
    })
    setRangeCompare(
      initialCompareFrom
        ? {
            from:
              typeof initialCompareFrom === "string"
                ? getDateAdjustedForTimezone(initialCompareFrom)
                : initialCompareFrom,
            to: initialCompareTo
              ? typeof initialCompareTo === "string"
                ? getDateAdjustedForTimezone(initialCompareTo)
                : initialCompareTo
              : typeof initialCompareFrom === "string"
                ? getDateAdjustedForTimezone(initialCompareFrom)
                : initialCompareFrom,
          }
        : undefined,
    )
  }

  // Validate and adjust date range selection
  const handleDateSelect = (value: { from?: Date; to?: Date } | undefined) => {
    if (value?.from != null) {
      let newTo = value?.to

      // If both from and to are selected, check if range exceeds limit
      if (value.from && value.to) {
        const daysBetween = getDaysBetween(value.from, value.to)
        if (daysBetween > range) {
          // Adjust the 'to' date to respect the range limit
          newTo = new Date(value.from)
          newTo.setDate(value.from.getDate() + range - 1)
        }
      }

      setDateRange({ from: value.from, to: newTo })
    }
  }

  useEffect(() => {
    checkPreset()
  }, [dateRange])

  const PresetButton = ({
    preset,
    label,
    isSelected,
  }: {
    preset: string
    label: string
    isSelected: boolean
  }): JSX.Element => {
    // Check if preset would exceed range limit
    const presetRange = getPresetRange(preset)
    const wouldExceedRange = presetRange.to && getDaysBetween(presetRange.from, presetRange.to) > range

    return (
      <button
        className={cn(
          "text-sm px-2 py-1 rounded hover:bg-slate-100 cursor-pointer text-left w-full",
          isSelected && "bg-slate-100 font-medium",
          wouldExceedRange && "opacity-50",
        )}
        onClick={() => {
          setPreset(preset)
        }}
        title={wouldExceedRange ? `Limited to ${range} days` : undefined}
      >
        {label}
        {wouldExceedRange && <span className="text-xs text-muted-foreground ml-1">(max {range}d)</span>}
      </button>
    )
  }

  // Helper function to check if two date ranges are equal
  const areRangesEqual = (a?: DateRange, b?: DateRange): boolean => {
    if (!a || !b) return a === b // If either is undefined, return true if both are undefined
    return a.from.getTime() === b.from.getTime() && (!a.to || !b.to || a.to.getTime() === b.to.getTime())
  }

  useEffect(() => {
    if (isOpen) {
      openedRangeRef.current = dateRange
      openedRangeCompareRef.current = rangeCompare
    }
  }, [isOpen])

  // Format the selected date range for display
  const getSelectedRangeText = (): string => {
    if (!dateRange.from) return "No date selected"

    const fromText = formatDate(dateRange.from, locale)
    const toText = dateRange.to ? formatDate(dateRange.to, locale) : fromText

    if (dateRange.to && dateRange.from.getTime() !== dateRange.to.getTime()) {
      const days = getDaysBetween(dateRange.from, dateRange.to) + 1
      return `${fromText} - ${toText} (${days} day${days > 1 ? "s" : ""})`
    }

    return fromText
  }

  console.log("Date range: ", dateRange)
  return (
    <Popover
      modal={true}
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) {
          resetValues()
        }
        setIsOpen(open)
      }}
    >
      <PopoverTrigger className="" asChild>
        <Button className="w-fit justify-end" variant={variant === "compact" ? "ghost" : "outline"}>
          <div className="flex items-center gap-2 ml-auto text-right">
            {/* Text: Date Range */}
            {variant === "default" ? (
              <div className="text-xs">
                <div>
                  {`${formatDate(dateRange.from, locale)}${dateRange.to != null ? " - " + formatDate(dateRange.to, locale) : ""}`}
                </div>
                {rangeCompare != null && (
                  <div className="opacity-60 text-xs -mt-1">
                    vs. {formatDate(rangeCompare.from, locale)}
                    {rangeCompare.to != null ? ` - ${formatDate(rangeCompare.to, locale)}` : ""}
                  </div>
                )}
              </div>
            ) : null}

            {/* Icon: Calendar (always at the end before chevron) */}
            {variant === "compact" && <SlidersHorizontal className="h-4 w-4" />}

            {/* Chevron */}
            {variant === "default" && (
              <div className="opacity-60 -mr-2 scale-125">
                {isOpen ? <ChevronUpIcon width={24} /> : <ChevronDownIcon width={24} />}
              </div>
            )}
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent align={align} className="w-fit">
        <div className="flex">
          <div className="flex">
            <div className="flex flex-col">
              <div className="flex flex-col lg:flex-row justify-end items-center lg:items-start pb-4">
                {showCompare && (
                  <div className="flex items-center space-x-2 pr-4 py-1">
                    <Switch
                      defaultChecked={Boolean(rangeCompare)}
                      onCheckedChange={(checked: boolean) => {
                        if (checked) {
                          if (!dateRange.to) {
                            setDateRange({
                              from: dateRange.from,
                              to: dateRange.from,
                            })
                          }
                          setRangeCompare({
                            from: new Date(
                              dateRange.from.getFullYear(),
                              dateRange.from.getMonth(),
                              dateRange.from.getDate() - 365,
                            ),
                            to: dateRange.to
                              ? new Date(
                                  dateRange.to.getFullYear() - 1,
                                  dateRange.to.getMonth(),
                                  dateRange.to.getDate(),
                                )
                              : new Date(
                                  dateRange.from.getFullYear() - 1,
                                  dateRange.from.getMonth(),
                                  dateRange.from.getDate(),
                                ),
                          })
                        } else {
                          setRangeCompare(undefined)
                        }
                      }}
                      id="compare-mode"
                    />
                    <Label htmlFor="compare-mode">Compare</Label>
                  </div>
                )}
              </div>
              {isSmallScreen && (
                <Select
                  defaultValue={selectedPreset}
                  onValueChange={(value) => {
                    setPreset(value)
                  }}
                >
                  <SelectTrigger className="w-[180px] mx-auto mb-2">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {PRESETS.map((preset) => (
                      <SelectItem key={preset.name} value={preset.name}>
                        {preset.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <div>
                <Calendar
                  mode="range"
                  onSelect={handleDateSelect}
                  selected={dateRange}
                  numberOfMonths={isSmallScreen ? 1 : 2}
                  defaultMonth={new Date(new Date().setMonth(new Date().getMonth() - (isSmallScreen ? 0 : 1)))}
                />
              </div>
            </div>
          </div>

          {!isSmallScreen && (
            <>
              {/* Vertical Separator */}
              <Separator orientation="vertical" className="mx-4 h-auto" />

              <div className="flex flex-col">
                <div className="flex w-fit flex-col items-end space-y-2">
                  {PRESETS.map((preset) => (
                    <PresetButton
                      key={preset.name}
                      preset={preset.name}
                      label={preset.label}
                      isSelected={selectedPreset === preset.name}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer with selected range display and buttons */}
        <div className="flex items-center justify-between pt-4 border-t mt-4">
          {/* Selected Date Range Display */}
          <div className="flex-1 mr-4">
            <div className="text-sm font-medium text-foreground">{getSelectedRangeText()}</div>
            {rangeCompare && (
              <div className="text-xs text-muted-foreground mt-1">
                vs. {formatDate(rangeCompare.from, locale)}
                {rangeCompare.to && rangeCompare.from.getTime() !== rangeCompare.to.getTime()
                  ? ` - ${formatDate(rangeCompare.to, locale)}`
                  : ""}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => {
                setIsOpen(false)
                resetValues()
              }}
              variant="ghost"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setIsOpen(false)
                if (
                  !areRangesEqual(dateRange, openedRangeRef.current) ||
                  !areRangesEqual(rangeCompare, openedRangeCompareRef.current)
                ) {
                  onUpdate?.({ range: dateRange, rangeCompare })
                }
              }}
            >
              Update
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

DateRangePicker.displayName = "DateRangePicker"
DateRangePicker.filePath = "libs/shared/ui-kit/src/lib/date-range-picker/date-range-picker.tsx"
