import clsx from 'clsx';
import * as React from 'react';
import Spinner from '../Spinner/Spinner';

interface ButtonProps {
    children?: string | string[];
    destructive?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
    link?: boolean;
    loading?: boolean;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    primary?: boolean;
    submit?: boolean;
}

const getButtonStyles = (loading: boolean, link: boolean, destructive: boolean, primary: boolean) => {
    let colorClasses = '';

    if (primary) {
        colorClasses = 'bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700 focus:ring-blue-300';
    } else if (destructive) {
        colorClasses = 'bg-red-600 text-white hover:bg-red-500 active:bg-red-700 focus:ring-red-300';
    } else if (link) {
        colorClasses = 'text-blue-600 hover:text-blue-800 disabled:text-gray-700 focus:ring-blue-500';
    } else {
        colorClasses = 'bg-gray-200 text-gray-700 hover:bg-gray-100 active:bg-gray-300 focus:ring-gray-400';
    }

    return clsx(
        'relative inline-flex items-center justify-center rounded-md text-sm font-medium focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition',
        !link ? 'px-2.5 py-1.5 focus:ring' : 'focus:ring-2',
        colorClasses,
        loading && 'opacity-75 pointer-events-none',
    );
};

const Button = (props: ButtonProps): JSX.Element => {
    const {
        children,
        destructive = false,
        disabled = false,
        icon,
        link = false,
        loading = false,
        onClick,
        primary = false,
        submit = false,
    } = props;

    const styles = getButtonStyles(loading, link, destructive, primary);

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
