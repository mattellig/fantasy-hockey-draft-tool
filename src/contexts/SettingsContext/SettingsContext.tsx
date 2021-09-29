import * as React from 'react';

export enum ReplacementLevelMethod {
    Blend = 'blend',
    Draft = 'draft',
    Position = 'position',
}

export interface RosterSettings {
    bench: number;
    center: number;
    defense: number;
    goalie: number;
    leftWing: number;
    rightWing: number;
}

export interface ScoringSettings {
    goals: boolean;
    assists: boolean;
    points: boolean;
    plusMinus: boolean;
    penaltyMinutes: boolean;
    powerplayGoals: boolean;
    powerplayAssists: boolean;
    powerplayPoints: boolean;
    gameWinningGoals: boolean;
    shotsOnGoal: boolean;
    faceoffsWon: boolean;
    faceoffsLost: boolean;
    hits: boolean;
    blocks: boolean;
    wins: boolean;
    losses: boolean;
    goalsAgainst: boolean;
    goalsAgainstAverage: boolean;
    saves: boolean;
    savePercentage: boolean;
    shutouts: boolean;
}

export interface Team {
    draftPosition: number;
    id: number;
    name: string;
}

export interface SettingsState {
    data: {
        isTotal: boolean;
        source: File | string;
    };
    replacementLevel: ReplacementLevelMethod;
    roster: RosterSettings;
    scoring: ScoringSettings;
    teams: Team[];
}

type SettingsAndUpdater = [SettingsState, (newSettings: SettingsState) => void];

interface SettingsProviderProps {
    children?: React.ReactNode;
}

const SettingsContext = React.createContext<SettingsAndUpdater | undefined>(undefined);

export const myTeamId = 0;

export const acronymToSettingsMap: Record<string, keyof ScoringSettings> = {
    G: 'goals',
    A: 'assists',
    PTS: 'points',
    '+/-': 'plusMinus',
    PIM: 'penaltyMinutes',
    PPG: 'powerplayGoals',
    PPA: 'powerplayAssists',
    PPP: 'powerplayPoints',
    GWG: 'gameWinningGoals',
    SOG: 'shotsOnGoal',
    FOW: 'faceoffsWon',
    FOL: 'faceoffsLost',
    HIT: 'hits',
    BLK: 'blocks',
    W: 'wins',
    L: 'losses',
    GA: 'goalsAgainst',
    GAA: 'goalsAgainstAverage',
    SV: 'saves',
    'SV%': 'savePercentage',
    SO: 'shutouts',
};

export const settingsToAcronymMap: Record<keyof ScoringSettings, string> = {
    goals: 'G',
    assists: 'A',
    points: 'PTS',
    plusMinus: '+/-',
    penaltyMinutes: 'PIM',
    powerplayGoals: 'PPG',
    powerplayAssists: 'PPA',
    powerplayPoints: 'PPP',
    gameWinningGoals: 'GWG',
    shotsOnGoal: 'SOG',
    faceoffsWon: 'FOW',
    faceoffsLost: 'FOL',
    hits: 'HIT',
    blocks: 'BLK',
    wins: 'W',
    losses: 'L',
    goalsAgainst: 'GA',
    goalsAgainstAverage: 'GAA',
    saves: 'SV',
    savePercentage: 'SV%',
    shutouts: 'SO',
};

const defaultSettings: SettingsState = {
    data: {
        isTotal: true,
        source: 'sample.csv',
    },
    replacementLevel: ReplacementLevelMethod.Blend,
    roster: {
        bench: 4,
        center: 2,
        defense: 4,
        goalie: 2,
        leftWing: 2,
        rightWing: 2,
    },
    scoring: {
        goals: true,
        assists: true,
        points: false,
        plusMinus: true,
        penaltyMinutes: false,
        powerplayGoals: false,
        powerplayAssists: false,
        powerplayPoints: true,
        gameWinningGoals: false,
        shotsOnGoal: true,
        faceoffsWon: false,
        faceoffsLost: false,
        hits: true,
        blocks: false,
        wins: true,
        losses: false,
        goalsAgainst: false,
        goalsAgainstAverage: true,
        saves: false,
        savePercentage: true,
        shutouts: true,
    },
    teams: [
        { id: myTeamId, name: 'Your Team', draftPosition: 1 },
        { id: 1, name: 'Team 2', draftPosition: 2 },
        { id: 2, name: 'Team 3', draftPosition: 3 },
        { id: 3, name: 'Team 4', draftPosition: 4 },
        { id: 4, name: 'Team 5', draftPosition: 5 },
        { id: 5, name: 'Team 6', draftPosition: 6 },
        { id: 6, name: 'Team 7', draftPosition: 7 },
        { id: 7, name: 'Team 8', draftPosition: 8 },
        { id: 8, name: 'Team 9', draftPosition: 9 },
        { id: 9, name: 'Team 10', draftPosition: 10 },
    ],
};

const storageKey = 'fhdt-settings';

const getDefaultSettings = () => {
    const storedSettings = localStorage.getItem(storageKey);
    if (storedSettings) {
        const parsedSettings: SettingsState = JSON.parse(storedSettings);

        return {
            ...defaultSettings,
            ...parsedSettings,
            data: defaultSettings.data, // custom files aren't saved, so reset data always
        };
    }

    return defaultSettings;
};

const SettingsProvider = ({ children }: SettingsProviderProps): JSX.Element => {
    const [settings, setSettings] = React.useState(getDefaultSettings());

    const handleUpdate = (newSettings: SettingsState) => {
        localStorage.setItem(storageKey, JSON.stringify(newSettings));
        setSettings(newSettings);
    };

    return (
        <SettingsContext.Provider value={[settings, handleUpdate]}>
            {children}
        </SettingsContext.Provider>
    );
};

const useSettings = (): SettingsAndUpdater => {
    const context = React.useContext(SettingsContext);

    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }

    return context;
};

export { SettingsProvider, useSettings };
