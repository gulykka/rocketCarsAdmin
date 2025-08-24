export function formatDateToDDMMYYYY(isoDate: string): string {
    if (!isoDate || typeof isoDate !== 'string') {
        return 'Н/Д'; // или бросить ошибку
    }

    const date = new Date(isoDate);

    // Проверяем, валидна ли дата
    if (isNaN(date.getTime())) {
        console.warn('Неверный формат даты:', isoDate);
        return 'Н/Д';
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}