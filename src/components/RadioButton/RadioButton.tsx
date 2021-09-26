import * as React from 'react';
import useControlledState from '../../hooks/useControlledState/useControlledState';

interface RadioButtonProps {
    checked?: boolean;
    helpText?: string;
    id: string;
    label: string;
    name?: string;
    onChange?: (checked: boolean, id: string) => void;
    value?: string;
}

const RadioButton = (props: RadioButtonProps): JSX.Element => {
    const {
        checked: checkedProp = false,
        helpText,
        id,
        label,
        name,
        onChange,
        value,
    } = props;

    const [checked, setChecked] = useControlledState(checkedProp);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = event.target;

        setChecked(checked);

        if (onChange) {
            onChange(checked, id);
        }
    };

    return (
        <label htmlFor={id} className="inline-flex py-1 cursor-pointer">
            <input
                checked={checked}
                className="h-[18px] w-[18px] mr-2 border-2 border-gray-500 cursor-pointer hover:border-gray-400 focus:ring-offset-1 transition"
                id={id}
                name={name}
                onChange={handleChange}
                type="radio"
                value={value}
            />
            <div>
                <div className="leading-1 text-sm text-gray-800">
                    {label}
                </div>
                {helpText ? (
                    <div className="mt-1 text-sm text-gray-500">
                        {helpText}
                    </div>
                ) : null}
            </div>
        </label>
    );
};

export default RadioButton;
