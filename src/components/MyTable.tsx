import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { HiMenu } from "react-icons/hi";

//TData
type User = {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  progress: number;
  status: string;
  avatar: string;
};

const columnHelper = createColumnHelper<User>();

/**
 *
 *
 *
 */
const MyTable = () => {
  const [data, setData] = useState<User[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = [
    // do not render id in the UI
    columnHelper.accessor("avatar", {
      cell: (info) => (
        <img
          src={info.getValue()}
          alt="..."
          className=" h-7 w-7 rounded-full object-cover"
        />
      ),
      header: "Avatar",
    }),
    columnHelper.accessor("firstName", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Name",
    }),
    columnHelper.accessor("progress", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Progress",
    }),
    columnHelper.accessor("status", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Status",
    }),
    columnHelper.display({
      id: "menu",
      header: "Actions",
      cell: (info) => (
        <HiMenu
          onClick={() => handleMenuClick(info.row.original.id)}
          style={{ cursor: "pointer" }}
          size={20}
        />
      ),
    }),
  ];

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `http://localhost:5000/users?_page=${pagination.pageIndex + 1}&_limit=${
          pagination.pageSize
        }`
      );
      const d = await response.json();
      setData(d);
      setPageCount(Math.ceil(21 / pagination.pageSize));
    };
    fetchData();
  }, [pagination]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // pagination
    manualPagination: true,
    pageCount,
    state: { pagination },
    onPaginationChange: setPagination,
  });

  const handleMenuClick = (userId: number) => {
    console.log("click on row: ", { userId });
  };

  return (
    <div className="w-[800px]">
      <Button>Click me</Button>
      <table className="border border-gray-700 w-full text-left ">
        <thead className="bg-blue-700 text-white">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-2 py-1.5">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, i) => (
            <tr key={row.id} className={`${i % 2 === 0 ? "" : "bg-gray-200"}`}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-2 py-1.5">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button
          className="p-1 border border-gray-300 px-2 disabled:opacity-30"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className="p-1 border border-gray-300 px-2 disabled:opacity-30"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <span>
          Page{" "}
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <button
          className="p-1 border border-gray-300 px-2 disabled:opacity-30"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          className="p-1 border border-gray-300 px-2 disabled:opacity-30"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
        >
          {[10, 20, 30, 40, 50].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default MyTable;
