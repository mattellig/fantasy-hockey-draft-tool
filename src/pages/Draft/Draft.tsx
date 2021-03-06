import { AdjustmentsIcon, ClockIcon, RefreshIcon, XIcon } from '@heroicons/react/outline';
import * as React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button/Button';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import { getLinkStyles } from '../../components/Link/Link';
import Tabs from '../../components/Tabs/Tabs';
import { toast } from '../../components/Toast/Toast';
import { myTeamId, SettingsState, Team, useSettings } from '../../contexts/SettingsContext/SettingsContext';
import usePlayerData, { PlayerData } from '../../hooks/usePlayerData/usePlayerData';
import DraftList from './components/DraftList/DraftList';
import PickPredictor from './components/PickPredictor/PickPredictor';
import PlayersTable from './components/PlayersTable/PlayersTable';
import Standings from './components/Standings/Standings';
import TeamSummary from './components/TeamSummary/TeamSummary';

export interface DraftPick {
    pickNumber: number;
    playerSelected: PlayerData | null;
    team: Team;
}

const createDraftOrder = (settings: SettingsState) => {
    const rounds = settings.roster.bench
        + settings.roster.center
        + settings.roster.defense
        + settings.roster.goalie
        + settings.roster.leftWing
        + settings.roster.rightWing;

    const teamsByDraftPosition = [...settings.teams].sort((a, b) => a.draftPosition - b.draftPosition);
    const picks: DraftPick[] = [];

    let pickNumber = 1;

    for (let i = 0; i < rounds; i++) {
        for (const team of teamsByDraftPosition) {
            picks.push({
                pickNumber: pickNumber++,
                playerSelected: null,
                team,
            });
        }

        teamsByDraftPosition.reverse();
    }

    return picks;
};

const Draft = (): JSX.Element => {
    const [settings] = useSettings();

    const [currentPickNumber, setCurrentPickNumber] = React.useState(1);
    const [draftPicks, setDraftPicks] = React.useState(createDraftOrder(settings));
    const [draftStarted, setDraftStarted] = React.useState(false);
    const [flaggedPlayers, setFlaggedPlayers] = React.useState<PlayerData[]>([]);
    const [showResetModal, setShowResetModal] = React.useState(false);
    const [showStopModal, setShowStopModal] = React.useState(false);

    const { data, loading } = usePlayerData();

    const draftedPlayers = React.useMemo(() => {
        return draftPicks
            .filter((dp) => dp.playerSelected !== null)
            .map((dp) => dp.playerSelected) as PlayerData[];
    }, [draftPicks]);

    const handleCloseConfirmationModal = (confirmed: boolean, restart: boolean) => {
        if (confirmed) {
            if (!restart) {
                setDraftStarted(false);
            }

            setCurrentPickNumber(1);
            setDraftPicks(createDraftOrder(settings));

            toast.success('Draft reset');
        }

        setShowResetModal(false);
        setShowStopModal(false);
    };

    const handleDraftPlayer = (player: PlayerData) => {
        const draftPicksCopy = [...draftPicks];

        draftPicksCopy[currentPickNumber - 1].playerSelected = player;

        setDraftPicks(draftPicksCopy);
        setCurrentPickNumber(currentPickNumber + 1);
    };

    const handleFlagPlayer = (player: PlayerData) => {
        const flaggedPlayersCopy = [...flaggedPlayers];

        const index = flaggedPlayersCopy.indexOf(player);
        if (index >= 0) {
            flaggedPlayersCopy.splice(index, 1);
        } else {
            flaggedPlayersCopy.push(player);
        }

        setFlaggedPlayers(flaggedPlayersCopy);
    };

    return (
        <>
            <div className="h-screen -mt-12 pt-12">
                <div className="grid grid-cols-12 h-full overflow-hidden">
                    <div className="col-span-8 order-2 h-full py-5 overflow-y-auto">
                        <div className="px-4 md:px-6 mb-5">
                            <h1 className="mb-2 text-2xl font-medium text-gray-800">
                                Draft
                            </h1>
                            <div className="flex items-center space-x-6">
                                {!draftStarted ? (
                                    <>
                                        <Button
                                            disabled={loading}
                                            icon={<ClockIcon />}
                                            link
                                            onClick={() => setDraftStarted(true)}
                                        >
                                            Start the draft
                                        </Button>
                                        <Link
                                            to="/customize"
                                            className={`flex items-center ${getLinkStyles(true)} text-sm font-medium`}
                                        >
                                            <AdjustmentsIcon className="h-4 w-4 -ml-px mr-1.5" />
                                            Customize
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            icon={<RefreshIcon />}
                                            link
                                            onClick={() => setShowResetModal(true)}
                                        >
                                            Restart
                                        </Button>
                                        <Button
                                            icon={<XIcon />}
                                            link
                                            onClick={() => setShowStopModal(true)}
                                        >
                                            Stop draft
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                        <section>
                            <Tabs
                                tabs={[
                                    {
                                        content: (
                                            <PlayersTable
                                                allPlayers={data}
                                                canDraftPlayers={draftStarted && currentPickNumber <= draftPicks.length}
                                                draftedPlayers={draftedPlayers}
                                                flaggedPlayers={flaggedPlayers}
                                                loading={loading}
                                                onDraftPlayer={handleDraftPlayer}
                                                onFlagPlayer={handleFlagPlayer}
                                            />
                                        ),
                                        title: 'Players',
                                    },
                                    {
                                        content: <Standings draftPicks={draftPicks} />,
                                        title: 'Standings',
                                    },
                                ]}
                            />
                        </section>
                    </div>
                    <section className="col-span-2 order-1 h-full overflow-y-auto">
                        {draftStarted ? (
                            <DraftList
                                currentPickNumber={currentPickNumber}
                                draftPicks={draftPicks}
                            />
                        ) : null}
                    </section>
                    <div className="col-span-2 order-3 h-full overflow-hidden">
                        {draftStarted ? (
                            <>
                                <TeamSummary draftPicks={draftPicks} />
                                <PickPredictor
                                    allPlayers={data!}
                                    draftedPlayers={draftedPlayers}
                                />
                            </>
                        ) : null}
                    </div>
                </div>
            </div>
            <ConfirmationModal
                confirmButtonText="Restart"
                destructive
                message="Are you sure you want to start over? The draft order and all current picks will be reset."
                onClose={(confirmed) => handleCloseConfirmationModal(confirmed, true)}
                open={showResetModal}
                title="Restart draft?"
            />
            <ConfirmationModal
                confirmButtonText="Stop"
                destructive
                message="Are you sure you want to stop? The draft order and all current picks will be reset."
                onClose={(confirmed) => handleCloseConfirmationModal(confirmed, false)}
                open={showStopModal}
                title="Stop draft?"
            />
        </>
    );
};

export default Draft;
