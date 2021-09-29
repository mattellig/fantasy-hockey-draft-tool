import { StarIcon } from '@heroicons/react/outline';
import { StarIcon as FilledStarIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import * as React from 'react';
import Button from '../../../../components/Button/Button';
import Checkbox from '../../../../components/Checkbox/Checkbox';
import DataTable, { DataTableHeading } from '../../../../components/DataTable/DataTable';
import Input from '../../../../components/Input/Input';
import Select from '../../../../components/Select/Select';
import Spinner from '../../../../components/Spinner/Spinner';
import { acronymToSettingsMap, ScoringSettings, settingsToAcronymMap, useSettings } from '../../../../contexts/SettingsContext/SettingsContext';
import { PlayerData, PlayerStats } from '../../../../hooks/usePlayerData/usePlayerData';
import sortByStatistic from '../../../../utils/sortByStatistic/sortByStatistic';

interface PlayersTableProps {
    canDraftPlayers: boolean;
    data: PlayerData[] | undefined;
    draftedPlayers: PlayerData[];
    flaggedPlayers: PlayerData[];
    loading: boolean;
    onDraftPlayer: (player: PlayerData) => void;
    onFlagPlayer: (player: PlayerData) => void;
}

const fixedHeadings: DataTableHeading[] = [
    { title: 'Rank', align: 'right', sortable: true },
    { title: '' },
    { title: 'Name' },
    { title: 'Team', align: 'center' },
    { title: 'Pos', align: 'center' },
    { title: 'Draft', align: 'center' },
    { title: 'FP', align: 'right', defaultSortDirection: 'descending', sortable: true },
    { title: 'VORP', align: 'right', defaultSortDirection: 'descending', sortable: true },
    { title: 'ADP', align: 'right', sortable: true },
    { title: 'Diff.', align: 'right', defaultSortDirection: 'descending', sortable: true },
    { title: 'GP', align: 'right', defaultSortDirection: 'descending', sortable: true },
];

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
        flaggedPlayers,
        loading,
        onDraftPlayer,
        onFlagPlayer,
    } = props;

    const [playerSearch, setPlayerSearch] = React.useState('');
    const [positionFilter, setPositionFilter] = React.useState('All positions');
    const [showDrafted, setShowDrafted] = React.useState(false);
    const [sort, setSort] = React.useState({ index: 7, direction: 'descending' });

    const [settings] = useSettings();

    const scoringSettingEntries = React.useMemo(() => Object.entries(settings.scoring), [settings]);
    const tableHeadings = React.useMemo(() => {
        const headings = [...fixedHeadings];

        for (const [key, value] of scoringSettingEntries) {
            if (value) {
                headings.push({
                    align: 'right',
                    defaultSortDirection: 'descending',
                    sortable: true,
                    title: settingsToAcronymMap[key as keyof ScoringSettings],
                });
            }
        }

        return headings;
    }, [scoringSettingEntries]);

    const sortedData = React.useMemo(() => {
        if (!data) return undefined;

        let compareFn;

        const columnToSort = tableHeadings[sort.index]?.title;
        switch (columnToSort) {
            case 'Rank':
                compareFn = ((a: PlayerData, b: PlayerData) => sortByStatistic(
                    a.rank,
                    b.rank,
                    sort.direction === 'ascending',
                ));
                break;
            case 'FP':
                compareFn = ((a: PlayerData, b: PlayerData) => sortByStatistic(
                    a.fantasyPoints,
                    b.fantasyPoints,
                    sort.direction === 'ascending',
                ));
                break;
            case 'VORP':
                compareFn = ((a: PlayerData, b: PlayerData) => sortByStatistic(
                    a.valueOverReplacement,
                    b.valueOverReplacement,
                    sort.direction === 'ascending',
                ));
                break;
            case 'ADP':
                compareFn = ((a: PlayerData, b: PlayerData) => sortByStatistic(
                    a.averageDraftPosition,
                    b.averageDraftPosition,
                    sort.direction === 'ascending',
                ));
                break;
            case 'Diff.':
                compareFn = ((a: PlayerData, b: PlayerData) => sortByStatistic(
                    a.difference,
                    b.difference,
                    sort.direction === 'ascending',
                ));
                break;
            case 'GP':
                compareFn = ((a: PlayerData, b: PlayerData) => sortByStatistic(
                    a.gamesPlayed,
                    b.gamesPlayed,
                    sort.direction === 'ascending',
                ));
                break;
            default: {
                const key = acronymToSettingsMap[columnToSort];
                compareFn = ((a: PlayerData, b: PlayerData) => sortByStatistic(
                    a.totals[key],
                    b.totals[key],
                    sort.direction === 'ascending',
                ));
                break;
            }
        }

        return [...data].sort(compareFn);
    }, [data, sort, tableHeadings]);

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
            <h2 className="sr-only">
                Players
            </h2>
            <div className="px-4 md:px-6 mb-4">
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
                initialSortColumnIndex={7}
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
                ) : filteredData?.length ? filteredData.map((row) => {
                    const playerIsFlagged = flaggedPlayers.includes(row);

                    return (
                        <DataTable.Row
                            key={`${row.name}-${row.position}`}
                            selected={playerIsFlagged}
                        >
                            <DataTable.Cell align="right" collapsing>
                                {row.rank}
                            </DataTable.Cell>
                            <DataTable.Cell collapsing>
                                <button
                                    className={clsx(
                                        'inline-flex items-center justify-center p-0.5 align-middle transition-colors',
                                        playerIsFlagged ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600',
                                    )}
                                    onClick={() => onFlagPlayer(row)}
                                    type="button"
                                    aria-label={playerIsFlagged ? 'Unflag player' : 'Flag player'}
                                >
                                    {playerIsFlagged ? (
                                        <FilledStarIcon className="h-4 w-4" />
                                    ) : (
                                        <StarIcon className="h-4 w-4" />
                                    )}
                                </button>
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
                    );
                }) : (
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
