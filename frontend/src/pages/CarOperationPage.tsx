import React from 'react';
import './pages.sass'
import CarOperation from "../components/CarOperation";

const CarOperationPage = () => {
    return (
        <div className={'car_operation_page'}>
            <CarOperation />
        </div>
    );
};

export default CarOperationPage;