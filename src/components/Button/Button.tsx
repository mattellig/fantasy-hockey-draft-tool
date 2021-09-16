import clsx from 'clsx';
import * as React from 'react';
import Spinner from '../Spinner/Spinner';

interface ButtonProps {
    children?: string | string[];
    disabled?: boolean;
    icon?: React.ReactNode;
    loading?: boolean;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    primary?: boolean;
    submit?: boolean;
}

const getButtonStyles = (disabled: boolean, primary: boolean) => clsx(
    'relative inline-flex items-center justify-center px-2.5 py-1.5 rounded-md border border-transparent text-sm font-medium focus:outline-none focus:ring transition',
    primary ? 'bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700 focus:ring-blue-300' : 'bg-gray-200 text-gray-700 hover:bg-gray-100 active:bg-gray-300 focus:ring-gray-400',
    disabled && 'opacity-50 cursor-not-allowed',
);

const Button = (props: ButtonProps): JSX.Element => {
    const {
        children,
        disabled = false,
        icon,
        loading = false,
        onClick,
        primary = false,
        submit = false,
    } = props;

    const styles = getButtonStyles(disabled, primary);

    return (
        <button
            disabled={disabled}
            onClick={onClick}
            type={submit ? 'submit' : 'button'}
            className={styles}
        >
            {loading ? (
                <div className="-ml-px mr-2">
                    <Spinner />
                </div>
            ) : icon ? (
                <div className="h-4 w-4 -ml-px mr-2">
                    {icon}
                </div>
            ) : null}
            {children}
        </button>
    );
};

export default Button;
