import React, {useEffect} from 'react';
import {ICar} from "../interfaces";
import CompletedCarCard from "./CompletedCarCard";
import {useAppSelector} from "../hooks/redux-hooks";
import PaginationControls from './PaginationControls';

const CompletedCarsList = () => {
    const searchBool = useAppSelector(state => state.data.searchCCarBool);
    const { currentPage, itemsPerPage } = useAppSelector(
        state => state.data.completedCarsPagination
    );

    const completed_cars = useAppSelector(state => {
        return (state.data.data?.cars ?? [])
            .filter(car => car?.status?.level === 6);
    });

    const search_completed_cars = useAppSelector(state => {
        return (state.data.searchCCars ?? [])
            .filter(car => car?.status?.level === 6);
    });

    const carsToDisplay = searchBool ? search_completed_cars : completed_cars;

    // Пагинация для выданных авто
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCars = carsToDisplay.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        console.log(carsToDisplay)
    }, [searchBool])

    return (
        <div className={'completed_cars_list_container'}>
            {carsToDisplay.length === 0 ? (
                <div className={'not_found_search'}>Ничего не найдено...</div>
            ) : (
                <>
                    {paginatedCars.map((car, index) => (
                        <CompletedCarCard key={index} completedCar={car} />
                    ))}

                    <PaginationControls
                        paginationType="completed"
                        totalItems={carsToDisplay.length}
                    />
                </>
            )}
        </div>
    );
};

export default CompletedCarsList;