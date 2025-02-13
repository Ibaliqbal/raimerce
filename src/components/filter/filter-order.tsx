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

type Props = {
  lists: string[];
};

const FilterOrder = ({ lists }: Props) => {
  const router = useRouter();
  const { ...otherQueries } = router.query;

  return (
    <Select
      onValueChange={(e) => {
        router.push(
          {
            pathname: router.pathname,
            query: { ...otherQueries, status: e },
          },
          undefined,
          { shallow: true }
        );
      }}
      defaultValue={router.query.status as string}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Filter</SelectLabel>
          {lists.map((list) => (
            <SelectItem value={list.toLowerCase()} key={list}>
              {list}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default FilterOrder;
