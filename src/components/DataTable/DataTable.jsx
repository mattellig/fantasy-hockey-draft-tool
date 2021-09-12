import clsx from 'clsx';
import PropTypes from 'prop-types';
import * as React from 'react';

const DataTable = ({ children, headings = [] }) => (
    <div className="relative overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr>
                        {headings.map((heading, index) => {
                            const styles = clsx(
                                'p-2 border-b text-xs font-medium text-gray-800',
                                (!heading.align || heading.align === 'left') && 'text-left',
                                heading.align === 'right' && 'text-right',
                                heading.align === 'center' && 'text-center',
                            );

                            return (
                                <th key={index} className={styles}>
                                    {heading.title}
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {children}
                </tbody>
            </table>
        </div>
    </div>
);

DataTable.propTypes = {
    children: PropTypes.node,
    headings: PropTypes.arrayOf(PropTypes.object),
};

const Row = ({ children }) => (
    <tr className="bg-white hover:bg-gray-50 transition-colors">
        {children}
    </tr>
);

Row.propTypes = {
    children: PropTypes.node,
};

const Cell = ({ align, children, colSpan }) => (
    <td
        align={align}
        colSpan={colSpan}
        className="p-2 text-sm whitespace-nowrap"
    >
        {children}
    </td>
);

Cell.propTypes = {
    align: PropTypes.string,
    children: PropTypes.node,
    colSpan: PropTypes.number,
};

DataTable.Cell = Cell;
DataTable.Row = Row;

export default DataTable;
