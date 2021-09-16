import Papa, { ParseError } from 'papaparse';
import * as React from 'react';
import { useSettings } from '../../contexts/SettingsContext/SettingsContext';

interface PlayerStats {
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
    averages: PlayerStats;
    totals: PlayerStats;
    zScores: PlayerStats;
}

interface PlayerDataState {
    data: PlayerData[] | undefined;
    errors: Papa.ParseError[];
    loadingMessage: string | undefined;
    setDataSource: React.Dispatch<React.SetStateAction<File | string>>;
}

interface RawPlayerData {
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

const averagesCategories = ['savePercentage', 'goalsAgainstAverage'];
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

const usePlayerData = (): PlayerDataState => {
    const [data, setData] = React.useState<PlayerData[]>();
    const [dataSource, setDataSource] = React.useState<File | string>(`${window.location.href}/sample.csv`);
    const [errors, setErrors] = React.useState<ParseError[]>([]);
    const [loadingMessage, setLoadingMessage] = React.useState<string | undefined>();
    const [rawData, setRawData] = React.useState<RawPlayerData[]>();

    const [settings] = useSettings();

    React.useEffect(() => {
        setLoadingMessage('Parsing data file');

        Papa.parse<RawPlayerData>(dataSource, {
            complete: (results) => {
                setErrors(results.errors);
                setRawData(results.errors.length ? [] : results.data);
            },
            download: typeof dataSource === 'string',
            dynamicTyping: true,
            header: true,
            worker: true,
        });
    }, [dataSource]);

    React.useEffect(() => {
        if (!rawData) return;

        setLoadingMessage('Calculating standard deviations');

        const standardDeviations = Object.entries(settings.scoring).reduce((obj: Record<string, any>, [setting, value]) => {
            obj[setting] = value ? getAverageAndStdDev(rawData, statsToRawDataMap[setting]) : 0;
            return obj;
        }, {});

        setLoadingMessage('Calculating fantasy points');

        const updatedData = rawData.map((rpd) => {
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
                rank: 0, // TODO
                name: rpd.Name,
                team: rpd.Team,
                position: rpd.Pos,
                fantasyPoints: Object.values(zScores).reduce((sum, value) => {
                    return value ? sum + value : sum;
                }, 0),
                valueOverReplacement: 0, // TODO
                averageDraftPosition: rpd.ADP,
                difference: 0, // TODO
                gamesPlayed: rpd.GP,
                averages: kvps.reduce((stats, [key, value]) => {
                    const category = rawDataToStatsMap[key];
                    if (!category) {
                        return stats;
                    }

                    if (value !== null
                        && rpd.GP !== null
                        && rpd.GP > 0
                        && !averagesCategories.includes(category)
                    ) {
                        stats[category] = value / rpd.GP;
                    } else {
                        stats[category] = value;
                    }

                    return stats;
                }, {} as PlayerStats),
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

        setData(updatedData);
        setLoadingMessage(undefined);
    }, [rawData, settings]);

    return {
        data,
        errors,
        loadingMessage,
        setDataSource,
    };
};

export default usePlayerData;
