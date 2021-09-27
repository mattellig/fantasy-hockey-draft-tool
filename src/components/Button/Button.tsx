import clsx from 'clsx';
import * as React from 'react';
import Spinner from '../Spinner/Spinner';

interface ButtonProps {
    children?: string | string[];
    disabled?: boolean;
    icon?: React.ReactNode;
    link?: boolean;
    loading?: boolean;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    primary?: boolean;
    submit?: boolean;
}

const Button = (props: ButtonProps): JSX.Element => {
    const {
        children,
        disabled = false,
        icon,
        link = false,
        loading = false,
        onClick,
        primary = false,
        submit = false,
    } = props;

    const styles = link ? clsx(
        'relative inline-flex items-center justify-center rounded text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed',
        loading && 'opacity-75 pointer-events-none',
    ) : clsx(
        'relative inline-flex items-center justify-center px-2.5 py-1.5 rounded-md border border-transparent text-sm font-medium focus:outline-none focus:ring transition disabled:opacity-50 disabled:cursor-not-allowed',
        primary ? 'bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700 focus:ring-blue-300' : 'bg-gray-200 text-gray-700 hover:bg-gray-100 active:bg-gray-300 focus:ring-gray-400',
        loading && 'opacity-75 pointer-events-none',
    );

    return (
        <button
            disabled={disabled || loading}
            onClick={onClick}
            type={submit ? 'submit' : 'button'}
            className={styles}
        >
            {loading ? (
                <div className="-ml-px mr-1.5">
                    <Spinner />
                </div>
            ) : icon ? (
                <div className="h-4 w-4 -ml-px mr-1.5">
                    {icon}
                </div>
            ) : null}
            {children}
        </button>
    );
};

export default Button;
