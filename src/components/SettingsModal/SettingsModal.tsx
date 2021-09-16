import * as React from 'react';
import { ScoringSettings, useSettings } from '../../contexts/SettingsContext/SettingsContext';
import useControlledState from '../../hooks/useControlledState/useControlledState';
import Button from '../Button/Button';
import Checkbox from '../Checkbox/Checkbox';
import Modal from '../Modal/Modal';

interface SettingsModalProps {
    onClose: (value: boolean) => void;
    open: boolean;
}

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

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        setSettings(localSettings);
        onClose(false);
    };

    return (
        <Modal
            onClose={onClose}
            open={open}
            title="Scoring settings"
        >
            <form onSubmit={handleSubmit}>
                <Modal.Section>
                    <div className="grid grid-cols-2 gap-4">
                        <fieldset>
                            <legend className="mb-2 text-base font-medium text-gray-800">
                                Skaters
                            </legend>
                            <ul>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.goals}
                                        label="Goals"
                                        onChange={(e) => handleChangeScoringSetting(e, 'goals')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.assists}
                                        label="Assists"
                                        onChange={(e) => handleChangeScoringSetting(e, 'assists')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.points}
                                        label="Points"
                                        onChange={(e) => handleChangeScoringSetting(e, 'points')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.plusMinus}
                                        label="+/-"
                                        onChange={(e) => handleChangeScoringSetting(e, 'plusMinus')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.penaltyMinutes}
                                        label="Penalty minutes"
                                        onChange={(e) => handleChangeScoringSetting(e, 'penaltyMinutes')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.powerplayGoals}
                                        label="Powerplay goals"
                                        onChange={(e) => handleChangeScoringSetting(e, 'powerplayGoals')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.powerplayAssists}
                                        label="Powerplay assists"
                                        onChange={(e) => handleChangeScoringSetting(e, 'powerplayAssists')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.powerplayPoints}
                                        label="Powerplay points"
                                        onChange={(e) => handleChangeScoringSetting(e, 'powerplayPoints')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.gameWinningGoals}
                                        label="Game-winning goals"
                                        onChange={(e) => handleChangeScoringSetting(e, 'gameWinningGoals')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.shotsOnGoal}
                                        label="Shots on goal"
                                        onChange={(e) => handleChangeScoringSetting(e, 'shotsOnGoal')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.faceoffsWon}
                                        label="Faceoffs won"
                                        onChange={(e) => handleChangeScoringSetting(e, 'faceoffsWon')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.faceoffsLost}
                                        label="Faceoffs lost"
                                        onChange={(e) => handleChangeScoringSetting(e, 'faceoffsLost')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.hits}
                                        label="Hits"
                                        onChange={(e) => handleChangeScoringSetting(e, 'hits')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.blocks}
                                        label="Blocks"
                                        onChange={(e) => handleChangeScoringSetting(e, 'blocks')}
                                    />
                                </li>
                            </ul>
                        </fieldset>
                        <fieldset>
                            <legend className="mb-2 text-base font-medium text-gray-800">
                                Goalies
                            </legend>
                            <ul>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.wins}
                                        label="Wins"
                                        onChange={(e) => handleChangeScoringSetting(e, 'wins')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.losses}
                                        label="Losses"
                                        onChange={(e) => handleChangeScoringSetting(e, 'losses')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.goalsAgainst}
                                        label="Goals against"
                                        onChange={(e) => handleChangeScoringSetting(e, 'goalsAgainst')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.goalsAgainstAverage}
                                        label="Goals against average"
                                        onChange={(e) => handleChangeScoringSetting(e, 'goalsAgainstAverage')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.saves}
                                        label="Saves"
                                        onChange={(e) => handleChangeScoringSetting(e, 'saves')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.savePercentage}
                                        label="Save percentage"
                                        onChange={(e) => handleChangeScoringSetting(e, 'savePercentage')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.shutouts}
                                        label="Shutouts"
                                        onChange={(e) => handleChangeScoringSetting(e, 'shutouts')}
                                    />
                                </li>
                            </ul>
                        </fieldset>
                    </div>
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
