import React from 'react';
import {ICompletedCar} from "../interfaces";
import CompletedCarCard from "./CompletedCarCard";

const CompletedCarsList = () => {

    const carsList:ICompletedCar[] = [
        {
            name: 'Петров Пётр Петрович',
            VIN: 'LDP91C96XPE203384',
            auto: 'Voyah Passion',
            year: '2023',
            photos: [
                {
                    url: 'photos_1.jpg'
                },
                {
                    url: 'photos_2.jpg'
                }
            ],
            status: 'Успешно получен'
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
            status: 'Успешно получен'
        },

    ]

    return (
        <div className={'completed_cars_list_container'}>
            {carsList.map((car, index) => <CompletedCarCard key={index} completedCar={car} />)}
        </div>
    );
};

export default CompletedCarsList;