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
  baseRoute: "/my/order" | "/my/store/orders";
};

const FilterOrder = ({ lists, baseRoute }: Props) => {
  const router = useRouter();

  return (
    <Select
      onValueChange={(e) => {
        router.push(`${baseRoute}?status=${e}`);
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
