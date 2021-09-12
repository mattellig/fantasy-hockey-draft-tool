import * as React from 'react';

interface LinkProps {
    children?: React.ReactNode;
    onClick?: React.MouseEventHandler;
    url?: string;
}

const Link = ({ children, onClick, url }: LinkProps): JSX.Element => (
    <a
        href={url}
        onClick={onClick}
        className="rounded text-blue-600 underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
        {children}
    </a>
);

export default Link;
