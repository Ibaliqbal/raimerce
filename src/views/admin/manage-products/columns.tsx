import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TProducts } from "@/lib/db/schema";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Star, StarHalf } from "lucide-react";

const columns: ColumnDef<TProducts>[] = [
  {
    accessorKey: "id",
    header: "ID",
    size: 80,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.getValue("category") as string;
      return <Badge variant="outline">{category}</Badge>;
    },
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => {
      const rating = Number.parseFloat(row.getValue("rating"));
      const fullStars = Math.floor(rating);
      const hasHalfStar = rating % 1 >= 0.5;
      return (
        <div className="flex items-center">
          {[...Array(fullStars)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          ))}
          {hasHalfStar && (
            <StarHalf className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          )}
          <span className="ml-2 text-sm">{rating.toFixed(1)}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "soldout",
    header: "Sold",
    size: 80,
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return date.toLocaleDateString();
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => {
      const date = row.getValue("updatedAt") as Date;
      return date.toLocaleDateString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem
              onClick={() => console.log("View", product)}
            >
              View details
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              onClick={() => console.log("Edit", product)}
            >
              Edit product
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              onClick={() => console.log("Delete", product)}
            >
              Delete product
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export { columns };
