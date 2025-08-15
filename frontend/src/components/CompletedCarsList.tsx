import React from 'react';
import {ICar} from "../interfaces";
import CompletedCarCard from "./CompletedCarCard";
import {useAppSelector} from "../hooks/redux-hooks";

const CompletedCarsList = () => {

    const searchBool = useAppSelector(state => state.data.searchCCarBool)

    const completed_cars = useAppSelector(state => {
        return (state.data.data?.cars ?? [])
            .filter(car => car?.status?.level === 6)
    })

    const search_completed_cars = useAppSelector(state => {
        return (state.data.searchCCars ?? [])
            .filter(car => car?.status?.level === 6)
    })


    return (
        <div className={'completed_cars_list_container'}>
            {searchBool
                ?
                (search_completed_cars.length === 0
                    ?
                    <div className={'not_found_search'}>Ничего не найдено...</div>
                    :
                    search_completed_cars?.map((car, index) => <CompletedCarCard key={index} completedCar={car} />))
                :
                completed_cars?.map((car, index) => <CompletedCarCard key={index} completedCar={car} />)
            }
        </div>
    );
};

export default CompletedCarsList;