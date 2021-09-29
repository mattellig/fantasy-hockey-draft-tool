import * as React from 'react';
import { Tab } from '@headlessui/react';
import clsx from 'clsx';

interface TabsProps {
    tabs: {
        content: React.ReactNode;
        title: string;
    }[];
}

const getTabStyles = (selected: boolean) => clsx(
    'px-4 py-2 -mb-px mr-1 border-b-2 text-sm font-medium hover:border-gray-500 hover:text-gray-800 transition-colors',
    selected ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500',
);

const Tabs = ({ tabs }: TabsProps): JSX.Element => (
    <Tab.Group>
        <div className="border-b">
            <Tab.List className="flex flex-wrap">
                {tabs.map((tab, index) => (
                    <Tab
                        key={index}
                        className={({ selected }) => getTabStyles(selected)}
                    >
                        {tab.title}
                    </Tab>
                ))}
            </Tab.List>
        </div>
        <Tab.Panels>
            {tabs.map((tab, index) => (
                <Tab.Panel key={index} className="pt-4">
                    {tab.content}
                </Tab.Panel>
            ))}
        </Tab.Panels>
    </Tab.Group>
);

export default Tabs;
