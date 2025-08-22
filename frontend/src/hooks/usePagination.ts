import { useAppSelector } from "./redux-hooks";
import { ICar } from "../interfaces";

interface UsePaginationResult {
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
    paginatedCars: ICar[];
    startIndex: number;
    endIndex: number;
    totalItems: number;
}

export const usePagination = (cars: ICar[], paginationType: 'completed' | 'operation'): UsePaginationResult => {
    // Получаем соответствующую пагинацию в зависимости от типа
    const pagination = useAppSelector(state =>
        paginationType === 'completed'
            ? state.data.completedCarsPagination
            : state.data.operationCarsPagination
    );

    const { currentPage, itemsPerPage } = pagination;
    const totalItems = cars.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Корректируем currentPage, если он выходит за границы
    const adjustedCurrentPage = Math.min(Math.max(1, currentPage), totalPages || 1);

    const startIndex = (adjustedCurrentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const paginatedCars = cars.slice(startIndex, endIndex);

    return {
        currentPage: adjustedCurrentPage,
        itemsPerPage,
        totalPages: totalPages || 1,
        paginatedCars,
        startIndex,
        endIndex,
        totalItems
    };
};

// Дополнительный хук для получения информации о пагинации без фильтрации машин
export const usePaginationInfo = (paginationType: 'completed' | 'operation') => {
    const pagination = useAppSelector(state =>
        paginationType === 'completed'
            ? state.data.completedCarsPagination
            : state.data.operationCarsPagination
    );

    return {
        currentPage: pagination.currentPage,
        itemsPerPage: pagination.itemsPerPage,
        totalPages: pagination.totalPages
    };
};

// Хук для получения отфильтрованных машин с автоматической пагинацией
export const usePaginatedCars = (paginationType: 'completed' | 'operation') => {
    const { searchCCarBool, searchOCarBool, searchCCars, searchOCars, data } = useAppSelector(state => state.data);

    // Определяем, какие машины показывать в зависимости от типа и поиска
    let carsToDisplay: ICar[] = [];

    if (paginationType === 'completed') {
        const allCompletedCars = (data?.cars ?? []).filter(car => car?.status?.level === 6);
        carsToDisplay = searchCCarBool ? (searchCCars?.filter(car => car?.status?.level === 6) || []) : allCompletedCars;
    } else {
        const allOperationCars = (data?.cars ?? []).filter(car => car?.status?.level !== 6);
        carsToDisplay = searchOCarBool ? (searchOCars?.filter(car => car?.status?.level !== 6) || []) : allOperationCars;
    }

    // Используем основной хук пагинации
    const pagination = usePagination(carsToDisplay, paginationType);

    return {
        ...pagination,
        allCars: carsToDisplay,
        isSearching: paginationType === 'completed' ? searchCCarBool : searchOCarBool
    };
};