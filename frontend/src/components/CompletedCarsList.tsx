import React from 'react';
import {ICar} from "../interfaces";
import CompletedCarCard from "./CompletedCarCard";

const CompletedCarsList = () => {

    const carsList:ICar[] = []


    return (
        <div className={'completed_cars_list_container'}>
            {carsList.map((car, index) => <CompletedCarCard key={index} completedCar={car} />)}
        </div>
    );
};

export default CompletedCarsList;