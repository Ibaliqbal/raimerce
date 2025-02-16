import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { TStore, TUser } from "@/lib/db/schema";
import { Address } from "@/types/user";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  ArrowUpDown,
  ExternalLink,
  MapPin,
  MoreHorizontal,
} from "lucide-react";

const columns: ColumnDef<
  Pick<TStore, "address" | "createdAt" | "name" | "id"> & {
    owner: Pick<TUser, "email">;
    totalProducts: number;
  }
>[] = [
  {
    id: "S.No",
    header: "ID",
    size: 80,
    cell: (info) => <span>{info.row.index + 1}</span>,
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
    accessorKey: "owner.email",
    header: "Email",
  },
  {
    accessorKey: "totalProducts",
    header: "Total Product",
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => {
      const address = row.getValue("address") as Address;
      return address ? (
        <div className="flex items-center">
          <MapPin className="mr-2 h-4 w-4 text-gray-400" />
          <span
            className="max-w-[200px] truncate"
            title={`${address.spesific}, ${address.city}, ${address.province}, Indonesia`}
          >
            {address.city}, Indonesia
          </span>
        </div>
      ) : (
        <Badge variant="outline">No Address</Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = row.getValue("createdAt");
      return format(date as Date, "LLL d, yyy");
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const store = row.original;
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
              onClick={() => console.log("View", store)}
            >
              View details
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              onClick={() => console.log("Delete", store)}
            >
              Delete store
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              onClick={() =>
                window.open(
                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    store.address?.spesific +
                      ", " +
                      store.address?.city +
                      ", Indonesia"
                  )}`,
                  "_blank"
                )
              }
            >
              <div className="flex items-center">
                View on Google Maps
                <ExternalLink className="ml-2 h-4 w-4" />
              </div>
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export { columns };
