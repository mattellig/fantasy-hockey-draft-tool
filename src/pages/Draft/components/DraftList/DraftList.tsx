import clsx from 'clsx';
import * as React from 'react';
import { myTeamId } from '../../../../contexts/SettingsContext/SettingsContext';
import getNumberWithOrdinal from '../../../../utils/getNumberWithOrdinal/getNumberWithOrdinal';
import { DraftPick } from '../../Draft';

interface DraftListProps {
    currentPickNumber: number;
    draftStarted: boolean;
    numberOfTeams: number;
    picks: DraftPick[];
}

const DraftList = (props: DraftListProps): JSX.Element | null => {
    const {
        currentPickNumber,
        draftStarted,
        numberOfTeams,
        picks,
    } = props;

    const currentRound = Math.floor((currentPickNumber - 1) / numberOfTeams) + 1;
    const nextPickIn = picks.slice(currentPickNumber - 1).findIndex((dp) => dp.team.id === myTeamId);

    if (!draftStarted) {
        return null;
    }

    if (currentPickNumber === picks.length) {
        return (
            <div className="px-4 py-2 rounded-md bg-green-100 text-base text-green-900 font-medium transition-colors">
                Draft complete!
            </div>
        );
    }

    return (
        <>
            <h2 className="sr-only">
                Draft list
            </h2>
            <div className="p-4 rounded-t-md border">
                <h3 className="block mb-0.5 text-sm font-medium text-gray-500">
                    On the clock
                </h3>
                <div className="mb-1 text-xl font-medium">
                    {picks[currentPickNumber - 1].team.name}
                </div>
                <div className="flex space-x-1 text-xs text-gray-500">
                    <div>
                        Round {currentRound}, pick {currentPickNumber - ((currentRound - 1) * numberOfTeams)}
                    </div>
                    <div>&mdash;</div>
                    <div>
                        {getNumberWithOrdinal(currentPickNumber)} overall
                    </div>
                </div>
            </div>
            <div className="-mt-px mb-6">
                {nextPickIn === 0 ? (
                    <div className="px-4 py-2 rounded-b-md bg-yellow-300 text-base text-gray-800 font-medium transition-colors">
                        It's your turn!
                    </div>
                ) : (
                    <div className="px-4 py-2 rounded-b-md bg-gray-200 text-base text-gray-800 font-medium transition-colors">
                        {nextPickIn} picks until your turn
                    </div>
                )}
            </div>
            <h3 className="block mb-0.5 text-sm font-medium text-gray-500">
                Coming up
            </h3>
            <ol>
                {picks.slice(currentPickNumber).map((dp) => (
                    <>
                        {(dp.pickNumber - 1) % numberOfTeams === 0 ? (
                            <li className="relative flex items-center justify-center py-1">
                                <div className="absolute inset-x-0 inset-y-1/2 border-t" />
                                <div className="relative z-10 px-2 bg-white text-gray-500">
                                    Round {((dp.pickNumber - 1) / numberOfTeams) + 1}
                                </div>
                            </li>
                        ) : null}
                        <li
                            className={clsx(
                                'grid grid-cols-12 gap-4 px-2 py-0.5 text-sm',
                                dp.team.id === myTeamId && 'font-medium',
                            )}
                        >
                            <div className="col-span-1 text-right">
                                {dp.pickNumber}
                            </div>
                            <div className="col-span-11">
                                {dp.team.name}
                            </div>
                        </li>
                    </>
                ))}
            </ol>
        </>
    );
};

export default DraftList;
