import * as React from 'react';
import { DataTableHeading } from '../../../../components/DataTable/DataTable';
import { ScoringSettings } from '../../../../contexts/SettingsContext/SettingsContext';

const fixedHeadings: DataTableHeading[] = [
    { title: 'Rank', align: 'right', sortable: true },
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

const settingsToAcronymMap: Record<keyof ScoringSettings, string> = {
    goals: 'G',
    assists: 'A',
    points: 'PTS',
    plusMinus: '+/-',
    penaltyMinutes: 'PIM',
    powerplayGoals: 'PPG',
    powerplayAssists: 'PPA',
    powerplayPoints: 'PPP',
    gameWinningGoals: 'GWG',
    shotsOnGoal: 'SOG',
    faceoffsWon: 'FOW',
    faceoffsLost: 'FOL',
    hits: 'HIT',
    blocks: 'BLK',
    wins: 'W',
    losses: 'L',
    goalsAgainst: 'GA',
    goalsAgainstAverage: 'GAA',
    saves: 'SV',
    savePercentage: 'SV%',
    shutouts: 'SO',
};

const useTableHeadings = (scoringSettingEntries: [string, boolean][]): DataTableHeading[] => React.useMemo(() => {
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

export default useTableHeadings;
