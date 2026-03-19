// src/components/Table.tsx
import { useState, useMemo,} from "react";
import type { ReactNode } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2
} from "lucide-react";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  accessor?: (row: T) => ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
  cell?: (row: T) => ReactNode;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  isLoading?: boolean;

  onRowClick?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;

  searchable?: boolean;
  filterable?: boolean;
  exportable?: boolean;

  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
  };
}

/* ---------------- TABLE COMPONENT ---------------- */

export function Table<T extends Record<string, any>>({
  data,
  columns,
  title,
  isLoading = false,

  onRowClick,
  onEdit,
  onDelete,
  onView,

  searchable = true,
  filterable = true,
  exportable = true,

  pagination
}: TableProps<T>) {

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [showFilters, setShowFilters] = useState(false);

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  /* ---------------- SORT ---------------- */

  const handleSort = (key: string) => {

    let direction: "asc" | "desc" = "asc";

    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });
  };

  /* ---------------- PROCESS DATA ---------------- */

  const processedData = useMemo(() => {

    let filtered = [...data];

    /* SEARCH */

    if (searchTerm) {

      filtered = filtered.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );

    }

    /* FILTER */

    Object.keys(filters).forEach((key) => {

      if (filters[key]) {

        filtered = filtered.filter((row) =>
          String(row[key]).toLowerCase().includes(filters[key].toLowerCase())
        );

      }

    });

    /* SORT */

    if (sortConfig) {

      filtered.sort((a, b) => {

        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();

        if (sortConfig.direction === "asc") {
          return aStr.localeCompare(bStr);
        } else {
          return bStr.localeCompare(aStr);
        }

      });

    }

    return filtered;

  }, [data, searchTerm, filters, sortConfig]);

  /* ---------------- EXPORT ---------------- */

  const handleExport = () => {

    const csv = [
      columns.map((col) => col.header).join(","),
      ...processedData.map((row) =>
        columns
          .map((col) => {
            const value =
              col.accessor?.(row) ??
              row[col.key as keyof T];

            return `"${String(value).replace(/"/g, '""')}"`;
          })
          .join(",")
      )
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "table-data.csv";

    a.click();
  };

  /* ---------------- LOADING ---------------- */

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (

    <div className="bg-white rounded-xl shadow border">

      {/* HEADER */}

      {(title || searchable || filterable || exportable) && (

        <div className="p-4 border-b flex justify-between items-center flex-wrap gap-3">

          {title && (
            <h2 className="font-semibold text-lg">
              {title}
            </h2>
          )}

          <div className="flex gap-2 items-center">

            {/* SEARCH */}

            {searchable && (

              <div className="relative">

                <Search className="absolute left-2 top-2 w-4 h-4 text-gray-400" />

                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="pl-8 pr-3 py-2 border rounded text-sm"
                />

              </div>

            )}

            {/* FILTER */}

            {filterable && (

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 border rounded"
              >
                <Filter size={16} />
              </button>

            )}

            {/* EXPORT */}

            {exportable && (

              <button
                onClick={handleExport}
                className="p-2 border rounded"
              >
                <Download size={16} />
              </button>

            )}

          </div>

        </div>

      )}

      {/* FILTERS */}

      {showFilters && (

        <div className="p-4 border-b grid grid-cols-2 md:grid-cols-4 gap-3">

          {columns.map((col) => (

            <input
              key={String(col.key)}
              placeholder={`Filter ${col.header}`}
              value={filters[col.key as string] || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  [col.key as string]: e.target.value
                })
              }
              className="border p-2 rounded text-sm"
            />

          ))}

        </div>

      )}

      {/* TABLE */}

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-gray-50">

            <tr>

              {columns.map((col) => (

                <th
                  key={String(col.key)}
                  className={`px-4 py-3 text-sm font-medium ${
                    col.align === "right"
                      ? "text-right"
                      : col.align === "center"
                      ? "text-center"
                      : "text-left"
                  }`}
                >

                  <button
                    onClick={() => col.sortable !== false && handleSort(String(col.key))}
                    className="flex items-center gap-1"
                  >

                    {col.header}

                    {col.sortable !== false && (

                      sortConfig?.key === String(col.key) ? (

                        sortConfig.direction === "asc" ?

                          <ArrowUp size={12} />

                          :

                          <ArrowDown size={12} />

                      ) : (

                        <ArrowUpDown size={12} />

                      )

                    )}

                  </button>

                </th>

              ))}

              {(onEdit || onDelete || onView) && (
                <th className="px-4 py-3 text-right text-sm">
                  Actions
                </th>
              )}

            </tr>

          </thead>

          <tbody>

            {processedData.length === 0 && (

              <tr>
                <td colSpan={columns.length + 1} className="text-center p-6">
                  No Data
                </td>
              </tr>

            )}

            {processedData.map((row, i) => (

              <tr
                key={i}
                onClick={() => onRowClick?.(row)}
                className="border-t hover:bg-gray-50"
              >

                {columns.map((col) => (

                  <td
                    key={String(col.key)}
                    className={`px-4 py-3 text-sm ${
                      col.align === "right"
                        ? "text-right"
                        : col.align === "center"
                        ? "text-center"
                        : "text-left"
                    }`}
                  >

                    {col.cell
                      ? col.cell(row)
                      : col.accessor
                      ? col.accessor(row)
                      : (row[col.key as keyof T] as ReactNode)}

                  </td>

                ))}

                {(onEdit || onDelete || onView) && (

                  <td className="px-4 py-3 text-right">

                    <div className="flex gap-2 justify-end">

                      {onView && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onView(row);
                          }}
                        >
                          <Eye size={16} />
                        </button>
                      )}

                      {onEdit && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(row);
                          }}
                        >
                          <Edit size={16} />
                        </button>
                      )}

                      {onDelete && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(row);
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}

                    </div>

                  </td>

                )}

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* PAGINATION */}

      {pagination && (

        <div className="flex justify-between items-center p-4 border-t">

          <button
            onClick={() => pagination.onPageChange(1)}
          >
            <ChevronsLeft size={18} />
          </button>

          <button
            onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
          >
            <ChevronLeft size={18} />
          </button>

          <span>
            Page {pagination.currentPage} / {pagination.totalPages}
          </span>

          <button
            onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
          >
            <ChevronRight size={18} />
          </button>

          <button
            onClick={() => pagination.onPageChange(pagination.totalPages)}
          >
            <ChevronsRight size={18} />
          </button>

        </div>

      )}

    </div>
  );
}