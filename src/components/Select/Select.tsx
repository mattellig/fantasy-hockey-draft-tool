import * as React from 'react';
import useControlledState from '../../hooks/useControlledState/useControlledState';

interface SelectProps {
    id: string;
    label: string;
    onChange?: React.ChangeEventHandler<HTMLSelectElement>;
    options: string[];
    required?: boolean;
    value?: string;
}

const Select = (props: SelectProps): JSX.Element => {
    const {
        id,
        label,
        onChange,
        options,
        required = false,
        value: valueProp,
    } = props;

    const [value, setValue] = useControlledState(valueProp);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setValue(event.target.value);

        if (onChange) {
            onChange(event);
        }
    };

    return (
        <div>
            <label
                className="block mb-1 text-sm font-medium text-gray-700"
                htmlFor={id}
            >
                {label}
                {required ? (
                    <span className="font-normal text-red-600" aria-hidden="true">
                        &nbsp;*
                    </span>
                ) : null}
            </label>
            <select
                className="w-full rounded-md border-gray-300 text-sm focus:ring focus:ring-blue-200 transition"
                id={id}
                onChange={handleChange}
                required={required}
                value={value}
            >
                {options.map((option) => (
                    <option key={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Select;
