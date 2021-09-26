import { PlusIcon } from '@heroicons/react/outline';
import { XIcon } from '@heroicons/react/solid';
import * as React from 'react';
import Button from '../../../../components/Button/Button';
import Input from '../../../../components/Input/Input';
import Select from '../../../../components/Select/Select';
import { Team } from '../../../../contexts/SettingsContext/SettingsContext';

interface TeamRowWithControls {
    canAdd: boolean;
    canBeRemoved: boolean;
    hideControls?: false | never;
    onAdd: () => void;
    onRemove: (index: number) => void;
}

interface TeamRowWithoutControls {
    canAdd?: never;
    canBeRemoved?: never;
    hideControls: true;
    onAdd?: never;
    onRemove?: never;
}

type TeamRowProps = {
    draftPositionOptions: string[];
    index: number;
    onChangeDraftPosition: (index: number, newDraftPosition: number) => void;
    onChangeName: (index: number, newName: string) => void;
    team: Team;
} & (TeamRowWithControls | TeamRowWithoutControls);

const TeamRow = (props: TeamRowProps): JSX.Element => {
    const {
        canAdd = false,
        canBeRemoved,
        draftPositionOptions,
        hideControls = false,
        index,
        onAdd,
        onChangeDraftPosition,
        onChangeName,
        onRemove,
        team,
    } = props;

    return (
        <fieldset className="mb-6">
            <legend className="sr-only">
                Team #{index + 1}
            </legend>
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-4">
                    <Input
                        id={`name-input-${team.id}`}
                        label="Name"
                        onChange={(value) => onChangeName(index, value)}
                        required
                        value={team.name}
                    />
                </div>
                <div className="col-span-2">
                    <Select
                        id="my-draft-position-select"
                        label="Draft position"
                        onChange={(value) => onChangeDraftPosition(index, Number(value))}
                        options={draftPositionOptions}
                        value={String(team.draftPosition)}
                    />
                </div>
                {!hideControls ? (
                    <div className="flex items-end space-x-2 pb-0.5">
                        <Button
                            disabled={!canBeRemoved}
                            icon={<XIcon />}
                            onClick={() => onRemove!(index)}
                        >
                            Remove
                        </Button>
                        {canAdd ? (
                            <Button icon={<PlusIcon />} onClick={onAdd}>
                                Add
                            </Button>
                        ) : null}
                    </div>
                ) : null}
            </div>
        </fieldset>
    );
};

export default TeamRow;
