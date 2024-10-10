import { Link } from 'react-router-dom';

interface TableProps<T> {
    columns: Array<{
        header: string;
        accessor: keyof T;
    }>;
    data: T[];
    currentPage: number;
    itemsPerPage: number;
    handlePrevPage: () => void;
    handleNextPage: () => void;
    handlePageChange: (pageNumber: number) => void;
    showProductQR?: boolean;
    showEdit?: boolean;
    showDelete?: boolean;
    showView?: boolean;
    editHeader?: string;
    // Custom styles for columns
    columnStyles?: { [key: string]: string }; 
     // Handler for edit action
    onEdit?: (item: T) => void;
    // Handler for delete action
    onDelete?: (item: T) => void; 
    // Handler for view action
    onView?: (item: T) => void; 
    iconsConfig?: { 
        // New prop for icon configuration
        editIcon?: string;
        deleteIcon?: string;
        viewIcon?: string;
    };
}

function stripHtmlTags(html: string): string {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
}

const TableComponent = <T,>({
    columns,
    data,
    currentPage,
    itemsPerPage,
    handlePrevPage,
    handleNextPage,
    handlePageChange,
    showProductQR = true,
    showEdit = true,
    showDelete = false,
    showView = false,
    editHeader = "Edit",
    columnStyles = {},
    onEdit,
    onDelete,
    onView,
    iconsConfig = {} 
}: TableProps<T>) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(data.length / itemsPerPage);
    return (
        <div className="table-responsive pt-2 overflow-y-auto ">
            <table className="table whitespace-nowrap min-w-full">
                <thead>
                    <tr>
                        <th className="text-start p-3 text-sm text-defaulttextcolor font-semibold border border-gray-300">S.No</th>
                        {columns.map((column) => (
                            <th key={column.header} className="text-start p-3 text-sm text-defaulttextcolor font-semibold border border-gray-300">
                                {column.header}
                            </th>
                        ))}
                        {showProductQR && (
                            <th className="text-start p-3 text-sm text-defaulttextcolor font-semibold border border-gray-300">Product QR</th>
                        )}
                        {(showEdit || showDelete || showView) && (
                            <th className="text-start p-3 text-sm text-defaulttextcolor font-semibold border border-gray-300">{editHeader}</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((item: any, index: any) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="p-3 text-defaultsize font-medium text-defaulttextcolor whitespace-nowrap border border-gray-300 border-b-0">{indexOfFirstItem + index + 1}</td>
                            {columns.map((column) => (
                                <td
                                    key={column.accessor as string}
                                    className={`p-3  text-defaultsize font-medium whitespace-nowrap border border-gray-300 border-b-0 ${columnStyles[column.header] || 'text-defaulttextcolor'}`}
                                >
                                    {typeof item[column.accessor] === 'string'
                                        ? stripHtmlTags(item[column.accessor] as string)
                                        : item[column.accessor]}
                                </td>
                            ))}
                            {showProductQR && (
                                <td className="p-3 text-defaultsize font-medium text-defaulttextcolor whitespace-nowrap border border-gray-300 border-b-0">
                                    <Link aria-label="anchor" to="#" className="link-icon bg-[var(--bg-primary)] hover:bg-[var(--primaries)] py-2 px-[10px] rounded-full mr-2">
                                        <i className={iconsConfig.editIcon || "ri-edit-line"}></i>
                                    </Link>
                                    <Link aria-label="anchor" to="#" className="link-icon bg-[var(--bg-primary)] hover:bg-[var(--primaries)] py-2 px-[10px] rounded-full mr-2">
                                        <i className={iconsConfig.deleteIcon || "ri-delete-bin-line"}></i>
                                    </Link>
                                    <Link aria-label="anchor" to="#" className="link-icon bg-[var(--bg-primary)] hover:bg-[var(--primaries)] py-2 px-[10px] rounded-full mr-2">
                                        <i className={iconsConfig.viewIcon || "ti ti-eye-check"}></i>
                                    </Link>
                                </td>
                            )}
                            {(showEdit || showDelete || showView) && (
                                <td className="p-3 text-defaultsize font-medium text-defaulttextcolor whitespace-nowrap border border-gray-300 border-b-0">
                                    {showEdit && (
                                        <button onClick={() => onEdit?.(item)} className="link-icon bg-[var(--bg-primary)] hover:bg-[var(--primaries)] py-2 px-[10px] rounded-full mr-2">
                                            <i className={iconsConfig.editIcon || "ri-edit-line"}></i>
                                        </button>
                                    )}
                                    {showDelete && (
                                        <button onClick={() => onDelete?.(item)} className="link-icon bg-[var(--bg-primary)] hover:bg-[var(--primaries)] py-2 px-[10px] rounded-full mr-2">
                                            <i className={iconsConfig.deleteIcon || "ri-delete-bin-line"}></i>
                                        </button>
                                    )}
                                    {showView && (
                                        <button onClick={() => onView?.(item)} className="link-icon bg-[var(--bg-primary)] hover:bg-[var(--primaries)] py-2 px-[10px] rounded-full mr-2">
                                            <i className={iconsConfig.viewIcon || "ti ti-eye-check"}></i>
                                        </button>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="box-footer p-4 border-t">
                <div className="sm:flex items-center">
                    <div className="text-defaulttextcolor dark:text-defaulttextcolor/70 font-normal text-defaultsize">
                        Showing {currentItems.length} Entries <i className="bi bi-arrow-right ms-2 font-semibold"></i>
                    </div>
                    <div className="ms-auto">
            <nav aria-label="Page navigation" className="pagination-style-4">
                <ul className="ti-pagination flex items-center px-3 mb-0">
                    <li className="page-item px-2">
                        <button
                            className="page-link"
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                        >
                            Prev
                        </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <li className="page-item px-2" key={index + 1}>
                            <button
                                className={`page-link px-2 rounded-md ${currentPage === index + 1 ? 'text-white bg-blue-800' : 'bg-gray-200'}`}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </button>
                        </li>
                    ))}
                    <li className="page-item px-2">
                        <button
                            className="page-link"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
                </div>
            </div>
        </div>
     
    );
};


export default TableComponent;
