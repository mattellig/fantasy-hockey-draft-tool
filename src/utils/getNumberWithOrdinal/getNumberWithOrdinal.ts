const englishOrdinalRules = new Intl.PluralRules('en', { type: 'ordinal' });
const suffixes: Record<string, string> = {
    one: 'st',
    two: 'nd',
    few: 'rd',
    other: 'th',
};

const getNumberWithOrdinal = (n: number) => {
    const suffix = suffixes[englishOrdinalRules.select(n)];
    return `${n}${suffix}`;
};

export default getNumberWithOrdinal;
