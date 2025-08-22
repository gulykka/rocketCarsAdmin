import React from 'react';
import OperationCarCard from "./OperationCarCard";
import {useAppSelector} from "../hooks/redux-hooks";
import PaginationControls from './PaginationControls';

const OperationCarsList = () => {
    const searchBool = useAppSelector(state => state.data.searchOCarBool);
    const { currentPage, itemsPerPage } = useAppSelector(
        state => state.data.operationCarsPagination
    );

    const operation_cars = useAppSelector(state => {
        return (state.data.data?.cars ?? [])
            .filter(car => car?.status?.level !== 6);
    });

    const search_operation_cars = useAppSelector(state => {
        return (state.data.searchOCars ?? [])
            .filter(car => car?.status?.level !== 6);
    });

    const carsToDisplay = searchBool ? search_operation_cars : operation_cars;

    // Пагинация для авто в работе
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCars = carsToDisplay.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className={'operation_car_container'}>
            {carsToDisplay.length === 0 ? (
                <div className={'not_found_search'}>Ничего не найдено...</div>
            ) : (
                <>
                    {paginatedCars.map((car, index) => (
                        <OperationCarCard key={index} operationCar={car}/>
                    ))}

                    <PaginationControls
                        paginationType="operation"
                        totalItems={carsToDisplay.length}
                    />
                </>
            )}
        </div>
    );
};

export default OperationCarsList;