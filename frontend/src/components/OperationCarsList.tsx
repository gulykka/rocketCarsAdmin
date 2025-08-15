import React from 'react';
import OperationCarCard from "./OperationCarCard";
import {ICar} from "../interfaces";
import {useAppSelector} from "../hooks/redux-hooks";

const OperationCarsList = () => {

    const searchBool = useAppSelector(state => state.data.searchOCarBool)

    const operation_cars = useAppSelector(state => {
        return (state.data.data?.cars ?? [])
            .filter(car => car?.status?.level !== 6)
    })

    const search_operation_cars = useAppSelector(state => {
        return (state.data.searchOCars ?? [])
            .filter(car => car?.status?.level !== 6)
    })

    return (
        <div className={'operation_car_container'}>
            {searchBool
                ?
                (search_operation_cars.length === 0
                    ?
                    <div className={'not_found_search'}>Ничего не найдено...</div>
                    :
                    search_operation_cars.map((car, index) => <OperationCarCard key={index} operationCar={car}/>))
                :
                operation_cars.map((car, index) => <OperationCarCard key={index} operationCar={car}/>)
            }
        </div>
    );
};

export default OperationCarsList;