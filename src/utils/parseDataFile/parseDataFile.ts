import Papa, { ParseError } from 'papaparse';

const parseDataFile = <T>(
    source: File | string,
    cb: (data: T[], errors: ParseError[]) => void,
) => {
    const sourceIsPath = typeof source === 'string';
    const toParse = sourceIsPath
        ? `${window.location.origin}${import.meta.env.BASE_URL}${source}`
        : source;

    Papa.parse<T>(toParse, {
        complete: (results) => {
            cb(results.errors.length ? [] : results.data, results.errors);
        },
        download: sourceIsPath,
        dynamicTyping: true,
        header: true,
        worker: true,
    });
};

export default parseDataFile;
