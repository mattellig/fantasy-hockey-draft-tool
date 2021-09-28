import * as React from 'react';
import Button from '../../../../components/Button/Button';
import Checkbox from '../../../../components/Checkbox/Checkbox';
import DataTable from '../../../../components/DataTable/DataTable';
import Input from '../../../../components/Input/Input';
import Select from '../../../../components/Select/Select';
import Spinner from '../../../../components/Spinner/Spinner';
import { ScoringSettings, useSettings } from '../../../../contexts/SettingsContext/SettingsContext';
import { PlayerData, PlayerStats } from '../../../../hooks/usePlayerData/usePlayerData';
import useTableHeadings from './useTableHeadings';

interface PlayersTableProps {
    canDraftPlayers: boolean;
    data: PlayerData[] | undefined;
    draftedPlayers: PlayerData[];
    loading: boolean;
    onDraftPlayer: (player: PlayerData) => void;
}

const headingsToSettingsMap: Record<string, keyof ScoringSettings> = {
    G: 'goals',
    A: 'assists',
    PTS: 'points',
    '+/-': 'plusMinus',
    PIM: 'penaltyMinutes',
    PPG: 'powerplayGoals',
    PPA: 'powerplayAssists',
    PPP: 'powerplayPoints',
    GWG: 'gameWinningGoals',
    SOG: 'shotsOnGoal',
    FOW: 'faceoffsWon',
    FOL: 'faceoffsLost',
    HIT: 'hits',
    BLK: 'blocks',
    W: 'wins',
    L: 'losses',
    GA: 'goalsAgainst',
    GAA: 'goalsAgainstAverage',
    SV: 'saves',
    'SV%': 'savePercentage',
    SO: 'shutouts',
};

const positionFilterOptions = [
    'All positions',
    'Forwards & defensemen',
    'Forwards only',
    'G',
    'C',
    'LW',
    'RW',
    'D',
];

const formatStat = (value: number | null, key: keyof ScoringSettings) => {
    if (value === null) {
        return null;
    }

    switch (key) {
        case 'goalsAgainstAverage':
            return value.toFixed(2);
        case 'savePercentage':
            return value.toFixed(3);
        default:
            return value.toFixed(0);
    }
};

