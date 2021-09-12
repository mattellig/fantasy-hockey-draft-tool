import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Spinner from '../Spinner/Spinner';

const getButtonStyles = (disabled, primary) => clsx(
    'relative inline-flex items-center justify-center px-3 py-2 rounded-md border border-transparent text-sm font-medium focus:outline-none focus:ring transition',
    primary ? 'bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700 focus:ring-blue-300' : 'bg-gray-200 text-gray-700 hover:bg-gray-100 active:bg-gray-300 focus:ring-gray-400',
    disabled && 'opacity-50 cursor-not-allowed',
);

const Button = (props) => {
    const {
        children,
        disabled,
        icon,
        loading,
        onClick,
        primary,
        submit,
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

Button.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
    ]),
    disabled: PropTypes.bool,
    icon: PropTypes.node,
    loading: PropTypes.bool,
    onClick: PropTypes.func,
    primary: PropTypes.bool,
    submit: PropTypes.bool,
};

export default Button;
