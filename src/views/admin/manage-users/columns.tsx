import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TUser } from "@/lib/db/schema";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Link from "next/link";

const columns: ColumnDef<TUser>[] = [
  {
    header: "ID",
    size: 60,
    id: "S.No",
    cell: (info) => <span>{info.row.index + 1}</span>,
  },
  {
    accessorKey: "avatar",
    header: "Avatar",
    size: 60,
    cell: ({ row }) => {
      const avatar = row.getValue("avatar") as TUser["avatar"];
      return (
        <Avatar>
          <AvatarImage src={avatar?.url} />
          <AvatarFallback>
            {row.getValue("name")?.toString().charAt(0)}
          </AvatarFallback>
        </Avatar>
      );
    },
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
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell({ row }) {
      const phone = row.getValue("phone");
      return phone ? phone : "-";
    },
  },
  {
    accessorKey: "createdAt",
    header: "Joined At",
    cell: ({ row }) => {
      const date = row.getValue("createdAt");
      return format(date as Date, "LLL d, yyy");
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem>
              <Link href={`/admin/manage-users/${user.id}`} className="w-full">
                View details
              </Link>
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export { columns };
