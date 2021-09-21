import * as React from 'react';
import { RosterSettings, ScoringSettings, useSettings } from '../../contexts/SettingsContext/SettingsContext';
import useControlledState from '../../hooks/useControlledState/useControlledState';
import Button from '../Button/Button';
import Checkbox from '../Checkbox/Checkbox';
import Modal from '../Modal/Modal';
import Select from '../Select/Select';

interface SettingsModalProps {
    onClose: (value: boolean) => void;
    open: boolean;
}

const rosterSizeOptions = ['0', '1', '2', '3', '4', '5'];
const teamCountOptions = [
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
];

const SettingsModal = ({ onClose, open }: SettingsModalProps): JSX.Element => {
    const [settings, setSettings] = useSettings();

    const [localSettings, setLocalSettings] = useControlledState(settings);

    React.useEffect(() => {
        if (open) {
            setLocalSettings(settings);
        }
    }, [open]);

    const handleChangeScoringSetting = (event: React.ChangeEvent<HTMLInputElement>, key: keyof ScoringSettings) => {
        setLocalSettings({
            ...localSettings,
            scoring: {
                ...localSettings.scoring,
                [key]: event.target.checked,
            },
        });
    };

    const handleChangeRosterSetting = (event: React.ChangeEvent<HTMLSelectElement>, key: keyof RosterSettings) => {
        setLocalSettings({
            ...localSettings,
            roster: {
                ...localSettings.roster,
                [key]: Number(event.target.value),
            },
        });
    };

    const handleChangeTeams = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setLocalSettings({ ...localSettings, teams: Number(event.target.value) });
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        setSettings(localSettings);
        onClose(false);
    };

    return (
        <Modal
            onClose={onClose}
            open={open}
            title="Settings"
        >
            <form onSubmit={handleSubmit}>
                <Modal.Section>
                    <div className="grid grid-cols-3 gap-4">
                        <Select
                            id="team-count-select"
                            label="Teams"
                            onChange={handleChangeTeams}
                            options={teamCountOptions}
                            value={String(localSettings.teams)}
                        />
                    </div>
                </Modal.Section>
                <Modal.Section>
                    <fieldset>
                        <legend className="mb-2 text-base font-medium text-gray-800">
                            Roster
                        </legend>
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-4">
                                <Select
                                    id="center-select"
                                    label="Center (C)"
                                    onChange={(e) => handleChangeRosterSetting(e, 'center')}
                                    options={rosterSizeOptions}
                                    value={String(localSettings.roster.center)}
                                />
                            </div>
                            <div className="col-span-4">
                                <Select
                                    id="left-wing-select"
                                    label="Left wing (LW)"
                                    onChange={(e) => handleChangeRosterSetting(e, 'leftWing')}
                                    options={rosterSizeOptions}
                                    value={String(localSettings.roster.leftWing)}
                                />
                            </div>
                            <div className="col-span-4">
                                <Select
                                    id="right-wing-select"
                                    label="Right wing (RW)"
                                    onChange={(e) => handleChangeRosterSetting(e, 'rightWing')}
                                    options={rosterSizeOptions}
                                    value={String(localSettings.roster.rightWing)}
                                />
                            </div>
                            <div className="col-span-4">
                                <Select
                                    id="defense-select"
                                    label="Defense (D)"
                                    onChange={(e) => handleChangeRosterSetting(e, 'defense')}
                                    options={rosterSizeOptions}
                                    value={String(localSettings.roster.defense)}
                                />
                            </div>
                            <div className="col-span-4">
                                <Select
                                    id="goalie-select"
                                    label="Goalie (G)"
                                    onChange={(e) => handleChangeRosterSetting(e, 'goalie')}
                                    options={rosterSizeOptions}
                                    value={String(localSettings.roster.goalie)}
                                />
                            </div>
                        </div>
                    </fieldset>
                </Modal.Section>
                <Modal.Section>
                    <fieldset className="grid grid-cols-2 gap-4">
                        <legend className="mb-2 text-base font-medium text-gray-800">
                            Scoring
                        </legend>
                        <fieldset>
                            <legend className="mb-2 text-xs tracking-wider text-gray-500">
                                Skaters
                            </legend>
                            <ul>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.goals}
                                        id="goals-checkbox"
                                        label="Goals"
                                        onChange={(e) => handleChangeScoringSetting(e, 'goals')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.assists}
                                        id="assists-checkbox"
                                        label="Assists"
                                        onChange={(e) => handleChangeScoringSetting(e, 'assists')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.points}
                                        id="points-checkbox"
                                        label="Points"
                                        onChange={(e) => handleChangeScoringSetting(e, 'points')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.plusMinus}
                                        id="plus-minus-checkbox"
                                        label="+/-"
                                        onChange={(e) => handleChangeScoringSetting(e, 'plusMinus')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.penaltyMinutes}
                                        id="penalty-mins-checkbox"
                                        label="Penalty minutes"
                                        onChange={(e) => handleChangeScoringSetting(e, 'penaltyMinutes')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.powerplayGoals}
                                        id="pp-goals-checkbox"
                                        label="Powerplay goals"
                                        onChange={(e) => handleChangeScoringSetting(e, 'powerplayGoals')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.powerplayAssists}
                                        id="pp-assists-checkbox"
                                        label="Powerplay assists"
                                        onChange={(e) => handleChangeScoringSetting(e, 'powerplayAssists')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.powerplayPoints}
                                        id="pp-points-checkbox"
                                        label="Powerplay points"
                                        onChange={(e) => handleChangeScoringSetting(e, 'powerplayPoints')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.gameWinningGoals}
                                        id="game-winning-goals-checkbox"
                                        label="Game-winning goals"
                                        onChange={(e) => handleChangeScoringSetting(e, 'gameWinningGoals')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.shotsOnGoal}
                                        id="shots-checkbox"
                                        label="Shots on goal"
                                        onChange={(e) => handleChangeScoringSetting(e, 'shotsOnGoal')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.faceoffsWon}
                                        id="faceoff-wins-checkbox"
                                        label="Faceoffs won"
                                        onChange={(e) => handleChangeScoringSetting(e, 'faceoffsWon')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.faceoffsLost}
                                        id="faceoff-losses-checkbox"
                                        label="Faceoffs lost"
                                        onChange={(e) => handleChangeScoringSetting(e, 'faceoffsLost')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.hits}
                                        id="hits-checkbox"
                                        label="Hits"
                                        onChange={(e) => handleChangeScoringSetting(e, 'hits')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.blocks}
                                        id="blocks-checkbox"
                                        label="Blocks"
                                        onChange={(e) => handleChangeScoringSetting(e, 'blocks')}
                                    />
                                </li>
                            </ul>
                        </fieldset>
                        <fieldset>
                            <legend className="mb-2 text-xs tracking-wider text-gray-500">
                                Goalies
                            </legend>
                            <ul>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.wins}
                                        id="wins-checkbox"
                                        label="Wins"
                                        onChange={(e) => handleChangeScoringSetting(e, 'wins')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.losses}
                                        id="losses-checkbox"
                                        label="Losses"
                                        onChange={(e) => handleChangeScoringSetting(e, 'losses')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.goalsAgainst}
                                        id="goals-against-checkbox"
                                        label="Goals against"
                                        onChange={(e) => handleChangeScoringSetting(e, 'goalsAgainst')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.goalsAgainstAverage}
                                        id="goals-against-avg-checkbox"
                                        label="Goals against average"
                                        onChange={(e) => handleChangeScoringSetting(e, 'goalsAgainstAverage')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.saves}
                                        id="saves-checkbox"
                                        label="Saves"
                                        onChange={(e) => handleChangeScoringSetting(e, 'saves')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.savePercentage}
                                        id="save-pct-checkbox"
                                        label="Save percentage"
                                        onChange={(e) => handleChangeScoringSetting(e, 'savePercentage')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.shutouts}
                                        id="shutouts-checkbox"
                                        label="Shutouts"
                                        onChange={(e) => handleChangeScoringSetting(e, 'shutouts')}
                                    />
                                </li>
                            </ul>
                        </fieldset>
                    </fieldset>
                </Modal.Section>
                <Modal.Footer>
                    <Button primary submit>
                        Save changes
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
};

export default SettingsModal;
