import * as React from 'react';
import DataTable, { DataTableHeading } from '../../../../components/DataTable/DataTable';
import { acronymToSettingsMap, myTeamId, ScoringSettings, settingsToAcronymMap, Team, useSettings } from '../../../../contexts/SettingsContext/SettingsContext';
import { PlayerStats } from '../../../../hooks/usePlayerData/usePlayerData';
import sortByStatistic from '../../../../utils/sortByStatistic/sortByStatistic';
import { DraftPick } from '../../Draft';

interface StandingsProps {
    draftPicks: DraftPick[];
}

interface TeamWithStats {
    id: number;
    name: string;
    fantasyPoints: number;
    valueOverReplacement: number;
    goals: number;
    assists: number;
    points: number;
    plusMinus: number;
    penaltyMinutes: number;
    powerplayGoals: number;
    powerplayAssists: number;
    powerplayPoints: number;
    gameWinningGoals: number;
    shotsOnGoal: number;
    faceoffsWon: number;
    faceoffsLost: number;
    hits: number;
    blocks: number;
    wins: number;
    losses: number;
    goalsAgainst: number;
    goalsAgainstAverage: number;
    saves: number;
    savePercentage: number;
    shutouts: number;
}

const fixedHeadings: DataTableHeading[] = [
    { title: 'Team' },
    { title: 'FP', align: 'right', defaultSortDirection: 'descending', sortable: true },
    { title: 'VORP', align: 'right', defaultSortDirection: 'descending', sortable: true },
];

const emptyStatTotals: Record<string, number> = {
    fantasyPoints: 0,
    valueOverReplacement: 0,
    goals: 0,
    assists: 0,
    points: 0,
    plusMinus: 0,
    penaltyMinutes: 0,
    powerplayGoals: 0,
    powerplayAssists: 0,
    powerplayPoints: 0,
    gameWinningGoals: 0,
    shotsOnGoal: 0,
    faceoffsWon: 0,
    faceoffsLost: 0,
    hits: 0,
    blocks: 0,
    wins: 0,
    losses: 0,
    goalsAgainst: 0,
    goalsAgainstAverage: 0,
    saves: 0,
    savePercentage: 0,
    shutouts: 0,
};

const formatStat = (value: string | number | null, key: keyof ScoringSettings) => {
    if (value === null) {
        return null;
    }

    if (typeof value === 'string') {
        return value;
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

const Standings = ({ draftPicks }: StandingsProps): JSX.Element => {
    const [sort, setSort] = React.useState({ index: 2, direction: 'descending' });

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

    const teamsWithStats = React.useMemo(() => {
        const teams: TeamWithStats[] = [];

        for (const team of settings.teams) {
            const picks = draftPicks.filter((dp) => dp.team.id === team.id && dp.playerSelected !== null);

            let validGAAs = 0;
            let validSavePercentages = 0;

            const dataTotals = picks.reduce((totals, dp) => {
                totals.fantasyPoints += dp.playerSelected!.fantasyPoints;
                totals.valueOverReplacement += dp.playerSelected!.valueOverReplacement;

                const statEntries = Object.entries(dp.playerSelected!.totals);
                for (const [key, value] of statEntries) {
                    if (value) {
                        if (key === 'goalsAgainstAverage') {
                            validGAAs++;
                        } else if (key === 'savePercentage') {
                            validSavePercentages++;
                        }

                        totals[key as keyof PlayerStats] += value;
                    }
                }

                return totals;
            }, { ...emptyStatTotals });

            if (validGAAs > 0) {
                dataTotals.goalsAgainstAverage = dataTotals.goalsAgainstAverage / validGAAs;
            }

            if (validSavePercentages > 0) {
                dataTotals.savePercentage = dataTotals.savePercentage / validSavePercentages;
            }

            teams.push({
                ...dataTotals,
                id: team.id,
                name: team.name,
            } as TeamWithStats);
        }

        return teams;
    }, [draftPicks, settings]);

    const sortedTeams = React.useMemo(() => {
        let compareFn;

        const columnToSort = tableHeadings[sort.index]?.title;
        switch (columnToSort) {
            case 'FP':
                compareFn = ((a: TeamWithStats, b: TeamWithStats) => sortByStatistic(
                    a.fantasyPoints,
                    b.fantasyPoints,
                    sort.direction === 'ascending',
                ));
                break;
            case 'VORP':
                compareFn = ((a: TeamWithStats, b: TeamWithStats) => sortByStatistic(
                    a.valueOverReplacement,
                    b.valueOverReplacement,
                    sort.direction === 'ascending',
                ));
                break;
            default: {
                const key = acronymToSettingsMap[columnToSort];
                compareFn = ((a: TeamWithStats, b: TeamWithStats) => sortByStatistic(
                    a[key],
                    b[key],
                    sort.direction === 'ascending',
                ));
                break;
            }
        }

        return [...teamsWithStats].sort(compareFn);
    }, [sort, tableHeadings, teamsWithStats]);

    return (
        <>
            <h2 className="sr-only">
                Standings
            </h2>
            <DataTable
                headings={tableHeadings}
                initialSortColumnIndex={2}
                initialSortDirection="descending"
                onSort={(index, direction) => setSort({ index, direction })}
            >
                {sortedTeams.map((tws, index) => (
                    <DataTable.Row key={index}>
                        <DataTable.Cell>
                            <span className={tws.id === myTeamId ? 'font-medium' : ''}>
                                {tws.name}
                            </span>
                        </DataTable.Cell>
                        <DataTable.Cell align="right">
                            {tws.fantasyPoints.toFixed(1)}
                        </DataTable.Cell>
                        <DataTable.Cell align="right">
                            {tws.valueOverReplacement.toFixed(1)}
                        </DataTable.Cell>
                        {scoringSettingEntries.map(([key, value]) => value ? (
                            <DataTable.Cell key={key} align="right">
                                {formatStat(tws[key as keyof TeamWithStats], key as keyof ScoringSettings)}
                            </DataTable.Cell>
                        ) : null)}
                    </DataTable.Row>
                ))}
            </DataTable>
        </>
    );
};

export default Standings;
