import React from 'react';
import OperationCarCard from "./OperationCarCard";
import {ICar} from "../interfaces";

const OperationCarsList = () => {

    const carsList:ICar[] = []

    return (
        <div className={'operation_car_container'}>
            {carsList.map((car, index) => <OperationCarCard key={index} operationCar={car}/>)}
        </div>
    );
};

export default OperationCarsList;