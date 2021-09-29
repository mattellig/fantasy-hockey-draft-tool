import { ArrowSmDownIcon, ArrowSmUpIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import * as React from 'react';

type TableCellAlign = 'left' | 'center' | 'right';

export interface DataTableHeading {
    align?: TableCellAlign;
    defaultSortDirection?: SortDirection;
    sortable?: boolean;
    title: string;
}

type SortDirection = 'ascending' | 'descending';

interface DataTableProps {
    children?: React.ReactNode;
    headings?: DataTableHeading[];
    initialSortColumnIndex?: number;
    initialSortDirection?: SortDirection;
    onSort?: (index: number, direction: SortDirection) => void;
}

interface RowProps {
    children?: React.ReactNode;
    selected?: boolean;
}

interface HeadingCellProps extends DataTableHeading {
    currentSortDirection: SortDirection;
    isCurrentSort: boolean;
    onSort: () => void;
}

interface CellProps {
    align?: TableCellAlign;
    children?: React.ReactNode;
    collapsing?: boolean;
    colSpan?: number;
    flush?: boolean;
}

const HeadingCell = (props: HeadingCellProps) => {
    const {
        align = 'left',
        currentSortDirection,
        defaultSortDirection = 'ascending',
        isCurrentSort = false,
        onSort,
        sortable = false,
        title,
    } = props;

    const cellStyles = 'border-b text-xs font-medium text-gray-800';

    if (!sortable) {
        return (
            <th align={align} className={`p-2 ${cellStyles}`}>
                {title}
            </th>
        );
    }

    const buttonStyles = clsx(
        'group inline-flex items-center space-x-0.5 p-2 font-medium hover:text-blue-800 transition-colors',
        align === 'right' && 'flex-row-reverse',
    );

    const iconStyles = clsx(
        'h-4 w-4 -ml-1 text-gray-500 group-hover:text-blue-800 transition',
        !isCurrentSort && 'opacity-0 group-hover:opacity-100',
    );

    let Icon = ArrowSmUpIcon;
    if ((isCurrentSort && currentSortDirection === 'descending') || (!isCurrentSort && defaultSortDirection === 'descending')) {
        Icon = ArrowSmDownIcon;
    }

    return (
        <th align={align} className={cellStyles}>
            <button
                className={buttonStyles}
                onClick={onSort}
                type="button"
            >
                <span>
                    {title}
                </span>
                <Icon className={iconStyles} />
            </button>
        </th>
    );
};

const DataTable = (props: DataTableProps): JSX.Element => {
    const {
        children,
        headings = [],
        initialSortColumnIndex,
        initialSortDirection = 'ascending',
        onSort,
    } = props;

    const [sortDirection, setSortDirection] = React.useState(initialSortDirection);
    const [sortIndex, setSortIndex] = React.useState(initialSortColumnIndex);

    const handleSort = (index: number) => {
        let newSortDirection = headings[index]?.defaultSortDirection || 'ascending';
        if (index === sortIndex) {
            newSortDirection = sortDirection === 'ascending' ? 'descending' : 'ascending';
        }

        setSortIndex(index);
        setSortDirection(newSortDirection);

        if (onSort) {
            onSort(index, newSortDirection);
        }
    };

    return (
        <div className="relative overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr>
                            {headings.map((heading, index) => (
                                <HeadingCell
                                    {...heading}
                                    key={index}
                                    currentSortDirection={sortDirection}
                                    isCurrentSort={index === sortIndex}
                                    onSort={() => handleSort(index)}
                                />
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {children}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const Row = ({ children, selected }: RowProps): JSX.Element => (
    <tr className={clsx(
        selected ? 'bg-blue-50/70 hover:bg-blue-100/50' : 'hover:bg-gray-50',
        'transition-colors',
    )}>
        {children}
    </tr>
);

const Cell = (props: CellProps): JSX.Element => {
    const {
        align,
        children,
        collapsing = false,
        colSpan,
        flush = false,
    } = props;

    const styles = clsx(
        collapsing && 'w-px',
        !flush && 'p-2',
        'text-sm whitespace-nowrap',
    );

    return (
        <td
            align={align}
            colSpan={colSpan}
            className={styles}
        >
            {children}
        </td>
    );
};

DataTable.Cell = Cell;
DataTable.Row = Row;

export default DataTable;
