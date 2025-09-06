import React, { useEffect } from 'react';
import { useAppDispatch } from '../hooks/redux-hooks';
import {
    setCompletedCarsCurrentPage,
    setCompletedCarsItemsPerPage,
    setOperationCarsCurrentPage,
    setOperationCarsItemsPerPage
} from '../store/slices/carSlice';
import { usePaginationInfo } from '../hooks/usePagination';
import './pagination.sass'

interface PaginationControlsProps {
    paginationType: 'completed' | 'operation';
    totalItems: number;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({paginationType, totalItems}) => {
    const dispatch = useAppDispatch();
    const { currentPage, itemsPerPage } = usePaginationInfo(paginationType);

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Добавляем отладочную информацию
    useEffect(() => {
        // console.log(`PaginationControls ${paginationType}:`, {
        //     totalItems,
        //     itemsPerPage,
        //     currentPage,
        //     totalPages,
        //     shouldRender: totalItems > 0 && totalPages > 1
        // });
    }, [totalItems, itemsPerPage, currentPage, totalPages, paginationType]);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            if (paginationType === 'completed') {
                dispatch(setCompletedCarsCurrentPage(page));
            } else {
                dispatch(setOperationCarsCurrentPage(page));
            }

            // 🔁 Прокручиваем вверх после смены страницы
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newItemsPerPage = parseInt(e.target.value);
        if (paginationType === 'completed') {
            dispatch(setCompletedCarsItemsPerPage(newItemsPerPage));
        } else {
            dispatch(setOperationCarsItemsPerPage(newItemsPerPage));
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });

    };

    // Условия отрисовки - проверьте эти условия
    if (totalItems === 0) {
        // console.log(`Not rendering ${paginationType} - no items`);
        return null;
    }

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisiblePages = 5;
        const sidePages = 2; // Количество страниц по бокам от текущей

        // Всегда показываем первую страницу
        pages.push(1);

        // Определяем диапазон страниц вокруг текущей
        let startPage = Math.max(2, currentPage - sidePages);
        let endPage = Math.min(totalPages - 1, currentPage + sidePages);

        // Добавляем многоточие после первой страницы если нужно
        if (startPage > 2) {
            pages.push('...');
        }

        // Добавляем страницы вокруг текущей
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        // Добавляем многоточие перед последней страницей если нужно
        if (endPage <= totalPages - 1) {
            pages.push('...');
        }

        // Всегда показываем последнюю страницу если она не первая
        if (totalPages > 1) {
            pages.push(totalPages);
        }

        // Убираем дубликаты и сортируем
        const uniquePages = pages.filter((page, index, array) =>
            array.indexOf(page) === index
        );

        return uniquePages;
    };

    const pageNumbers = getPageNumbers();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    // console.log(`Rendering ${paginationType} pagination:`, pageNumbers);

    return (
        <div className="pagination-controls">

            <div className="pagination-main-controls">
                <div className="items-per-page-selector">
                    <label htmlFor={`itemsPerPage-${paginationType}`}>
                        Элементов на странице:
                    </label>
                    <select
                        id={`itemsPerPage-${paginationType}`}
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                        className="items-per-page-select"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                    </select>
                </div>

                <div className="pagination-buttons">
                    <button
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                        className="pagination-button pagination-first"
                        title="Первая страница"
                    >
                        ««
                    </button>

                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="pagination-button pagination-prev"
                        title="Предыдущая страница"
                    >
                        ←
                    </button>

                    {pageNumbers.map((page, index) => {
                        if (page === '...') {
                            return (
                                <span
                                    key={`ellipsis-${index}`}
                                    className="pagination-ellipsis"
                                >
                                    ...
                                </span>
                            );
                        }

                        return (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page as number)}
                                className={`pagination-button pagination-page ${
                                    currentPage === page ? 'active' : ''
                                }`}
                            >
                                {page}
                            </button>
                        );
                    })}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="pagination-button pagination-next"
                        title="Следующая страница"
                    >
                        →
                    </button>

                    <button
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        className="pagination-button pagination-last"
                        title="Последняя страница"
                    >
                        »»
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaginationControls;