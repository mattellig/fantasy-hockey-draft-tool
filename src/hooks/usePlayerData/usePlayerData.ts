import Papa, { ParseError } from 'papaparse';
import * as React from 'react';
import { ReplacementLevelMethod, RosterSettings, Team, useSettings } from '../../contexts/SettingsContext/SettingsContext';
import parseDataFile from '../../utils/parseDataFile/parseDataFile';

export interface PlayerStats {
    goals: number | null;
    assists: number | null;
    points: number | null;
    plusMinus: number | null;
    penaltyMinutes: number | null;
    powerplayGoals: number | null;
    powerplayAssists: number | null;
    powerplayPoints: number | null;
    gameWinningGoals: number | null;
    shotsOnGoal: number | null;
    faceoffsWon: number | null;
    faceoffsLost: number | null;
    hits: number | null;
    blocks: number | null;
    wins: number | null;
    losses: number | null;
    goalsAgainst: number | null;
    goalsAgainstAverage: number | null;
    saves: number | null;
    savePercentage: number | null;
    shutouts: number | null;
}

export interface PlayerData {
    rank: number;
    name: string | null;
    team: string | null;
    position: string | null;
    fantasyPoints: number;
    valueOverReplacement: number;
    averageDraftPosition: number | null;
    difference: number | null;
    gamesPlayed: number | null;
    totals: PlayerStats;
    zScores: PlayerStats;
}

export interface RawPlayerData {
    Name: string | null;
    Team: string | null;
    Pos: string | null;
    ADP: number | null;
    GP: number | null;
    G: number | null;
    A: number | null;
    PTS: number | null;
    '+/-': number | null;
    PIM: number | null;
    PPG: number | null;
    PPA: number | null;
    PPP: number | null;
    GWG: number | null;
    SOG: number | null;
    FOW: number | null;
    FOL: number | null;
    HIT: number | null;
    BLK: number | null;
    W: number | null;
    L: number | null;
    GA: number | null;
    GAA: number | null;
    SV: number | null;
    'SV%': number | null;
    SO: number | null;
}

interface PlayerDataState {
    data: PlayerData[] | undefined;
    errors: Papa.ParseError[];
    loading: boolean;
}

const negativeCategories = ['faceoffsLost', 'goalsAgainstAverage', 'goalsAgainst', 'losses'];

