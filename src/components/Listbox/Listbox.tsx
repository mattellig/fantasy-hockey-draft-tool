import * as React from 'react';
import { Listbox as HeadlessListbox, Transition } from '@headlessui/react';
import useControlledState from '../../hooks/useControlledState/useControlledState';
import { ChevronDownIcon } from '@heroicons/react/outline';
import clsx from 'clsx';

interface ListboxProps<T> {
    label: string;
    onChange?: (newValue: T) => void;
    options: T[];
    optionTransform: (option: T) => React.ReactNode;
    value: T;
}

const Listbox = <T extends unknown>(props: ListboxProps<T>): JSX.Element => {
    const {
        label,
        onChange,
        options,
        optionTransform,
        value: valueProp,
    } = props;

    const [value, setValue] = useControlledState(valueProp);

    const handleChange = (newValue: T) => {
        setValue(newValue);

        if (onChange) {
            onChange(newValue);
        }
    };

    return (
        <HeadlessListbox onChange={handleChange} value={value}>
            <HeadlessListbox.Label className="block mb-1 text-sm font-medium text-gray-700">
                {label}
            </HeadlessListbox.Label>
            <div className="relative">
                <HeadlessListbox.Button
                    className="relative w-full py-2 pl-3 pr-10 rounded-md border border-gray-300 bg-white text-left text-sm focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200 transition"
                >
                    <span className="block truncate">
                        {optionTransform(value)}
                    </span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <ChevronDownIcon className="h-4 w-4 text-gray-600" />
                    </span>
                </HeadlessListbox.Button>
                <Transition
                    as={React.Fragment}
                    leave="transition-opacity ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <HeadlessListbox.Options
                        className="absolute z-20 max-h-60 w-full overflow-auto py-1 mt-1 rounded-md bg-white shadow-lg text-sm ring-1 ring-black ring-opacity-5 focus:outline-none"
                    >
                        {options.map((o, index) => (
                            <HeadlessListbox.Option
                                key={index}
                                className={({ active }) => clsx(
                                    'relative px-3 py-1.5 text-gray-800 select-none cursor-default',
                                    active && 'bg-gray-200',
                                )}
                                value={o}
                            >
                                {optionTransform(o)}
                            </HeadlessListbox.Option>
                        ))}
                    </HeadlessListbox.Options>
                </Transition>
            </div>
        </HeadlessListbox>
    );
};

export default Listbox;
