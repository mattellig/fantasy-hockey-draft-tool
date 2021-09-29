import * as React from 'react';
import useControlledState from '../../hooks/useControlledState/useControlledState';

interface SelectProps {
    disabled?: boolean;
    hiddenLabel?: boolean;
    id: string;
    label: string;
    onChange?: (value: string, id: string) => void;
    options: string[];
    required?: boolean;
    value?: string;
}

const Select = (props: SelectProps): JSX.Element => {
    const {
        disabled = false,
        hiddenLabel = false,
        id,
        label,
        onChange,
        options,
        required = false,
        value: valueProp,
    } = props;

    const [value, setValue] = useControlledState(valueProp);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = event.target;

        setValue(value);

        if (onChange) {
            onChange(value, id);
        }
    };

    return (
        <div>
            <label
                className={hiddenLabel ? 'sr-only' : 'block mb-1 text-sm font-medium text-gray-700'}
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
                className="w-full rounded-md border-gray-300 text-sm focus:ring focus:ring-blue-200 disabled:opacity-50 transition"
                disabled={disabled}
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
