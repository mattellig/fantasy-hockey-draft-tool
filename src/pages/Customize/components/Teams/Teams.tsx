import * as React from 'react';
import Button from '../../../../components/Button/Button';
import { toast } from '../../../../components/Toast/Toast';
import { useSettings } from '../../../../contexts/SettingsContext/SettingsContext';
import TeamRow from './TeamRow';

const Teams = (): JSX.Element => {
    const [settings, setSettings] = useSettings();

    const [teams, setTeams] = React.useState(settings.teams);

    const draftPositionOptions = React.useMemo(() => {
        const options = [];

        for (let i = 0; i < teams.length; i++) {
            options.push((i + 1).toString());
        }

        return options;
    }, [teams.length]);

    const handleAdd = () => {
        const lastTeam = teams[teams.length - 1];
        const newId = lastTeam.id + 1;

        setTeams([
            ...teams,
            { id: newId, name: `Team ${newId + 1}`, draftPosition: teams.length + 1 },
        ]);
    };

    const handleRemove = (index: number) => {
        const teamsCopy = [...teams];
        const removedTeam = teamsCopy.splice(index, 1)[0];

        for (const team of teamsCopy) {
            if (team.draftPosition > removedTeam.draftPosition) {
                team.draftPosition = team.draftPosition - 1;
            }
        }

        setTeams(teamsCopy);
    };

    const handleChangeDraftPosition = (index: number, newDraftPosition: number) => {
        const teamsCopy = [...teams];
        const team = teamsCopy[index];

        const teamWithDraftPosition = teamsCopy.filter((team) => team.draftPosition === newDraftPosition)[0];
        if (teamWithDraftPosition) {
            teamWithDraftPosition.draftPosition = team.draftPosition;
        }

        team.draftPosition = newDraftPosition;

        setTeams(teamsCopy);
    };

    const handleChangeName = (index: number, newName: string) => {
        const teamsCopy = [...teams];

        teamsCopy[index].name = newName;

        setTeams(teamsCopy);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        setSettings({ ...settings, teams });

        toast.success('Teams updated');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-6">
                <h1 className="text-2xl font-medium text-gray-800">
                    Teams
                </h1>
                <p className="mt-1 text-base text-gray-500">
                    Configure the teams taking part in your draft.
                </p>
            </div>
            <fieldset className="mb-6">
                <legend className="mb-2 text-lg font-medium text-gray-800">
                    Your team
                </legend>
                <TeamRow
                    draftPositionOptions={draftPositionOptions}
                    hideControls
                    index={0}
                    onChangeDraftPosition={handleChangeDraftPosition}
                    onChangeName={handleChangeName}
                    team={teams[0]}
                />
            </fieldset>
            <fieldset>
                <legend className="mb-2 text-lg font-medium text-gray-800">
                    Other teams
                </legend>
                {teams.map((team, index) => index > 0 ? (
                    <TeamRow
                        key={team.id}
                        canAdd={teams.length < 20 && index === teams.length - 1}
                        canBeRemoved={teams.length > 4}
                        draftPositionOptions={draftPositionOptions}
                        index={index}
                        onAdd={handleAdd}
                        onChangeDraftPosition={handleChangeDraftPosition}
                        onChangeName={handleChangeName}
                        onRemove={handleRemove}
                        team={team}
                    />
                ) : null)}
            </fieldset>
            <div className="flex justify-end pt-4 border-t">
                <Button primary submit>
                    Save changes
                </Button>
            </div>
        </form>
    );
};

export default Teams;
