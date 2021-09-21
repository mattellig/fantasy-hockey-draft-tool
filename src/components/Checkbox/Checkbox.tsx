import * as React from 'react';
import useControlledState from '../../hooks/useControlledState/useControlledState';

interface CheckboxProps {
    checked?: boolean;
    id: string;
    label: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const Checkbox = (props: CheckboxProps): JSX.Element => {
    const {
        checked: checkedProp = false,
        id,
        label,
        onChange,
    } = props;

    const [checked, setChecked] = useControlledState(checkedProp);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);

        if (onChange) {
            onChange(event);
        }
    };

    return (
        <label htmlFor={id} className="inline-flex items-center py-1 cursor-pointer">
            <input
                checked={checked}
                id={id}
                onChange={handleChange}
                type="checkbox"
                className="h-[18px] w-[18px] mr-2 rounded-sm border-2 border-gray-500 cursor-pointer hover:border-gray-400 focus:ring-offset-1 transition"
            />
            <span className="text-sm text-gray-700">
                {label}
            </span>
        </label>
    );
};

export default Checkbox;
