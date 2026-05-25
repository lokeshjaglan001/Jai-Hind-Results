"use client"

import * as React from "react"
import { useRouter } from "next/router"
import { api } from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Button } from "@heroui/button"
import { Input } from "@heroui/input"
import {  Table,  TableHeader,  TableBody,  TableColumn,  TableRow,  TableCell} from "@heroui/table";
import { Post } from "@/pages/admin/posts"

export function PostsClient({ 
  data, 
  categories, 
  pagination, 
  onPageChange, 
  onSearch,
  loading 
}: { 
  data: Post[], 
  categories: { name: string }[],
  pagination: { page: number, totalPages: number, total: number, limit: number },
  onPageChange: (page: number) => void,
  onSearch: (query: string) => void,
  loading: boolean
}) {
  const router = useRouter();
  const { token } = useAuth();
  const [searchValue, setSearchValue] = React.useState("");

  // Debounce search
  React.useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(searchValue);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchValue, onSearch]);

  const handleDelete = async (postId: string) => {
    const authToken = token || undefined;
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.delete(`/posts/${postId}`, authToken);
      router.reload(); // Simple reload for now, ideally refresh data
    } catch (error) {
      alert("Failed to delete post.");
      console.error(error);
    }
  };

  const columns: ColumnDef<Post>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
    },
    {
      accessorKey: "categories.name",
      header: "Category",
      cell: ({ row }) => <div>{row.original.categories?.name || 'Uncategorized'}</div>,
    },
    {
      accessorKey: "created_at",
      header: "Date Created",
      cell: ({ row }) => (
        <div>{new Date(row.getValue("created_at")).toLocaleDateString()}</div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const post = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onPress={() => router.push(`/admin/posts/${post.id}/edit`)}>
              Edit
            </Button>
            <Button size="sm" variant="ghost" className="text-red-500" onPress={() => handleDelete(post.id)}>
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    pageCount: pagination.totalPages,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-4">
        <Input
          placeholder="Search by title..."
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          className="max-w-sm"
        />
        {/* Category Filter can be re-added if server-side filtering is implemented */}
      </div>

      <div className="rounded-md border p-1">
        <Table aria-label="Posts table">
          <TableHeader>
            {table.getHeaderGroups()[0].headers.map((header) => (
              <TableColumn key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody emptyContent={loading ? "Loading..." : "No results."} isLoading={loading}>
            {table.getRowModel().rows.map((row) => (
               <TableRow key={row.id}>
                 {row.getVisibleCells().map((cell) => (
                   <TableCell key={cell.id}>
                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
                   </TableCell>
                 ))}
               </TableRow>
             ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            size="sm"
            onPress={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page <= 1 || loading}
          >
            Previous
          </Button>
          <span className="text-sm">
             Page {pagination.page} of {pagination.totalPages || 1}
          </span>
          <Button
            size="sm"
            onPress={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages || loading}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}