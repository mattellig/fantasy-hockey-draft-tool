import * as React from 'react';
import usePlayerData from '../../hooks/usePlayerData/usePlayerData';
import PlayersTable from './components/PlayersTable/PlayersTable';

const Draft = (): JSX.Element => {
    const { data, loading } = usePlayerData();

    return (
        <PlayersTable
            data={data}
            loading={loading}
        />
    );
};

export default Draft;
