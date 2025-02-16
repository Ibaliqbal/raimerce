import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/router";
import { useCallback } from "react";

type FilterBy = "category" | "rating";

interface FilterBySelectProps {
  filterBy: FilterBy;
  lists: string[];
}

const FilterBySelect: React.FC<FilterBySelectProps> = ({ filterBy, lists }) => {
  const router = useRouter();

  const getQueryParam = (filterType: FilterBy): string =>
    filterType === "category" ? "c" : "r";

  const getCurrentValue = useCallback(() => {
    const queryParam = getQueryParam(filterBy);
    return (router.query[queryParam] as string) || "";
  }, [filterBy, router.query]);

  const handleValueChange = useCallback(
    (newValue: string) => {
      const queryParam = getQueryParam(filterBy);
      const currentValue = router.query[queryParam] as string;

      let newPath = router.asPath;

      if (currentValue) {
        newPath = newPath.replace(
          `${queryParam}=${currentValue}`,
          `${queryParam}=${newValue}`
        );
        if (router.query.page) {
          newPath = newPath.replace(`page=${router.query.page}`, "page=1");
        }
      } else {
        newPath += `${
          newPath.includes("?") ? "&" : "?"
        }${queryParam}=${newValue}`;
        if (router.query.page) {
          newPath = newPath.replace(`page=${router.query.page}`, "page=1");
        }
      }

      router.push(newPath);
    },
    [filterBy, router]
  );

  return (
    <Select value={getCurrentValue()} onValueChange={handleValueChange}>
      <SelectTrigger
        className={filterBy === "rating" ? "w-[150px]" : "w-[180px]"}
      >
        <SelectValue placeholder={`Select ${filterBy}`} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Filter by {filterBy}</SelectLabel>
          {lists.map((item) => (
            <SelectItem value={item} key={item} className="capitalize">
              {item}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default FilterBySelect;