const PlayersTable = (props: PlayersTableProps): JSX.Element => {
    const {
        canDraftPlayers,
        data,
        draftedPlayers,
        loading,
        onDraftPlayer,
    } = props;

    const [playerSearch, setPlayerSearch] = React.useState('');
    const [positionFilter, setPositionFilter] = React.useState('All positions');
    const [showDrafted, setShowDrafted] = React.useState(false);
    const [sort, setSort] = React.useState({ index: 6, direction: 'descending' });

    const [settings] = useSettings();

    const scoringSettingEntries = React.useMemo(() => Object.entries(settings.scoring), [settings]);
    const tableHeadings = useTableHeadings(scoringSettingEntries);

    const sortedData = React.useMemo(() => {
        if (!data) return undefined;

        let sortFunction;

        const columnToSort = tableHeadings[sort.index]?.title;
        switch (columnToSort) {
            case 'Rank':
                sortFunction = ((a: PlayerData, b: PlayerData) => sort.direction === 'descending'
                    ? b.rank - a.rank
                    : a.rank - b.rank
                );
                break;
            case 'FP':
                sortFunction = ((a: PlayerData, b: PlayerData) => sort.direction === 'descending'
                    ? b.fantasyPoints - a.fantasyPoints
                    : a.fantasyPoints - b.fantasyPoints
                );
                break;
            case 'VORP':
                sortFunction = ((a: PlayerData, b: PlayerData) => sort.direction === 'descending'
                    ? b.valueOverReplacement - a.valueOverReplacement
                    : a.valueOverReplacement - b.valueOverReplacement
                );
                break;
            case 'ADP':
                sortFunction = ((a: PlayerData, b: PlayerData) => sort.direction === 'descending'
                    ? (b.averageDraftPosition || 0) - (a.averageDraftPosition || 0)
                    : (a.averageDraftPosition || 0) - (b.averageDraftPosition || 0)
                );
                break;
            case 'Diff.':
                sortFunction = ((a: PlayerData, b: PlayerData) => sort.direction === 'descending'
                    ? (b.difference || 0) - (a.difference || 0)
                    : (a.difference || 0) - (b.difference || 0)
                );
                break;
            case 'GP':
                sortFunction = ((a: PlayerData, b: PlayerData) => sort.direction === 'descending'
                    ? (b.gamesPlayed || 0) - (a.gamesPlayed || 0)
                    : (a.gamesPlayed || 0) - (b.gamesPlayed || 0)
                );
                break;
            default: {
                const key = headingsToSettingsMap[columnToSort];
                sortFunction = ((a: PlayerData, b: PlayerData) => sort.direction === 'descending'
                    ? (b.totals[key] || 0) - (a.totals[key] || 0)
                    : (a.totals[key] || 0) - (b.totals[key] || 0)
                );
                break;
            }
        }

        return [...data].sort(sortFunction);
    }, [data, sort]);

    const filteredData = React.useMemo(() => {
        if (!sortedData) return undefined;

        let dataCopy = [...sortedData];

        if (!showDrafted) {
            dataCopy = dataCopy.filter((pd) => !draftedPlayers.includes(pd));
        }

        switch (positionFilter) {
            case 'All positions':
                break;
            case 'Forwards & defensemen':
                dataCopy = dataCopy.filter((pd) => pd.position?.toLowerCase() !== 'g');
                break;
            case 'Forwards only':
                dataCopy = dataCopy.filter((pd) => {
                    const position = pd.position?.toLowerCase();
                    return position !== 'g' && position !== 'd';
                });
                break;
            default: {
                const positionToSearch = positionFilter.toLowerCase();
                dataCopy = dataCopy.filter((pd) => pd.position?.toLowerCase().includes(positionToSearch));
                break;
            }
        }

        if (playerSearch) {
            dataCopy = dataCopy.filter((pd) => pd.name?.toLowerCase().includes(playerSearch.toLowerCase()));
        }

        return dataCopy;
    }, [draftedPlayers, playerSearch, positionFilter, showDrafted, sortedData]);

    return (
        <>
            <div className="px-4 md:px-6 mb-4">
                <h2 className="mb-2 text-lg font-medium text-gray-800">
                    Players
                </h2>
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-3">
                        <Input
                            id="search-players-input"
                            label="Find player by name"
                            onChange={(value) => setPlayerSearch(value)}
                            type="search"
                            value={playerSearch}
                        />
                    </div>
                    <div className="col-span-2">
                        <Select
                            id="position-select"
                            label="Position"
                            onChange={(value) => setPositionFilter(value)}
                            options={positionFilterOptions}
                            value={positionFilter}
                        />
                    </div>
                    <div className="col-span-2 flex items-end pb-1.5">
                        <Checkbox
                            checked={showDrafted}
                            id="show-drafted-checkbox"
                            label="Show drafted"
                            onChange={(checked) => setShowDrafted(checked)}
                        />
                    </div>
                </div>
            </div>
            <DataTable
                headings={tableHeadings}
                initialSortColumnIndex={6}
                initialSortDirection="descending"
                onSort={(index, direction) => setSort({ index, direction })}
            >
                {loading ? (
                    <DataTable.Row>
                        <DataTable.Cell align="center" colSpan={tableHeadings.length}>
                            <div className="flex items-center justify-center gap-2">
                                <div className="text-blue-500">
                                    <Spinner />
                                </div>
                                <div className="text-sm text-gray-500 animate-pulse">
                                    Parsing data...
                                </div>
                            </div>
                        </DataTable.Cell>
                    </DataTable.Row>
                ) : filteredData?.length ? filteredData.map((row) => (
                    <DataTable.Row key={`${row.name}-${row.position}`}>
                        <DataTable.Cell align="right" collapsing>
                            {row.rank}
                        </DataTable.Cell>
                        <DataTable.Cell>
                            {row.name}
                        </DataTable.Cell>
                        <DataTable.Cell align="center">
                            {row.team}
                        </DataTable.Cell>
                        <DataTable.Cell align="center">
                            {row.position}
                        </DataTable.Cell>
                        <DataTable.Cell align="center" collapsing flush>
                            <div className="p-0.5">
                                <Button
                                    disabled={!canDraftPlayers || draftedPlayers.includes(row)}
                                    link
                                    onClick={() => onDraftPlayer(row)}
                                >
                                    Draft
                                </Button>
                            </div>
                        </DataTable.Cell>
                        <DataTable.Cell align="right">
                            {row.fantasyPoints.toFixed(1)}
                        </DataTable.Cell>
                        <DataTable.Cell align="right">
                            {row.valueOverReplacement.toFixed(1)}
                        </DataTable.Cell>
                        <DataTable.Cell align="right">
                            {row.averageDraftPosition?.toFixed(1)}
                        </DataTable.Cell>
                        <DataTable.Cell align="right">
                            {row.difference?.toFixed(1)}
                        </DataTable.Cell>
                        <DataTable.Cell align="right">
                            {row.gamesPlayed}
                        </DataTable.Cell>
                        {scoringSettingEntries.map(([key, value]) => value ? (
                            <DataTable.Cell key={key} align="right">
                                {formatStat(row.totals[key as keyof PlayerStats], key as keyof ScoringSettings)}
                            </DataTable.Cell>
                        ) : null)}
                    </DataTable.Row>
                )) : (
                    <DataTable.Row>
                        <DataTable.Cell align="center" colSpan={tableHeadings.length}>
                            <p className="text-sm text-gray-500">
                                No results found.
                            </p>
                        </DataTable.Cell>
                    </DataTable.Row>
                )}
            </DataTable>
        </>
    );
};

export default PlayersTable;
