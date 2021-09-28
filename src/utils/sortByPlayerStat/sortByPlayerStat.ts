const sortByPlayerStat = (a: number | null, b: number | null, ascending: boolean) => {
    if (a === b) {
        return 0;
    }

    if (a === null) {
        return 1;
    }

    if (b === null) {
        return -1;
    }

    return (a - b) * (ascending ? 1 : -1);
};

export default sortByPlayerStat;