const rawDataToStatsMap: Record<string, keyof PlayerStats> = {
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

const statsToRawDataMap: Record<string, keyof RawPlayerData> = {
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

const topOneHundredSelections: Record<keyof RosterSettings, number> = {
    bench: 0,
    center: 24,
    leftWing: 19,
    rightWing: 19,
    defense: 18,
    goalie: 20,
};

const getAverageAndStdDev = (data: RawPlayerData[], category: keyof RawPlayerData) => {
    if (data.length === 0) return { avg: 0, stdev: 0 };

    const validData = data.filter((rpd) => rpd[category] !== null);
    const length = validData.length;

    if (length === 0) {
        return { avg: 0, stdev: 0 };
    }

    const avg = validData.reduce((a, b) => a + (b[category] as number), 0) / length;
    const stdev = Math.sqrt(
        validData
            .map((rpd) => Math.pow((rpd[category] as number) - avg, 2))
            .reduce((a, b) => a + b) / length,
    );

    return { avg, stdev };
};

const getReplacementLevelIndex = (mode: ReplacementLevelMethod, teams: Team[], roster: RosterSettings, position: keyof RosterSettings) => {
    const playerCount = teams.length * roster[position];
    if (mode === ReplacementLevelMethod.Position) {
        return playerCount;
    }

    const positionCount = position === 'defense' ? 4 : 2;

    const topOneHundredCount = Math.round(topOneHundredSelections[position] * (roster[position] / positionCount) * (teams.length / 12));
    if (mode === ReplacementLevelMethod.Draft) {
        return topOneHundredCount;
    }

    return Math.round((playerCount + topOneHundredCount) / 2);
};

const getStatAsTotal = (statValue: number | null, gamesPlayed: number) => statValue !== null
    ? (statValue * gamesPlayed)
    : null;

const sortPlayerData = (a: PlayerData, b: PlayerData) => b.fantasyPoints - a.fantasyPoints;

const usePlayerData = (): PlayerDataState => {
    const [data, setData] = React.useState<PlayerData[]>();
    const [errors, setErrors] = React.useState<ParseError[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [rawData, setRawData] = React.useState<RawPlayerData[]>();

    const [settings] = useSettings();

    React.useEffect(() => {
        setLoading(true);
        parseDataFile<RawPlayerData>(settings.data.source, (parseData, parseErrors) => {
            setErrors(parseErrors);

            if (!settings.data.isTotal) {
                setRawData(parseData.map((rpd) => rpd.GP === null ? rpd : {
                    ...rpd,
                    G: getStatAsTotal(rpd.G, rpd.GP),
                    A: getStatAsTotal(rpd.A, rpd.GP),
                    PTS: getStatAsTotal(rpd.PTS, rpd.GP),
                    '+/-': getStatAsTotal(rpd['+/-'], rpd.GP),
                    PIM: getStatAsTotal(rpd.PIM, rpd.GP),
                    PPG: getStatAsTotal(rpd.PPG, rpd.GP),
                    PPA: getStatAsTotal(rpd.PPA, rpd.GP),
                    PPP: getStatAsTotal(rpd.PPP, rpd.GP),
                    GWG: getStatAsTotal(rpd.GWG, rpd.GP),
                    SOG: getStatAsTotal(rpd.SOG, rpd.GP),
                    FOW: getStatAsTotal(rpd.FOW, rpd.GP),
                    FOL: getStatAsTotal(rpd.FOL, rpd.GP),
                    HIT: getStatAsTotal(rpd.HIT, rpd.GP),
                    BLK: getStatAsTotal(rpd.BLK, rpd.GP),
                    W: getStatAsTotal(rpd.W, rpd.GP),
                    L: getStatAsTotal(rpd.L, rpd.GP),
                    GA: getStatAsTotal(rpd.GA, rpd.GP),
                    SV: getStatAsTotal(rpd.SV, rpd.GP),
                    SO: getStatAsTotal(rpd.SO, rpd.GP),
                }));
            } else {
                setRawData(parseData);
            }
        });
    }, [settings.data.isTotal, settings.data.source]);

    React.useEffect(() => {
        if (!rawData) return;

        const {
            replacementLevel,
            roster,
            scoring,
            teams,
        } = settings;

        const standardDeviations = Object.entries(scoring).reduce((obj: Record<string, any>, [setting, value]) => {
            obj[setting] = value ? getAverageAndStdDev(rawData, statsToRawDataMap[setting]) : 0;
            return obj;
        }, {});

        const dataWithFantasyPoints: PlayerData[] = rawData.map((rpd) => {
            const kvps = Object.entries(rpd);

            const zScores = kvps.reduce((stats, [key, value]) => {
                const category = rawDataToStatsMap[key];
                if (!category) {
                    return stats;
                }

                if (value !== null) {
                    const cat = standardDeviations[category];

                    stats[category] = cat
                        ? ((value - cat.avg) / cat.stdev) * (negativeCategories.includes(category) ? -1 : 1)
                        : null;
                } else {
                    stats[category] = null;
                }

                return stats;
            }, {} as PlayerStats);

            return {
                rank: 0,
                name: rpd.Name,
                team: rpd.Team,
                position: rpd.Pos,
                fantasyPoints: Object.values(zScores).reduce((sum, value) => {
                    return value ? sum + value : sum;
                }, 0),
                valueOverReplacement: 0,
                averageDraftPosition: rpd.ADP,
                difference: null,
                gamesPlayed: rpd.GP,
                totals: {
                    goals: rpd.G,
                    assists: rpd.A,
                    points: rpd.PTS,
                    plusMinus: rpd['+/-'],
                    penaltyMinutes: rpd.PIM,
                    powerplayGoals: rpd.PPG,
                    powerplayAssists: rpd.PPA,
                    powerplayPoints: rpd.PPP,
                    gameWinningGoals: rpd.GWG,
                    shotsOnGoal: rpd.SOG,
                    faceoffsWon: rpd.FOW,
                    faceoffsLost: rpd.FOL,
                    hits: rpd.HIT,
                    blocks: rpd.BLK,
                    wins: rpd.W,
                    losses: rpd.L,
                    goalsAgainst: rpd.GA,
                    goalsAgainstAverage: rpd.GAA,
                    saves: rpd.SV,
                    savePercentage: rpd['SV%'],
                    shutouts: rpd.SO,
                },
                zScores,
            };
        });

        const centers = dataWithFantasyPoints
            .filter((pd) => pd.position?.toLowerCase().includes('c'))
            .sort(sortPlayerData);

        const leftWings = dataWithFantasyPoints
            .filter((pd) => pd.position?.toLowerCase().includes('lw'))
            .sort(sortPlayerData);

        const rightWings = dataWithFantasyPoints
            .filter((pd) => pd.position?.toLowerCase().includes('rw'))
            .sort(sortPlayerData);

        const defense = dataWithFantasyPoints
            .filter((pd) => pd.position?.toLowerCase().includes('d'))
            .sort(sortPlayerData);

        const goalies = dataWithFantasyPoints
            .filter((pd) => pd.position?.toLowerCase() === 'g')
            .sort(sortPlayerData);

        const replacementPlayerRanks = {
            center: getReplacementLevelIndex(replacementLevel, teams, roster, 'center'),
            leftWing: getReplacementLevelIndex(replacementLevel, teams, roster, 'leftWing'),
            rightWing: getReplacementLevelIndex(replacementLevel, teams, roster, 'rightWing'),
            defense: getReplacementLevelIndex(replacementLevel, teams, roster, 'defense'),
            goalie: getReplacementLevelIndex(replacementLevel, teams, roster, 'goalie'),
        };

        const replacementPlayerValues = {
            center: centers[replacementPlayerRanks.center]?.fantasyPoints || 0,
            leftWing: leftWings[replacementPlayerRanks.leftWing]?.fantasyPoints || 0,
            rightWing: rightWings[replacementPlayerRanks.rightWing]?.fantasyPoints || 0,
            defense: defense[replacementPlayerRanks.defense]?.fantasyPoints || 0,
            goalie: goalies[replacementPlayerRanks.goalie]?.fantasyPoints || 0,
        };

        for (const playerData of dataWithFantasyPoints) {
            const position = playerData.position?.toLowerCase();
            if (position === 'g') {
                playerData.valueOverReplacement = playerData.fantasyPoints - replacementPlayerValues.goalie;
            } else if (position === 'd') {
                playerData.valueOverReplacement = playerData.fantasyPoints - replacementPlayerValues.defense;
            } else if (position?.includes('rw')) {
                playerData.valueOverReplacement = playerData.fantasyPoints - replacementPlayerValues.rightWing;
            } else if (position?.includes('lw')) {
                playerData.valueOverReplacement = playerData.fantasyPoints - replacementPlayerValues.leftWing;
            } else {
                // assume 'c' if no other position set
                playerData.valueOverReplacement = playerData.fantasyPoints - replacementPlayerValues.center;
            }
        }

        const rankedData = dataWithFantasyPoints
            .sort((a, b) => b.valueOverReplacement - a.valueOverReplacement)
            .map((pd, index) => {
                const rank = index + 1;

                return {
                    ...pd,
                    difference: (pd.averageDraftPosition || 0) - rank,
                    rank,
                };
            });

        setData(rankedData);
        setLoading(false);
    }, [rawData, settings]);

    return { data, errors, loading };
};

export default usePlayerData;
