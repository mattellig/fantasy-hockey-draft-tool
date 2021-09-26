import clsx from 'clsx';
import * as React from 'react';

interface TopBarProps {
    children?: React.ReactNode;
}

interface SectionProps {
    children?: React.ReactNode;
    end?: boolean;
}

const TopBar = ({ children }: TopBarProps): JSX.Element => (
    <div className="relative z-10 flex flex-col justify-between w-full bg-blue-600 text-white">
        <div className="relative flex w-full h-12">
            {children}
        </div>
    </div>
);

const Section = ({ children, end }: SectionProps): JSX.Element => {
    const styles = clsx(
        'inline-flex items-center',
        end ? 'justify-end' : 'justify-start',
        'flex-auto min-w-0 px-3 py-2',
    );

    return (
        <div className={styles}>
            {children}
        </div>
    );
};

TopBar.Section = Section;

export default TopBar;
