import * as React from 'react';
import Listbox from '../../../../components/Listbox/Listbox';
import { RosterSettings, Team, useSettings } from '../../../../contexts/SettingsContext/SettingsContext';
import { PlayerData } from '../../../../hooks/usePlayerData/usePlayerData';
import { DraftPick } from '../../Draft';

interface MyTeamProps {
    draftPicks: DraftPick[];
}

interface PlayerRowProps {
    player: PlayerData;
    position: string;
}

const getPrimaryPosition = (position: string) => {
    if (position === 'g') {
        return 'goalie';
    }

    if (position === 'd') {
        return 'defense';
    }

    if (position.startsWith('rw')) {
        return 'rightWing';
    }

    if (position.startsWith('lw')) {
        return 'leftWing';
    }

    return 'center';
};

const renderEmptySlots = (count: number, position: string) => {
    const slots = [];

    for (let i = 0; i < count; i++) {
        slots.push(
            <div key={i} className="flex gap-4 py-0.5 text-sm">
                <div className="flex-shrink-0 w-5 text-right">
                    {position}
                </div>
                <div className="flex-1">
                    -
                </div>
            </div>
        );
    }

    return slots;
};

const PlayerRow = ({ player, position }: PlayerRowProps): JSX.Element => (
    <div className="flex gap-4 py-0.5 text-sm">
        <div className="flex-shrink-0 w-5 text-right">
            {position}
        </div>
        <div className="flex items-center justify-between flex-1">
            <div className="truncate">
                {player.name}
            </div>
            <div className="flex-shrink-0 text-xs text-gray-500">
                {player.team} {player.position}
            </div>
        </div>
    </div>
);

const TeamSummary = ({ draftPicks }: MyTeamProps): JSX.Element | null => {
    const [settings] = useSettings();

    const [team, setTeam] = React.useState<Team>(settings.teams[0]);

    const teamRoster = React.useMemo(() => {
        const roster: Record<keyof RosterSettings, PlayerData[]> = {
            center: [],
            leftWing: [],
            rightWing: [],
            defense: [],
            goalie: [],
            bench: [],
        };

        const teamPicks = draftPicks
            .filter((dp) => dp.playerSelected !== null && dp.team.id === team.id)
            .map((dp) => dp.playerSelected) as PlayerData[];

        for (const player of teamPicks) {
            const position = player.position?.toLowerCase();

            if (!position) {
                roster.bench.push(player);
            } else {
                const primaryPosition = getPrimaryPosition(position);

                if (roster[primaryPosition].length < settings.roster[primaryPosition]) {
                    roster[primaryPosition].push(player);
                } else if (position.includes('rw') && roster.rightWing.length < settings.roster.rightWing) {
                    roster.rightWing.push(player);
                } else if (position.includes('lw') && roster.leftWing.length < settings.roster.leftWing) {
                    roster.leftWing.push(player);
                } else if (position.includes('c') && roster.center.length < settings.roster.center) {
                    roster.center.push(player);
                } else {
                    roster.bench.push(player);
                }
            }
        }

        return roster;
    }, [draftPicks, settings, team]);

    return (
        <section className="h-3/5 overflow-y-auto px-4 md:px-6 py-6 border-b">
            <h2 className="mb-4 text-lg font-medium text-gray-800">
                Team summary
            </h2>
            <div className="mb-2">
                <Listbox
                    label="Team"
                    onChange={setTeam}
                    optionTransform={(team) => team.name}
                    options={settings.teams}
                    value={team}
                />
            </div>
            <div>
                <div className="relative flex items-center justify-center py-1">
                    <div className="absolute inset-x-0 inset-y-1/2 border-t" />
                    <h3 className="relative z-10 px-2 bg-white text-gray-500 text-sm font-medium">
                        Center
                    </h3>
                </div>
                {teamRoster.center.map((pd, index) =>
                    <PlayerRow
                        key={`${pd.name}-${index}`}
                        player={pd}
                        position="C"
                    />
                )}
                {renderEmptySlots(settings.roster.center - teamRoster.center.length, 'C')}
            </div>
            <div>
                <div className="relative flex items-center justify-center py-1">
                    <div className="absolute inset-x-0 inset-y-1/2 border-t" />
                    <h3 className="relative z-10 px-2 bg-white text-gray-500 text-sm font-medium">
                        Left wing
                    </h3>
                </div>
                {teamRoster.leftWing.map((pd, index) =>
                    <PlayerRow
                        key={`${pd.name}-${index}`}
                        player={pd}
                        position="LW"
                    />
                )}
                {renderEmptySlots(settings.roster.leftWing - teamRoster.leftWing.length, 'LW')}
            </div>
            <div>
                <div className="relative flex items-center justify-center py-1">
                    <div className="absolute inset-x-0 inset-y-1/2 border-t" />
                    <h3 className="relative z-10 px-2 bg-white text-gray-500 text-sm font-medium">
                        Right wing
                    </h3>
                </div>
                {teamRoster.rightWing.map((pd, index) =>
                    <PlayerRow
                        key={`${pd.name}-${index}`}
                        player={pd}
                        position="RW"
                    />
                )}
                {renderEmptySlots(settings.roster.rightWing - teamRoster.rightWing.length, 'RW')}
            </div>
            <div>
                <div className="relative flex items-center justify-center py-1">
                    <div className="absolute inset-x-0 inset-y-1/2 border-t" />
                    <h3 className="relative z-10 px-2 bg-white text-gray-500 text-sm font-medium">
                        Defense
                    </h3>
                </div>
                {teamRoster.defense.map((pd, index) =>
                    <PlayerRow
                        key={`${pd.name}-${index}`}
                        player={pd}
                        position="D"
                    />
                )}
                {renderEmptySlots(settings.roster.defense - teamRoster.defense.length, 'D')}
            </div>
            <div>
                <div className="relative flex items-center justify-center py-1">
                    <div className="absolute inset-x-0 inset-y-1/2 border-t" />
                    <h3 className="relative z-10 px-2 bg-white text-gray-500 text-sm font-medium">
                        Goalie
                    </h3>
                </div>
                {teamRoster.goalie.map((pd, index) =>
                    <PlayerRow
                        key={`${pd.name}-${index}`}
                        player={pd}
                        position="G"
                    />
                )}
                {renderEmptySlots(settings.roster.goalie - teamRoster.goalie.length, 'G')}
            </div>
            {settings.roster.bench > 0 || teamRoster.bench.length > 0 ? (
                <div>
                    <div className="relative flex items-center justify-center py-1">
                        <div className="absolute inset-x-0 inset-y-1/2 border-t" />
                        <h3 className="relative z-10 px-2 bg-white text-gray-500 text-sm font-medium">
                            Bench
                        </h3>
                    </div>
                    {teamRoster.bench.map((pd, index) =>
                        <PlayerRow
                            key={`${pd.name}-${index}`}
                            player={pd}
                            position="BN"
                        />
                    )}
                    {renderEmptySlots(settings.roster.bench - teamRoster.bench.length, 'BN')}
                </div>
            ) : null}
        </section>
    );
};

export default TeamSummary;
