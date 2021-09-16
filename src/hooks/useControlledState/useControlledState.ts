import * as React from 'react';

const useControlledState = <T>(valueProp: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const [value, setValue] = React.useState<T>(valueProp);

    React.useEffect(() => {
        setValue(valueProp);
    }, [valueProp]);

    return [value, setValue];
};

export default useControlledState;
