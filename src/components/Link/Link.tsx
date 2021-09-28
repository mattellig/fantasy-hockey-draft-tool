import clsx from 'clsx';
import * as React from 'react';

interface LinkProps {
    children?: React.ReactNode;
    href?: string;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
    removeUnderline?: boolean;
}

export const getLinkStyles = (removeUnderline: boolean) => clsx(
    'rounded text-blue-600',
    !removeUnderline && 'underline hover:no-underline',
    'hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 transition',
);

const Link = (props: LinkProps): JSX.Element => {
    const {
        children,
        href,
        onClick,
        removeUnderline = false,
    } = props;

    const styles = getLinkStyles(removeUnderline);

    return (
        <a
            href={href}
            onClick={onClick}
            className={styles}
        >
            {children}
        </a>
    );
};

export default Link;
