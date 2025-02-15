import * as React from "react";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/router";

type Props = {
  /**
   * The number of days to display in the date range picker.
   * @default undefined
   * @type number
   * @example 7
   */
  dayCount?: number;
} & React.ComponentPropsWithoutRef<typeof PopoverContent>;

export function DatePickerRange({ dayCount, className, ...rest }: Props) {
  const router = useRouter();
  const { ...otherQueries } = router.query;
  const [from, to] = React.useMemo(() => {
    let fromDay: Date | undefined;
    let toDay: Date | undefined;

    if (router.query.from || router.query.to) {
      fromDay = new Date(router.query.from as string);
      toDay = new Date(router.query.to as string);
    } else if (dayCount) {
      toDay = new Date();
      fromDay = addDays(toDay, -dayCount);
    }

    return [fromDay, toDay];
  }, [router.query.from, router.query.to, dayCount]);
  const [date, setDate] = React.useState<DateRange | undefined>({
    from,
    to,
  });

  React.useEffect(() => {
    const newQuery = { ...otherQueries };

    if (date?.from) {
      newQuery.from = format(date.from, "yyyy-MM-dd");
    } else {
      delete newQuery.from;
    }

    if (date?.to) {
      newQuery.to = format(date.to, "yyyy-MM-dd");
    } else {
      delete newQuery.to;
    }

    router.push(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date?.from, date?.to]);

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            size="lg"
            className={cn(
              "w-full justify-start truncate text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 size-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn("w-auto p-0", className)} {...rest}>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
