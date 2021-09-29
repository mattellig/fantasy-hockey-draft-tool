import * as React from 'react';
import useControlledState from '../../hooks/useControlledState/useControlledState';

interface InputProps {
    id: string;
    hiddenLabel?: boolean;
    label: string;
    max?: number;
    min?: number;
    onChange?: (value: string, id: string) => void;
    placeholder?: string;
    required?: boolean;
    step?: number;
    type?: 'text' | 'number' | 'search';
    value?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref): JSX.Element => {
    const {
        hiddenLabel = false,
        id,
        label,
        max,
        min,
        onChange,
        placeholder,
        required = false,
        step,
        type = 'text',
        value: valueProp,
    } = props;

    const [value, setValue] = useControlledState(valueProp);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
            <input
                ref={ref}
                className="w-full rounded-md border-gray-300 text-sm focus:ring focus:ring-blue-200 transition"
                id={id}
                max={max}
                min={min}
                onChange={handleChange}
                placeholder={placeholder}
                required={required}
                step={step}
                type={type}
                value={value}
            />
        </div>
    );
});

export default Input;
