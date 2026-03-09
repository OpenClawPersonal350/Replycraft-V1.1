import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  const currentYear = new Date().getFullYear();
  const fromYear = (props as any).fromYear ?? 1920;
  const toYear = (props as any).toYear ?? currentYear;

  const years = React.useMemo(() => {
    const arr: number[] = [];
    for (let y = toYear; y >= fromYear; y--) arr.push(y);
    return arr;
  }, [fromYear, toYear]);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 pointer-events-auto", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "hidden",
        caption_dropdowns: "flex items-center gap-2",
        vhidden: "hidden",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(buttonVariants({ variant: "ghost" }), "h-9 w-9 p-0 font-normal aria-selected:opacity-100"),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      captionLayout="dropdown-buttons"
      fromYear={fromYear}
      toYear={toYear}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
        Dropdown: ({ name, value, onChange, children, ...dropdownProps }) => {
          const options = React.Children.toArray(children) as React.ReactElement[];
          const selected = options.find((o) => o.props.value === value);
          
          const handleChange = (newValue: string) => {
            const syntheticEvent = {
              target: { value: newValue },
            } as React.ChangeEvent<HTMLSelectElement>;
            onChange?.(syntheticEvent);
          };

          if (name === "months") {
            return (
              <Select value={String(value)} onValueChange={handleChange}>
                <SelectTrigger className="h-8 w-[110px] text-xs font-medium bg-muted/30 border-border">
                  <SelectValue>{selected?.props?.children ?? months[Number(value)]}</SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-card border-border max-h-60">
                  {options.map((option) => (
                    <SelectItem key={option.props.value} value={String(option.props.value)} className="text-xs">
                      {option.props.children}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          }

          if (name === "years") {
            return (
              <Select value={String(value)} onValueChange={handleChange}>
                <SelectTrigger className="h-8 w-[80px] text-xs font-medium bg-muted/30 border-border">
                  <SelectValue>{String(value)}</SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-card border-border max-h-60">
                  {options.map((option) => (
                    <SelectItem key={option.props.value} value={String(option.props.value)} className="text-xs">
                      {option.props.children}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          }

          return <select {...dropdownProps} value={value} onChange={onChange}>{children}</select>;
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
