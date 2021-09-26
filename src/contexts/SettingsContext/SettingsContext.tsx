import * as React from 'react';

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

export interface SettingsState {
    data: {
        isTotal: boolean;
        source: File | string;
    };
    roster: RosterSettings;
    scoring: ScoringSettings;
    teams: number;
}

type SettingsAndDispatch = [SettingsState, React.Dispatch<React.SetStateAction<SettingsState>>];

interface SettingsProviderProps {
    children?: React.ReactNode;
}

const defaultSettings: SettingsState = {
    data: {
        isTotal: true,
        source: 'sample.csv',
    },
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
    teams: 10,
};

const SettingsContext = React.createContext<SettingsAndDispatch | undefined>(undefined);

const SettingsProvider = ({ children }: SettingsProviderProps): JSX.Element => {
    const [settings, setSettings] = React.useState(defaultSettings);

    return (
        <SettingsContext.Provider value={[settings, setSettings]}>
            {children}
        </SettingsContext.Provider>
    );
};

const useSettings = (): SettingsAndDispatch => {
    const context = React.useContext(SettingsContext);

    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }

    return context;
};

export { SettingsProvider, useSettings };
