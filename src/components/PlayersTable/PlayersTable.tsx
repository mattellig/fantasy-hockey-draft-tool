import * as React from 'react';
import { PlayerData } from '../../hooks/usePlayerData/usePlayerData';
import DataTable from '../DataTable/DataTable';
import Spinner from '../Spinner/Spinner';

interface PlayersTableProps {
    data: PlayerData[] | undefined;
    loadingMessage: string | undefined;
}

const headings = [
    { title: 'Name' },
    { title: 'Team', align: 'center' },
    { title: 'Pos', align: 'center' },
    { title: 'FP', align: 'right' },
    { title: 'ADP', align: 'right' },
    { title: 'GP', align: 'right' },
    { title: 'G', align: 'right' },
    { title: 'A', align: 'right' },
    { title: 'PTS', align: 'right' },
    { title: '+/-', align: 'right' },
    { title: 'PIM', align: 'right' },
    { title: 'PPG', align: 'right' },
    { title: 'PPA', align: 'right' },
    { title: 'PPP', align: 'right' },
    { title: 'GWG', align: 'right' },
    { title: 'SOG', align: 'right' },
    { title: 'FOW', align: 'right' },
    { title: 'FOL', align: 'right' },
    { title: 'HIT', align: 'right' },
    { title: 'BLK', align: 'right' },
    { title: 'W', align: 'right' },
    { title: 'L', align: 'right' },
    { title: 'GA', align: 'right' },
    { title: 'GAA', align: 'right' },
    { title: 'SV', align: 'right' },
    { title: 'SV%', align: 'right' },
    { title: 'SO', align: 'right' },
];

const PlayersTable = ({ data, loadingMessage }: PlayersTableProps): JSX.Element => {
    return (
        <DataTable headings={headings}>
            {loadingMessage ? (
                <DataTable.Row>
                    <DataTable.Cell align="center" colSpan={headings.length}>
                        <div className="flex items-center justify-center gap-2">
                            <div className="text-blue-500">
                                <Spinner />
                            </div>
                            <div className="text-sm text-gray-500 animate-pulse">
                                {loadingMessage}...
                            </div>
                        </div>
                    </DataTable.Cell>
                </DataTable.Row>
            ) : data?.length ? data.map((row) => (
                <DataTable.Row key={`${row.name}-${row.position}`}>
                    <DataTable.Cell>
                        {row.name}
                    </DataTable.Cell>
                    <DataTable.Cell align="center">
                        {row.team}
                    </DataTable.Cell>
                    <DataTable.Cell align="center">
                        {row.position}
                    </DataTable.Cell>
                    <DataTable.Cell align="right">
                        {row.fantasyPoints.toFixed(1)}
                    </DataTable.Cell>
                    <DataTable.Cell align="right">
                        {row.averageDraftPosition}
                    </DataTable.Cell>
                    <DataTable.Cell align="right">
                        {row.gamesPlayed}
                    </DataTable.Cell>
                    <DataTable.Cell align="right">
                        {row.totals.goals}
                    </DataTable.Cell>
                    <DataTable.Cell align="right">
                        {row.totals.assists}
                    </DataTable.Cell>
                    <DataTable.Cell align="right">
                        {row.totals.points}
                    </DataTable.Cell>
                    <DataTable.Cell align="right">
                        {row.totals.plusMinus}
                    </DataTable.Cell>
                    <DataTable.Cell align="right">
                        {row.totals.penaltyMinutes}
                    </DataTable.Cell>
                    <DataTable.Cell align="right">
                        {row.totals.powerplayGoals}
                    </DataTable.Cell>
                    <DataTable.Cell align="right">
                        {row.totals.powerplayAssists}
                    </DataTable.Cell>
                    <DataTable.Cell align="right">
                        {row.totals.powerplayPoints}
                    </DataTable.Cell>
                    <DataTable.Cell align="right">
                        {row.totals.gameWinningGoals}
                    </DataTable.Cell>
                    <DataTable.Cell align="right">
                        {row.totals.shotsOnGoal}
                    </DataTable.Cell>
                    <DataTable.Cell align="right">
                        {row.totals.faceoffsWon}
                    </DataTable.Cell>
                    <DataTable.Cell align="right">
                        {row.totals.faceoffsLost}
                    </DataTable.Cell>
                    <DataTable.Cell align="right">
                        {row.totals.hits}
                    </DataTable.Cell>
                    <DataTable.Cell align="right">
                        {row.totals.blocks}
                    </DataTable.Cell>
                    <DataTable.Cell align="right">
                        {row.totals.wins}
                    </DataTable.Cell>
                    <DataTable.Cell align="right">
                        {row.totals.losses}
                    </DataTable.Cell>
                    <DataTable.Cell align="right">
                        {row.totals.goalsAgainst}
                    </DataTable.Cell>
                    <DataTable.Cell align="right">
                        {row.totals.goalsAgainstAverage}
                    </DataTable.Cell>
                    <DataTable.Cell align="right">
                        {row.totals.saves}
                    </DataTable.Cell>
                    <DataTable.Cell align="right">
                        {row.totals.savePercentage}
                    </DataTable.Cell>
                    <DataTable.Cell align="right">
                        {row.totals.shutouts}
                    </DataTable.Cell>
                </DataTable.Row>
            )) : (
                <DataTable.Row>
                    <DataTable.Cell align="center" colSpan={headings.length}>
                        <p className="text-sm text-gray-500">
                            No results found.
                        </p>
                    </DataTable.Cell>
                </DataTable.Row>
            )}
        </DataTable>
    );
};

export default PlayersTable;
