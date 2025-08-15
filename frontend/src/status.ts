export const status = {
    1: 'На оплате/на заводе',
    2: 'На стоянке в Китае',
    3: 'Доставка в РФ',
    4: 'На СВХ',
    5: 'На стоянке',
    6: 'Авто выдан'
}

export function getStatusCode(statusValue: string): number | undefined {
    const entry = Object.entries(status).find(([_, value]) => value === statusValue);
    return entry ? Number(entry[0]) : undefined;
}

interface StatusLengths {
    [key: number]: string;
}

const LEN_STATUS: StatusLengths = {
    1: '70px',
    2: '90px',
    3: '80px',
    4: '50px',
    5: '65px',
    6: '65px'
} as const;

export const getOffset = (code: number | undefined): string => {
    const safeCode = code ?? 0;
    const percentage = Math.min(safeCode, 100) * 16;
    const offset = LEN_STATUS[safeCode] || '0px';

    return `calc(${percentage}% - ${offset})`;
};
// export const status = {
//     'На оплате/на заводе' : 1,
//     'На стоянке в Китае' : 2,
//     'Доставка в РФ': 3,
//     'На СВХ' : 4,
//     'На стоянке': 5,
//     'Авто выдан': 6
// }