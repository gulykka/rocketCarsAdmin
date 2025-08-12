import React from 'react';
import OperationCarCard from "./OperationCarCard";
import {IOperationCar} from "../interfaces";

const OperationCarsList = () => {

    const carsList:IOperationCar[] = [
        {
            name: 'Петров Пётр Петрович',
            VIN: 'LDP91C96XPE203384',
            auto: 'Voyah Passion',
            year: '2023',
            photos:[
                {
                    url: 'photos_1.jpg'
                }
            ],
            status: 'На стоянке'
        },
        {
            name: 'Петров Пётр Петрович',
            VIN: 'LDP91C96XPE203384',
            auto: 'Voyah Passion',
            year: '2023',
            photos: [
                {
                   url: 'photos_1.jpg'
                }
            ],
            status: 'На стоянке в Китае'
        },

    ]

    return (
        <div className={'operation_car_container'}>
            {carsList.map((car, index) => <OperationCarCard key={index} operationCar={car}/>)}
        </div>
    );
};

export default OperationCarsList;