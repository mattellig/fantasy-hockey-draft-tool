import * as React from 'react';
import PropTypes from 'prop-types';

const Link = ({ children, onClick, url }) => (
    <a
        href={url}
        onClick={onClick}
        className="rounded text-blue-600 underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
        {children}
    </a>
);

Link.propTypes = {
    children: PropTypes.node,
    onClick: PropTypes.func,
    url: PropTypes.string,
};

export default Link;
