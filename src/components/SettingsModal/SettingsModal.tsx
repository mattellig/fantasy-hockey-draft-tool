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

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>, key: keyof ScoringSettings) => {
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
                                        onChange={(e) => handleChange(e, 'goals')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.assists}
                                        label="Assists"
                                        onChange={(e) => handleChange(e, 'assists')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.points}
                                        label="Points"
                                        onChange={(e) => handleChange(e, 'points')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.plusMinus}
                                        label="+/-"
                                        onChange={(e) => handleChange(e, 'plusMinus')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.penaltyMinutes}
                                        label="Penalty minutes"
                                        onChange={(e) => handleChange(e, 'penaltyMinutes')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.powerplayGoals}
                                        label="Powerplay goals"
                                        onChange={(e) => handleChange(e, 'powerplayGoals')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.powerplayAssists}
                                        label="Powerplay assists"
                                        onChange={(e) => handleChange(e, 'powerplayAssists')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.powerplayPoints}
                                        label="Powerplay points"
                                        onChange={(e) => handleChange(e, 'powerplayPoints')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.gameWinningGoals}
                                        label="Game-winning goals"
                                        onChange={(e) => handleChange(e, 'gameWinningGoals')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.shotsOnGoal}
                                        label="Shots on goal"
                                        onChange={(e) => handleChange(e, 'shotsOnGoal')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.faceoffsWon}
                                        label="Faceoffs won"
                                        onChange={(e) => handleChange(e, 'faceoffsWon')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.faceoffsLost}
                                        label="Faceoffs lost"
                                        onChange={(e) => handleChange(e, 'faceoffsLost')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.hits}
                                        label="Hits"
                                        onChange={(e) => handleChange(e, 'hits')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.blocks}
                                        label="Blocks"
                                        onChange={(e) => handleChange(e, 'blocks')}
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
                                        onChange={(e) => handleChange(e, 'wins')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.losses}
                                        label="Losses"
                                        onChange={(e) => handleChange(e, 'losses')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.goalsAgainst}
                                        label="Goals against"
                                        onChange={(e) => handleChange(e, 'goalsAgainst')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.goalsAgainstAverage}
                                        label="Goals against average"
                                        onChange={(e) => handleChange(e, 'goalsAgainstAverage')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.saves}
                                        label="Saves"
                                        onChange={(e) => handleChange(e, 'saves')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.savePercentage}
                                        label="Save percentage"
                                        onChange={(e) => handleChange(e, 'savePercentage')}
                                    />
                                </li>
                                <li>
                                    <Checkbox
                                        checked={localSettings.scoring.shutouts}
                                        label="Shutouts"
                                        onChange={(e) => handleChange(e, 'shutouts')}
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
