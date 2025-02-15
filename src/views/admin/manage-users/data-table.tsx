import { TUser } from "@/lib/db/schema";
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import * as React from "react";
import { columns } from "./columns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function DataTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const data = React.useMemo<TUser[]>(
    () => [
      {
        id: "1",
        name: "John Doe",
        email: "john.doe@example.com",
        password: null,
        avatar: {
          url: "https://i.pravatar.cc/150?img=1",
          name: "john.jpg",
          type: "image/jpeg",
          keyFile: "avatars/john.jpg",
        },
        phone: "+1234567890",
        address: null,
        role: "admin",
        typeLogin: "credentials",
        createdAt: new Date("2023-01-01"),
        updatedAt: new Date("2023-06-15"),
      },
      {
        id: "2",
        name: "Emma Wilson",
        email: "emma.wilson@example.com",
        password: null,
        avatar: {
          url: "https://i.pravatar.cc/150?img=2",
          name: "emma.jpg",
          type: "image/jpeg",
          keyFile: "avatars/emma.jpg",
        },
        phone: "+1234567891",
        address: null,
        role: "member",
        typeLogin: "credentials",
        createdAt: new Date("2023-01-02"),
        updatedAt: new Date("2023-06-16"),
      },
      {
        id: "3",
        name: "Michael Chen",
        email: "michael.chen@example.com",
        password: null,
        avatar: {
          url: "https://i.pravatar.cc/150?img=3",
          name: "michael.jpg",
          type: "image/jpeg",
          keyFile: "avatars/michael.jpg",
        },
        phone: "+1234567892",
        address: null,
        role: "member",
        typeLogin: "google",
        createdAt: new Date("2023-01-03"),
        updatedAt: new Date("2023-06-17"),
      },
      {
        id: "4",
        name: "Sarah Johnson",
        email: "sarah.johnson@example.com",
        password: null,
        avatar: {
          url: "https://i.pravatar.cc/150?img=4",
          name: "sarah.jpg",
          type: "image/jpeg",
          keyFile: "avatars/sarah.jpg",
        },
        phone: "+1234567893",
        address: null,
        role: "admin",
        typeLogin: "credentials",
        createdAt: new Date("2023-01-04"),
        updatedAt: new Date("2023-06-18"),
      },
      {
        id: "5",
        name: "David Kim",
        email: "david.kim@example.com",
        password: null,
        avatar: {
          url: "https://i.pravatar.cc/150?img=5",
          name: "david.jpg",
          type: "image/jpeg",
          keyFile: "avatars/david.jpg",
        },
        phone: "+1234567894",
        address: null,
        role: "member",
        typeLogin: "google",
        createdAt: new Date("2023-01-05"),
        updatedAt: new Date("2023-06-19"),
      },
      {
        id: "6",
        name: "Lisa Garcia",
        email: "lisa.garcia@example.com",
        password: null,
        avatar: {
          url: "https://i.pravatar.cc/150?img=6",
          name: "lisa.jpg",
          type: "image/jpeg",
          keyFile: "avatars/lisa.jpg",
        },
        phone: "+1234567895",
        address: null,
        role: "member",
        typeLogin: "credentials",
        createdAt: new Date("2023-01-06"),
        updatedAt: new Date("2023-06-20"),
      },
      {
        id: "7",
        name: "James Wilson",
        email: "james.wilson@example.com",
        password: null,
        avatar: {
          url: "https://i.pravatar.cc/150?img=7",
          name: "james.jpg",
          type: "image/jpeg",
          keyFile: "avatars/james.jpg",
        },
        phone: "+1234567896",
        address: null,
        role: "member",
        typeLogin: "google",
        createdAt: new Date("2023-01-07"),
        updatedAt: new Date("2023-06-21"),
      },
      {
        id: "8",
        name: "Maria Rodriguez",
        email: "maria.rodriguez@example.com",
        password: null,
        avatar: {
          url: "https://i.pravatar.cc/150?img=8",
          name: "maria.jpg",
          type: "image/jpeg",
          keyFile: "avatars/maria.jpg",
        },
        phone: "+1234567897",
        address: null,
        role: "admin",
        typeLogin: "credentials",
        createdAt: new Date("2023-01-08"),
        updatedAt: new Date("2023-06-22"),
      },
      {
        id: "9",
        name: "Robert Taylor",
        email: "robert.taylor@example.com",
        password: null,
        avatar: {
          url: "https://i.pravatar.cc/150?img=9",
          name: "robert.jpg",
          type: "image/jpeg",
          keyFile: "avatars/robert.jpg",
        },
        phone: "+1234567898",
        address: null,
        role: "member",
        typeLogin: "google",
        createdAt: new Date("2023-01-09"),
        updatedAt: new Date("2023-06-23"),
      },
      {
        id: "10",
        name: "Jennifer Lee",
        email: "jennifer.lee@example.com",
        password: null,
        avatar: {
          url: "https://i.pravatar.cc/150?img=10",
          name: "jennifer.jpg",
          type: "image/jpeg",
          keyFile: "avatars/jennifer.jpg",
        },
        phone: "+1234567899",
        address: null,
        role: "member",
        typeLogin: "credentials",
        createdAt: new Date("2023-01-10"),
        updatedAt: new Date("2023-06-24"),
      },
      {
        id: "11",
        name: "Thomas Anderson",
        email: "thomas.anderson@example.com",
        password: null,
        avatar: {
          url: "https://i.pravatar.cc/150?img=11",
          name: "thomas.jpg",
          type: "image/jpeg",
          keyFile: "avatars/thomas.jpg",
        },
        phone: "+1234567900",
        address: null,
        role: "member",
        typeLogin: "google",
        createdAt: new Date("2023-01-11"),
        updatedAt: new Date("2023-06-25"),
      },
      {
        id: "12",
        name: "Patricia Martinez",
        email: "patricia.martinez@example.com",
        password: null,
        avatar: {
          url: "https://i.pravatar.cc/150?img=12",
          name: "patricia.jpg",
          type: "image/jpeg",
          keyFile: "avatars/patricia.jpg",
        },
        phone: "+1234567901",
        address: null,
        role: "admin",
        typeLogin: "credentials",
        createdAt: new Date("2023-01-12"),
        updatedAt: new Date("2023-06-26"),
      },
      {
        id: "13",
        name: "Kevin Brown",
        email: "kevin.brown@example.com",
        password: null,
        avatar: {
          url: "https://i.pravatar.cc/150?img=13",
          name: "kevin.jpg",
          type: "image/jpeg",
          keyFile: "avatars/kevin.jpg",
        },
        phone: "+1234567902",
        address: null,
        role: "member",
        typeLogin: "credentials",
        createdAt: new Date("2023-01-13"),
        updatedAt: new Date("2023-06-27"),
      },
      {
        id: "14",
        name: "Sandra White",
        email: "sandra.white@example.com",
        password: null,
        avatar: {
          url: "https://i.pravatar.cc/150?img=14",
          name: "sandra.jpg",
          type: "image/jpeg",
          keyFile: "avatars/sandra.jpg",
        },
        phone: "+1234567903",
        address: null,
        role: "member",
        typeLogin: "credentials",
        createdAt: new Date("2023-01-14"),
        updatedAt: new Date("2023-06-28"),
      },
      {
        id: "15",
        name: "Daniel Lopez",
        email: "daniel.lopez@example.com",
        password: null,
        avatar: {
          url: "https://i.pravatar.cc/150?img=15",
          name: "daniel.jpg",
          type: "image/jpeg",
          keyFile: "avatars/daniel.jpg",
        },
        phone: "+1234567904",
        address: null,
        role: "member",
        typeLogin: "google",
        createdAt: new Date("2023-01-15"),
        updatedAt: new Date("2023-06-29"),
      },
      {
        id: "16",
        name: "Nancy Clark",
        email: "nancy.clark@example.com",
        password: null,
        avatar: {
          url: "https://i.pravatar.cc/150?img=16",
          name: "nancy.jpg",
          type: "image/jpeg",
          keyFile: "avatars/nancy.jpg",
        },
        phone: "+1234567905",
        address: null,
        role: "admin",
        typeLogin: "credentials",
        createdAt: new Date("2023-01-16"),
        updatedAt: new Date("2023-06-30"),
      },
      {
        id: "17",
        name: "Christopher Hall",
        email: "christopher.hall@example.com",
        password: null,
        avatar: {
          url: "https://i.pravatar.cc/150?img=17",
          name: "christopher.jpg",
          type: "image/jpeg",
          keyFile: "avatars/christopher.jpg",
        },
        phone: "+1234567906",
        address: null,
        role: "member",
        typeLogin: "credentials",
        createdAt: new Date("2023-01-17"),
        updatedAt: new Date("2023-07-01"),
      },
      {
        id: "18",
        name: "Amanda Young",
        email: "amanda.young@example.com",
        password: null,
        avatar: {
          url: "https://i.pravatar.cc/150?img=18",
          name: "amanda.jpg",
          type: "image/jpeg",
          keyFile: "avatars/amanda.jpg",
        },
        phone: "+1234567907",
        address: null,
        role: "member",
        typeLogin: "credentials",
        createdAt: new Date("2023-01-18"),
        updatedAt: new Date("2023-07-02"),
      },
      {
        id: "19",
        name: "Joseph King",
        email: "joseph.king@example.com",
        password: null,
        avatar: {
          url: "https://i.pravatar.cc/150?img=19",
          name: "joseph.jpg",
          type: "image/jpeg",
          keyFile: "avatars/joseph.jpg",
        },
        phone: "+1234567908",
        address: null,
        role: "member",
        typeLogin: "google",
        createdAt: new Date("2023-01-19"),
        updatedAt: new Date("2023-07-03"),
      },
      {
        id: "20",
        name: "Michelle Scott",
        email: "michelle.scott@example.com",
        password: null,
        avatar: {
          url: "https://i.pravatar.cc/150?img=20",
          name: "michelle.jpg",
          type: "image/jpeg",
          keyFile: "avatars/michelle.jpg",
        },
        phone: "+1234567909",
        address: null,
        role: "member",
        typeLogin: "credentials",
        createdAt: new Date("2023-01-20"),
        updatedAt: new Date("2023-07-04"),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    pageCount: 10,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="relative w-64">
          <Input
            type="text"
            placeholder="Search users..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="pl-10"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
