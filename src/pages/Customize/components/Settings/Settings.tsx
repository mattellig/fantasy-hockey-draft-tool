import * as React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../../components/Button/Button';
import Checkbox from '../../../../components/Checkbox/Checkbox';
import { getLinkStyles } from '../../../../components/Link/Link';
import RadioButton from '../../../../components/RadioButton/RadioButton';
import Select from '../../../../components/Select/Select';
import { toast } from '../../../../components/Toast/Toast';
import { ReplacementLevelMethod, RosterSettings, ScoringSettings, useSettings } from '../../../../contexts/SettingsContext/SettingsContext';

const rosterSizeOptions = ['1', '2', '3', '4', '5'];

const defenseRosterSizeOptions = [
    ...rosterSizeOptions,
    '6',
    '7',
    '8',
    '9',
    '10',
];

const benchRosterSizeOptions = [
    ...defenseRosterSizeOptions,
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

const Settings = (): JSX.Element => {
    const [settings, setSettings] = useSettings();

    const [localSettings, setLocalSettings] = React.useState(settings);

    const handleChangeReplacementLevelMethod = (newMethod: ReplacementLevelMethod) => {
        setLocalSettings({ ...localSettings, replacementLevel: newMethod });
    };

    const handleChangeRosterSetting = (value: string, setting: keyof RosterSettings) => {
        setLocalSettings({
            ...localSettings,
            roster: {
                ...localSettings.roster,
                [setting]: Number(value),
            },
        });
    };

    const handleChangeScoringSetting = (checked: boolean, setting: keyof ScoringSettings) => {
        setLocalSettings({
            ...localSettings,
            scoring: {
                ...localSettings.scoring,
                [setting]: checked,
            },
        });
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        setSettings(localSettings);

        toast.success('Settings saved');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-6">
                <h1 className="text-2xl font-medium text-gray-800">
                    Settings
                </h1>
                <p className="mt-1 text-base text-gray-500">
                    Adjust roster and scoring settings to match your league.
                </p>
            </div>
            <fieldset className="mb-6">
                <legend className="block mb-1 text-sm font-medium text-gray-700">
                    Replacement level
                </legend>
                <ul className="space-y-2">
                    <li>
                        <RadioButton
                            checked={localSettings.replacementLevel === ReplacementLevelMethod.Position}
                            helpText="Replacement level will be determined based on the number of players drafted in each position."
                            id="position-radio"
                            label="By position count"
                            name="replacement-level"
                            onChange={() => handleChangeReplacementLevelMethod(ReplacementLevelMethod.Position)}
                        />
                    </li>
                    <li>
                        <RadioButton
                            checked={localSettings.replacementLevel === ReplacementLevelMethod.Draft}
                            helpText="Replacement level will be based on the average number of players drafted in each position in the first 100 picks."
                            id="draft-radio"
                            label="By average draft count"
                            name="replacement-level"
                            onChange={() => handleChangeReplacementLevelMethod(ReplacementLevelMethod.Draft)}
                        />
                    </li>
                    <li>
                        <RadioButton
                            checked={localSettings.replacementLevel === ReplacementLevelMethod.Blend}
                            helpText="Replacement level will be determined as the average of both the position count and average draft options."
                            id="blend-radio"
                            label="Blend"
                            name="replacement-level"
                            onChange={() => handleChangeReplacementLevelMethod(ReplacementLevelMethod.Blend)}
                        />
                    </li>
                </ul>
            </fieldset>
            <fieldset className="mb-6">
                <legend className="mb-2 text-lg font-medium text-gray-800">
                    Roster
                </legend>
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-4">
                        <Select
                            id="center-select"
                            label="Center (C)"
                            onChange={(value) => handleChangeRosterSetting(value, 'center')}
                            options={rosterSizeOptions}
                            value={String(localSettings.roster.center)}
                        />
                    </div>
                    <div className="col-span-4">
                        <Select
                            id="left-wing-select"
                            label="Left wing (LW)"
                            onChange={(value) => handleChangeRosterSetting(value, 'leftWing')}
                            options={rosterSizeOptions}
                            value={String(localSettings.roster.leftWing)}
                        />
                    </div>
                    <div className="col-span-4">
                        <Select
                            id="right-wing-select"
                            label="Right wing (RW)"
                            onChange={(value) => handleChangeRosterSetting(value, 'rightWing')}
                            options={rosterSizeOptions}
                            value={String(localSettings.roster.rightWing)}
                        />
                    </div>
                    <div className="col-span-4">
                        <Select
                            id="defense-select"
                            label="Defense (D)"
                            onChange={(value) => handleChangeRosterSetting(value, 'defense')}
                            options={defenseRosterSizeOptions}
                            value={String(localSettings.roster.defense)}
                        />
                    </div>
                    <div className="col-span-4">
                        <Select
                            id="goalie-select"
                            label="Goalie (G)"
                            onChange={(value) => handleChangeRosterSetting(value, 'goalie')}
                            options={rosterSizeOptions}
                            value={String(localSettings.roster.goalie)}
                        />
                    </div>
                    <div className="col-span-4">
                        <Select
                            id="bench-select"
                            label="Bench (BN)"
                            onChange={(value) => handleChangeRosterSetting(value, 'bench')}
                            options={benchRosterSizeOptions}
                            value={String(localSettings.roster.bench)}
                        />
                    </div>
                </div>
            </fieldset>
            <fieldset className="grid grid-cols-3 gap-4 mb-6">
                <legend className="mb-2 text-lg font-medium text-gray-800">
                    Scoring
                </legend>
                <fieldset>
                    <legend className="mb-2 text-base text-gray-500">
                        Skaters
                    </legend>
                    <ul>
                        <li>
                            <Checkbox
                                checked={localSettings.scoring.goals}
                                id="goals-checkbox"
                                label="Goals"
                                onChange={(checked) => handleChangeScoringSetting(checked, 'goals')}
                            />
                        </li>
                        <li>
                            <Checkbox
                                checked={localSettings.scoring.assists}
                                id="assists-checkbox"
                                label="Assists"
                                onChange={(checked) => handleChangeScoringSetting(checked, 'assists')}
                            />
                        </li>
                        <li>
                            <Checkbox
                                checked={localSettings.scoring.points}
                                id="points-checkbox"
                                label="Points"
                                onChange={(checked) => handleChangeScoringSetting(checked, 'points')}
                            />
                        </li>
                        <li>
                            <Checkbox
                                checked={localSettings.scoring.plusMinus}
                                id="plus-minus-checkbox"
                                label="+/-"
                                onChange={(checked) => handleChangeScoringSetting(checked, 'plusMinus')}
                            />
                        </li>
                        <li>
                            <Checkbox
                                checked={localSettings.scoring.penaltyMinutes}
                                id="penalty-mins-checkbox"
                                label="Penalty minutes"
                                onChange={(checked) => handleChangeScoringSetting(checked, 'penaltyMinutes')}
                            />
                        </li>
                        <li>
                            <Checkbox
                                checked={localSettings.scoring.powerplayGoals}
                                id="pp-goals-checkbox"
                                label="Powerplay goals"
                                onChange={(checked) => handleChangeScoringSetting(checked, 'powerplayGoals')}
                            />
                        </li>
                        <li>
                            <Checkbox
                                checked={localSettings.scoring.powerplayAssists}
                                id="pp-assists-checkbox"
                                label="Powerplay assists"
                                onChange={(checked) => handleChangeScoringSetting(checked, 'powerplayAssists')}
                            />
                        </li>
                        <li>
                            <Checkbox
                                checked={localSettings.scoring.powerplayPoints}
                                id="pp-points-checkbox"
                                label="Powerplay points"
                                onChange={(checked) => handleChangeScoringSetting(checked, 'powerplayPoints')}
                            />
                        </li>
                        <li>
                            <Checkbox
                                checked={localSettings.scoring.gameWinningGoals}
                                id="game-winning-goals-checkbox"
                                label="Game-winning goals"
                                onChange={(checked) => handleChangeScoringSetting(checked, 'gameWinningGoals')}
                            />
                        </li>
                        <li>
                            <Checkbox
                                checked={localSettings.scoring.shotsOnGoal}
                                id="shots-checkbox"
                                label="Shots on goal"
                                onChange={(checked) => handleChangeScoringSetting(checked, 'shotsOnGoal')}
                            />
                        </li>
                        <li>
                            <Checkbox
                                checked={localSettings.scoring.faceoffsWon}
                                id="faceoff-wins-checkbox"
                                label="Faceoffs won"
                                onChange={(checked) => handleChangeScoringSetting(checked, 'faceoffsWon')}
                            />
                        </li>
                        <li>
                            <Checkbox
                                checked={localSettings.scoring.faceoffsLost}
                                id="faceoff-losses-checkbox"
                                label="Faceoffs lost"
                                onChange={(checked) => handleChangeScoringSetting(checked, 'faceoffsLost')}
                            />
                        </li>
                        <li>
                            <Checkbox
                                checked={localSettings.scoring.hits}
                                id="hits-checkbox"
                                label="Hits"
                                onChange={(checked) => handleChangeScoringSetting(checked, 'hits')}
                            />
                        </li>
                        <li>
                            <Checkbox
                                checked={localSettings.scoring.blocks}
                                id="blocks-checkbox"
                                label="Blocks"
                                onChange={(checked) => handleChangeScoringSetting(checked, 'blocks')}
                            />
                        </li>
                    </ul>
                </fieldset>
                <fieldset>
                    <legend className="mb-2 text-base text-gray-500">
                        Goalies
                    </legend>
                    <ul>
                        <li>
                            <Checkbox
                                checked={localSettings.scoring.wins}
                                id="wins-checkbox"
                                label="Wins"
                                onChange={(checked) => handleChangeScoringSetting(checked, 'wins')}
                            />
                        </li>
                        <li>
                            <Checkbox
                                checked={localSettings.scoring.losses}
                                id="losses-checkbox"
                                label="Losses"
                                onChange={(checked) => handleChangeScoringSetting(checked, 'losses')}
                            />
                        </li>
                        <li>
                            <Checkbox
                                checked={localSettings.scoring.goalsAgainst}
                                id="goals-against-checkbox"
                                label="Goals against"
                                onChange={(checked) => handleChangeScoringSetting(checked, 'goalsAgainst')}
                            />
                        </li>
                        <li>
                            <Checkbox
                                checked={localSettings.scoring.goalsAgainstAverage}
                                id="goals-against-avg-checkbox"
                                label="Goals against average"
                                onChange={(checked) => handleChangeScoringSetting(checked, 'goalsAgainstAverage')}
                            />
                        </li>
                        <li>
                            <Checkbox
                                checked={localSettings.scoring.saves}
                                id="saves-checkbox"
                                label="Saves"
                                onChange={(checked) => handleChangeScoringSetting(checked, 'saves')}
                            />
                        </li>
                        <li>
                            <Checkbox
                                checked={localSettings.scoring.savePercentage}
                                id="save-pct-checkbox"
                                label="Save percentage"
                                onChange={(checked) => handleChangeScoringSetting(checked, 'savePercentage')}
                            />
                        </li>
                        <li>
                            <Checkbox
                                checked={localSettings.scoring.shutouts}
                                id="shutouts-checkbox"
                                label="Shutouts"
                                onChange={(checked) => handleChangeScoringSetting(checked, 'shutouts')}
                            />
                        </li>
                    </ul>
                </fieldset>
            </fieldset>
            <div className="flex justify-end pt-4 border-t">
                <Button primary submit>
                    Save changes
                </Button>
            </div>
        </form>
    );
};

export default Settings;
